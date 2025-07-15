// lib/actions/new/specification/manage.actions.ts
// Функции управления спецификациями (новая версия)

"use server";

import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  CreateSpecificationSchema,
  UpdateSpecificationSchema,
  CreateSpecificationInput,
  UpdateSpecificationInput,
} from "@/lib/validations/new/specification.validation";

/**
 * ============================================================================
 * SPECIFICATION MANAGEMENT ACTIONS - Новая версия
 * ============================================================================
 */

/**
 * Создает новую спецификацию с привязкой к категориям
 */
export async function createSpecification(data: CreateSpecificationInput) {
  try {
    console.log("🚀 Server received data:", data);
    console.log("🖼️ Server iconImage field:", data.iconImage);
    const validatedData = CreateSpecificationSchema.parse(data);
    console.log("✅ Validated data:", validatedData);

    // Проверяем уникальность ключа
    const existingSpecification = await prisma.specification.findUnique({
      where: { key: validatedData.key },
    });

    if (existingSpecification) {
      return {
        success: false,
        message: "Спецификация с таким ключом уже существует",
      };
    }

    // Определяем целевые категории
    let targetCategoryIds: string[] = [];

    if (validatedData.isGlobal) {
      const allActiveCategories = await prisma.category.findMany({
        where: { isActive: true },
        select: { id: true },
      });
      targetCategoryIds = allActiveCategories.map((cat) => cat.id);
    } else if (validatedData.categoryIds) {
      targetCategoryIds = validatedData.categoryIds;
    }

    // Создаем спецификацию и связи в транзакции
    const result = await prisma.$transaction(async (tx) => {
      // Создаем спецификацию
      const createData = {
        name: validatedData.name,
        key: validatedData.key,
        description: validatedData.description || null,
        unit: validatedData.unit || null,
        type: validatedData.type,
        options: validatedData.options || [],
        icon: validatedData.iconImage || null,
        isActive: validatedData.isActive,
        sortOrder: validatedData.sortOrder,
      };
      console.log("📝 Creating specification with data:", createData);
      const specification = await tx.specification.create({
        data: createData,
      });

      // Создаем связи с категориями
      if (targetCategoryIds.length > 0) {
        const categorySpecsData = targetCategoryIds.map((categoryId) => ({
          categoryId,
          specificationId: specification.id,
          isRequired: false,
          sortOrder: 0,
        }));

        await tx.categorySpecification.createMany({
          data: categorySpecsData,
        });
      }

      return specification;
    });

    // Сбрасываем все кеши спецификаций
    revalidateTag("specifications");
    revalidateTag("specifications-light");
    revalidateTag("specifications-full");
    revalidateTag("specifications-by-category");
    revalidatePath("/admin/products/specifications");

    const successMessage = `Спецификация успешно создана${
      validatedData.isGlobal
        ? " для всех категорий"
        : targetCategoryIds.length > 0
        ? ` для ${targetCategoryIds.length} категорий`
        : ""
    }`;

    return {
      success: true,
      data: { id: result.id },
      message: successMessage,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Обновляет спецификацию и её связи с категориями
 */
export async function updateSpecification(data: UpdateSpecificationInput) {
  try {
    const validatedData = UpdateSpecificationSchema.parse(data);

    // Проверяем уникальность ключа (исключая текущую спецификацию)
    if (validatedData.key) {
      const existingSpecification = await prisma.specification.findFirst({
        where: {
          key: validatedData.key,
          NOT: { id: validatedData.id },
        },
      });

      if (existingSpecification) {
        return {
          success: false,
          message: "Спецификация с таким ключом уже существует",
        };
      }
    }

    // Определяем целевые категории для обновления
    let targetCategoryIds: string[] = [];

    if (validatedData.isGlobal) {
      const allActiveCategories = await prisma.category.findMany({
        where: { isActive: true },
        select: { id: true },
      });
      targetCategoryIds = allActiveCategories.map((cat) => cat.id);
    } else if (validatedData.categoryIds) {
      targetCategoryIds = validatedData.categoryIds;
    }

    // Обновляем спецификацию и связи в транзакции
    const result = await prisma.$transaction(async (tx) => {
      // Обновляем спецификацию
      const specification = await tx.specification.update({
        where: { id: validatedData.id },
        data: {
          ...(validatedData.name && { name: validatedData.name }),
          ...(validatedData.key && { key: validatedData.key }),
          ...(validatedData.description !== undefined && {
            description: validatedData.description,
          }),
          ...(validatedData.unit !== undefined && { unit: validatedData.unit }),
          ...(validatedData.type && { type: validatedData.type }),
          ...(validatedData.options !== undefined && {
            options: validatedData.options,
          }),
          ...(validatedData.iconImage !== undefined && {
            icon: validatedData.iconImage,
          }),
          ...(validatedData.isActive !== undefined && {
            isActive: validatedData.isActive,
          }),
          ...(validatedData.sortOrder !== undefined && {
            sortOrder: validatedData.sortOrder,
          }),
        },
      });

      // Обновляем связи с категориями если они переданы
      if (
        validatedData.isGlobal !== undefined ||
        validatedData.categoryIds !== undefined
      ) {
        // Удаляем существующие связи
        await tx.categorySpecification.deleteMany({
          where: { specificationId: validatedData.id },
        });

        // Создаем новые связи
        if (targetCategoryIds.length > 0) {
          await tx.categorySpecification.createMany({
            data: targetCategoryIds.map((categoryId) => ({
              categoryId,
              specificationId: validatedData.id,
              isRequired: false,
              sortOrder: 0,
            })),
          });
        }
      }

      return specification;
    });

    // Сбрасываем все кеши спецификаций
    revalidateTag("specifications");
    revalidateTag("specifications-light");
    revalidateTag("specifications-full");
    revalidateTag("specifications-by-category");
    revalidatePath("/admin/products/specifications");

    return {
      success: true,
      data: { id: result.id },
      message: "Спецификация успешно обновлена",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Удаляет спецификацию (только если нет связанных продуктов)
 */
export async function deleteSpecification(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Проверяем есть ли связанные продукты
    const specWithProducts = await prisma.specification.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            productSpecifications: true,
          },
        },
      },
    });

    if (!specWithProducts) {
      return {
        success: false,
        message: "Спецификация не найдена",
      };
    }

    if (specWithProducts._count.productSpecifications > 0) {
      return {
        success: false,
        message: `Нельзя удалить спецификацию. К ней привязано ${specWithProducts._count.productSpecifications} товаров`,
      };
    }

    // Удаляем спецификацию (связи удалятся каскадно)
    await prisma.specification.delete({
      where: { id },
    });

    // Сбрасываем все кеши спецификаций
    revalidateTag("specifications");
    revalidateTag("specifications-light");
    revalidateTag("specifications-full");
    revalidateTag("specifications-by-category");
    revalidatePath("/admin/products/specifications");

    return {
      success: true,
      message: "Спецификация успешно удалена",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

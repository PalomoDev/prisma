// lib/actions/new/feature/manage.actions.ts
// Функции управления особенностями (новая версия)

"use server";

import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  CreateFeatureSchema,
  UpdateFeatureSchema,
  CreateFeatureInput,
  UpdateFeatureInput,
} from "@/lib/validations/new/feature.validation";

/**
 * ============================================================================
 * FEATURE MANAGEMENT ACTIONS - Новая версия
 * ============================================================================
 */

/**
 * Создает новую особенность товара
 */
export async function createFeature(data: CreateFeatureInput) {
  try {
    const validatedData = CreateFeatureSchema.parse(data);

    // Проверяем уникальность ключа
    const existingFeature = await prisma.feature.findUnique({
      where: { key: validatedData.key },
    });

    if (existingFeature) {
      return {
        success: false,
        message: "Особенность с таким ключом уже существует",
      };
    }

    // Создаем новую особенность
    const feature = await prisma.feature.create({
      data: {
        name: validatedData.name,
        key: validatedData.key,
        icon: validatedData.icon,
        iconImage: validatedData.iconImage || null,
        description: validatedData.description || null,
        color: validatedData.color || null,
        isActive: validatedData.isActive,
        sortOrder: validatedData.sortOrder,
      },
    });

    // Сбрасываем все кеши особенностей
    revalidateTag("features");
    revalidateTag("features-light");
    revalidateTag("features-full");
    revalidateTag("features-for-products");
    revalidatePath("/admin/products/features");

    return {
      success: true,
      data: { id: feature.id },
      message: "Особенность успешно создана",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Обновляет особенность товара
 */
export async function updateFeature(data: UpdateFeatureInput) {
  try {
    const validatedData = UpdateFeatureSchema.parse(data);

    // Проверяем уникальность ключа (исключая текущую особенность)
    if (validatedData.key) {
      const existingFeature = await prisma.feature.findFirst({
        where: {
          key: validatedData.key,
          NOT: { id: validatedData.id },
        },
      });

      if (existingFeature) {
        return {
          success: false,
          message: "Особенность с таким ключом уже существует",
        };
      }
    }

    // Обновляем особенность
    const feature = await prisma.feature.update({
      where: { id: validatedData.id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.key && { key: validatedData.key }),
        ...(validatedData.icon && { icon: validatedData.icon }),
        ...(validatedData.iconImage !== undefined && {
          iconImage: validatedData.iconImage,
        }),
        ...(validatedData.description !== undefined && {
          description: validatedData.description,
        }),
        ...(validatedData.color !== undefined && {
          color: validatedData.color,
        }),
        ...(validatedData.isActive !== undefined && {
          isActive: validatedData.isActive,
        }),
        ...(validatedData.sortOrder !== undefined && {
          sortOrder: validatedData.sortOrder,
        }),
      },
    });

    // Сбрасываем все кеши особенностей
    revalidateTag("features");
    revalidateTag("features-light");
    revalidateTag("features-full");
    revalidateTag("features-for-products");
    revalidatePath("/admin/products/features");

    return {
      success: true,
      data: { id: feature.id },
      message: "Особенность успешно обновлена",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Удаляет особенность (только если нет связанных продуктов)
 */
export async function deleteFeature(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Проверяем есть ли связанные продукты
    const featureWithProducts = await prisma.feature.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            productFeatures: true,
          },
        },
      },
    });

    if (!featureWithProducts) {
      return {
        success: false,
        message: "Особенность не найдена",
      };
    }

    if (featureWithProducts._count.productFeatures > 0) {
      return {
        success: false,
        message: `Нельзя удалить особенность. К ней привязано ${featureWithProducts._count.productFeatures} товаров`,
      };
    }

    // Удаляем особенность
    await prisma.feature.delete({
      where: { id },
    });

    // Сбрасываем все кеши особенностей
    revalidateTag("features");
    revalidateTag("features-light");
    revalidateTag("features-full");
    revalidateTag("features-for-products");
    revalidatePath("/admin/products/features");

    return {
      success: true,
      message: "Особенность успешно удалена",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// lib/actions/new/subcategory/manage.actions.ts
// Функции управления субкатегориями (новая версия)

"use server";

import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";
import {
  GetSubcategoriesFullResponse,
  SubcategoryFull,
  CreateSubcategorySchema,
  UpdateSubcategorySchema,
  CreateSubcategoryInput,
  UpdateSubcategoryInput,
} from "@/lib/validations/new/subcategory.validation";

/**
 * ============================================================================
 * SUBCATEGORY MANAGEMENT ACTIONS - Новая версия
 * ============================================================================
 */

/**
 * Создает новую субкатегорию
 */
export async function createSubcategory(data: CreateSubcategoryInput) {
  try {
    const validatedData = CreateSubcategorySchema.parse(data);
    const { categoryIds, ...subcategoryData } = validatedData;

    await prisma.subcategory.create({
      data: {
        ...subcategoryData,
        ...(categoryIds &&
          categoryIds.length > 0 && {
            categorySubcategories: {
              create: categoryIds.map((categoryId: string, index: number) => ({
                categoryId,
                sortOrder: index,
              })),
            },
          }),
      },
    });

    revalidateTag("subcategories"); // Сбрасываем кэш
    revalidateTag("subcategories-light"); // Новые теги
    revalidateTag("subcategories-full"); // Новые теги
    revalidatePath("/admin/subcategories");
    return { success: true, message: "Subcategory created successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/**
 * Удаляет субкатегорию
 */
export async function deleteSubcategory(id: string) {
  try {
    const productsCount = await prisma.productSubcategory.count({
      where: { subcategoryId: id },
    });

    if (productsCount > 0) {
      return {
        success: false,
        message: `Cannot delete subcategory: it has ${productsCount} associated products`,
      };
    }

    // Удаляем субкатегорию (связи удалятся каскадно)
    await prisma.subcategory.delete({
      where: { id },
    });

    revalidateTag("subcategories"); // Сбрасываем кэш
    revalidateTag("subcategories-light"); // Новые теги
    revalidateTag("subcategories-full"); // Новые теги
    revalidatePath("/admin/subcategories");
    return {
      success: true,
      message: "Subcategory deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Получает субкатегорию по ID для админки (Full версия)
 */
export const getSubcategoryById = unstable_cache(
  async (
    id: string
  ): Promise<{
    success: boolean;
    data: SubcategoryFull | null;
    message: string | null;
  }> => {
    try {
      const subcategory = await prisma.subcategory.findUnique({
        where: { id },
        include: {
          categorySubcategories: {
            include: {
              category: true,
              subcategory: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
          productSubcategories: {
            include: {
              subcategory: true,
            },
          },
          _count: {
            select: {
              categorySubcategories: true,
              productSubcategories: true,
            },
          },
        },
      });

      if (!subcategory) {
        return {
          success: false,
          data: null,
          message: "Subcategory not found",
        };
      }

      return {
        success: true,
        data: subcategory,
        message: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: formatError(error),
      };
    }
  },
  ["getSubcategoryById-full"],
  {
    revalidate: 3600,
    tags: ["subcategories", "subcategories-full"],
  }
);

/**
 * Обновляет субкатегорию
 */
export async function updateSubcategory(data: UpdateSubcategoryInput) {
  try {
    const validatedData = UpdateSubcategorySchema.parse(data);
    const { id, categoryIds, ...subcategoryData } = validatedData;

    // Проверяем существование субкатегории
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id },
    });

    if (!existingSubcategory) {
      return {
        success: false,
        message: "Subcategory not found",
      };
    }

    // Если указан slug, проверяем его уникальность (исключая текущую субкатегорию)
    if (subcategoryData.slug) {
      const existingSlug = await prisma.subcategory.findFirst({
        where: {
          slug: subcategoryData.slug,
          NOT: { id },
        },
      });

      if (existingSlug) {
        return {
          success: false,
          message: "Subcategory with this slug already exists",
        };
      }
    }

    // Обновляем субкатегорию в транзакции
    await prisma.$transaction(async (tx) => {
      // Обновляем основные данные субкатегории
      await tx.subcategory.update({
        where: { id },
        data: subcategoryData,
      });

      // Если переданы categoryIds, обновляем связи
      if (categoryIds !== undefined) {
        // Удаляем все существующие связи
        await tx.categorySubcategory.deleteMany({
          where: { subcategoryId: id },
        });

        // Создаем новые связи, если есть категории
        if (categoryIds.length > 0) {
          await tx.categorySubcategory.createMany({
            data: categoryIds.map((categoryId: string, index: number) => ({
              categoryId,
              subcategoryId: id,
              sortOrder: index,
            })),
          });
        }
      }
    });

    revalidateTag("subcategories"); // Сбрасываем кэш
    revalidateTag("subcategories-light"); // Новые теги
    revalidateTag("subcategories-full"); // Новые теги
    revalidatePath("/admin/subcategories");
    return {
      success: true,
      message: "Subcategory updated successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
}

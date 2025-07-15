// lib/actions/new/subcategory/get.actions.ts
// Функции получения данных субкатегорий (новая версия)

import { unstable_cache } from "next/cache";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import {
  GetSubcategoriesLightResponse,
  GetSubcategoriesFullResponse,
} from "@/lib/validations/new/subcategory.validation";

/**
 * Получает субкатегории в Light версии для пользователей
 * Включает: базовые поля + связанные категории + count товаров
 * Используется для: навигации, фильтров, каталога
 */
export const getSubcategoriesLight = unstable_cache(
  async (
    activeOnly: boolean = true
  ): Promise<GetSubcategoriesLightResponse> => {
    try {
      const subcategories = await prisma.subcategory.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          isActivity: true,
          isActive: true,
          sortOrder: true,
        },
      });

      return {
        success: true,
        data: subcategories,
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
  ["subcategories-light"],
  {
    revalidate: 3600, // 1 час
    tags: ["subcategories", "subcategories-light"],
  }
);

/**
 * Получает субкатегории в Full версии для админки
 * Включает: все поля + связи + count товаров + createdAt/updatedAt
 * Используется для: администрирования, управления субкатегориями
 */
export const getSubcategoriesFull = unstable_cache(
  async (
    activeOnly: boolean = false
  ): Promise<GetSubcategoriesFullResponse> => {
    try {
      const subcategories = await prisma.subcategory.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
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

      return {
        success: true,
        data: subcategories,
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
  ["subcategories-full"],
  {
    revalidate: 3600, // 1 час
    tags: ["subcategories", "subcategories-full"],
  }
);

/**
 * Получает одну субкатегорию в Light версии по slug
 */
export const getSubcategoryLightBySlug = unstable_cache(
  async (
    slug: string,
    activeOnly: boolean = true
  ): Promise<GetSubcategoriesLightResponse> => {
    try {
      const subcategory = await prisma.subcategory.findUnique({
        where: {
          slug,
          ...(activeOnly ? { isActive: true } : {}),
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          isActivity: true,
          isActive: true,
          sortOrder: true,
        },
      });

      if (!subcategory) {
        return {
          success: false,
          data: null,
          message: "Субкатегория не найдена",
        };
      }

      return {
        success: true,
        data: [subcategory], // Возвращаем массив для совместимости с типом
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
  ["subcategory-light-by-slug"],
  {
    revalidate: 3600, // 1 час
    tags: ["subcategories", "subcategories-light"],
  }
);

/**
 * Получает субкатегории по массиву ID (Light версия)
 * Используется для фильтров и выборок
 */
export const getSubcategoriesLightByIds = unstable_cache(
  async (
    ids: string[],
    activeOnly: boolean = true
  ): Promise<GetSubcategoriesLightResponse> => {
    try {
      if (ids.length === 0) {
        return {
          success: true,
          data: [],
          message: null,
        };
      }

      const subcategories = await prisma.subcategory.findMany({
        where: {
          id: { in: ids },
          ...(activeOnly ? { isActive: true } : {}),
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          isActivity: true,
          isActive: true,
          sortOrder: true,
        },
      });

      return {
        success: true,
        data: subcategories,
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
  ["subcategories-light-by-ids"],
  {
    revalidate: 3600, // 1 час
    tags: ["subcategories", "subcategories-light"],
  }
);

/**
 * Получает активные субкатегории-активности (isActivity = true && isActive = true)
 * Используется для: меню активностей, фильтров по активностям
 */
export const getActivitySubcategoriesLight = unstable_cache(
  async (): Promise<GetSubcategoriesLightResponse> => {
    try {
      const subcategories = await prisma.subcategory.findMany({
        where: {
          isActivity: true,
          isActive: true,
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          isActivity: true,
          isActive: true,
          sortOrder: true,
        },
      });

      return {
        success: true,
        data: subcategories,
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
  ["activity-subcategories-light"],
  {
    revalidate: 3600, // 1 час
    tags: ["subcategories", "subcategories-light", "activities"],
  }
);

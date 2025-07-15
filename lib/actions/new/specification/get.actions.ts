// lib/actions/new/specification/get.actions.ts
// Функции получения данных спецификаций (новая версия)

import { unstable_cache } from "next/cache";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import {
  GetSpecificationsLightResponse,
  GetSpecificationsFullResponse,
  GetSpecificationResponse,
  SpecificationLight,
  SpecificationFull,
} from "@/lib/validations/new/specification.validation";

/**
 * Получает спецификации в Light версии для пользователей
 * Включает: базовые поля без тяжелых связей
 * Используется для: навигации, фильтров, каталога
 */
export const getSpecificationsLight = unstable_cache(
  async (activeOnly: boolean = true): Promise<GetSpecificationsLightResponse> => {
    try {
      const specifications = await prisma.specification.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          key: true,
          description: true,
          unit: true,
          type: true,
          options: true,
          icon: true,
          isActive: true,
          sortOrder: true,
        },
      });

      return {
        success: true,
        data: specifications,
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
  ["specifications-light"],
  {
    revalidate: 3600, // 1 час кеш
    tags: ["specifications", "specifications-light"],
  }
);

/**
 * Получает спецификации в Full версии для админки
 * Включает: все поля + связи с категориями + счетчики
 * Используется для: админ панель, управление
 */
export const getSpecificationsFull = unstable_cache(
  async (activeOnly: boolean = false): Promise<GetSpecificationsFullResponse> => {
    try {
      const specifications = await prisma.specification.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: {
          categorySpecs: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          _count: {
            select: {
              productSpecifications: true,
            },
          },
        },
      });

      return {
        success: true,
        data: specifications,
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
  ["specifications-full"],
  {
    revalidate: 60, // 1 минута кеш для админки
    tags: ["specifications", "specifications-full"],
  }
);

/**
 * Получает спецификацию по ID с полной информацией
 * Используется для: редактирование, детальный просмотр
 */
export const getSpecificationById = async (
  id: string
): Promise<GetSpecificationResponse> => {
  try {
    const specification = await prisma.specification.findUnique({
      where: { id },
      include: {
        categorySpecs: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            productSpecifications: true,
          },
        },
      },
    });

    if (!specification) {
      return {
        success: false,
        data: null,
        message: "Спецификация не найдена",
      };
    }

    return {
      success: true,
      data: specification,
      message: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: formatError(error),
    };
  }
};

/**
 * Получает спецификации по категории (кешированная версия)
 * Используется для: фильтры товаров по категориям
 */
export const getSpecificationsByCategory = unstable_cache(
  async (categoryId: string): Promise<GetSpecificationsLightResponse> => {
    try {
      const specifications = await prisma.specification.findMany({
        where: {
          isActive: true,
          categorySpecs: {
            some: {
              categoryId: categoryId,
            },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          key: true,
          description: true,
          unit: true,
          type: true,
          options: true,
          icon: true,
          isActive: true,
          sortOrder: true,
        },
      });

      return {
        success: true,
        data: specifications,
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
  ["specifications-by-category"],
  {
    revalidate: 3600, // 1 час кеш
    tags: ["specifications", "specifications-by-category"],
  }
);

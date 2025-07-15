// lib/actions/new/feature/get.actions.ts
// Функции получения данных особенностей (новая версия)

import { unstable_cache } from "next/cache";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import {
  GetFeaturesLightResponse,
  GetFeaturesFullResponse,
  GetFeatureResponse,
  FeatureLight,
  FeatureFull,
} from "@/lib/validations/new/feature.validation";

/**
 * Получает особенности в Light версии для пользователей
 * Включает: базовые поля без тяжелых связей
 * Используется для: навигации, фильтров, каталога
 */
export const getFeaturesLight = unstable_cache(
  async (activeOnly: boolean = true): Promise<GetFeaturesLightResponse> => {
    try {
      const features = await prisma.feature.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          key: true,
          icon: true,
          iconImage: true,
          description: true,
          color: true,
          isActive: true,
          sortOrder: true,
        },
      });

      return {
        success: true,
        data: features,
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
  ["features-light"],
  {
    revalidate: 3600, // 1 час кеш
    tags: ["features", "features-light"],
  }
);

/**
 * Получает особенности в Full версии для админки
 * Включает: все поля + счетчики связанных продуктов
 * Используется для: админ панель, управление
 */
export const getFeaturesFull = unstable_cache(
  async (activeOnly: boolean = false): Promise<GetFeaturesFullResponse> => {
    try {
      const features = await prisma.feature.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: {
          _count: {
            select: {
              productFeatures: true,
            },
          },
        },
      });

      return {
        success: true,
        data: features,
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
  ["features-full"],
  {
    revalidate: 60, // 1 минута кеш для админки
    tags: ["features", "features-full"],
  }
);

/**
 * Получает особенность по ID с полной информацией
 * Используется для: редактирование, детальный просмотр
 */
export const getFeatureById = async (
  id: string
): Promise<GetFeatureResponse> => {
  try {
    const feature = await prisma.feature.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            productFeatures: true,
          },
        },
      },
    });

    if (!feature) {
      return {
        success: false,
        data: null,
        message: "Особенность не найдена",
      };
    }

    return {
      success: true,
      data: feature,
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
 * Получает активные особенности для продуктов (кешированная версия)
 * Используется для: отображение особенностей в карточках товаров
 */
export const getActiveFeaturesForProducts = unstable_cache(
  async (): Promise<GetFeaturesLightResponse> => {
    try {
      const features = await prisma.feature.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          key: true,
          icon: true,
          iconImage: true,
          description: true,
          color: true,
          isActive: true,
          sortOrder: true,
        },
      });

      return {
        success: true,
        data: features,
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
  ["features-for-products"],
  {
    revalidate: 3600, // 1 час кеш
    tags: ["features", "features-for-products"],
  }
);

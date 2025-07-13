import {unstable_cache} from 'next/cache';
import {prisma} from "@/db/prisma";
import {formatError} from '@/lib/utils';
import {
    GetCategoriesLightPrismaResponseSchema,
    GetCategoriesLightResponse,
    GetCategoriesLightResponseSchema
} from '@/lib/validations/new/category.validation';

/**
 * Получает категории в Light версии для пользователей
 * Включает: базовые поля + подкатегории + count товаров
 * Используется для: навигации, фильтров, каталога
 */
export const getCategoriesLight = unstable_cache(
    async (activeOnly: boolean = true): Promise<GetCategoriesLightResponse> => {
        try {
            const categories = await prisma.category.findMany({
                where: activeOnly ? { isActive: true } : undefined,
                orderBy: [
                    { sortOrder: 'asc' },
                    { name: 'asc' }
                ],
                include: {
                    categorySubcategories: {
                        where: activeOnly ? {
                            subcategory: { isActive: true }
                        } : undefined,
                        include: {
                            subcategory: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    description: true,
                                    image: true,
                                    isActive: true,
                                    sortOrder: true
                                }
                            }
                        },
                        orderBy: {
                            sortOrder: 'asc'
                        }
                    },
                    _count: {
                        select: {
                            products: activeOnly ? {
                                where: { isActive: true }
                            } : true
                        }
                    }
                }
            });

            // Валидация данных от Prisma
            const prismaData = GetCategoriesLightPrismaResponseSchema.parse({
                success: true,
                data: categories,
                message: null
            });


            // Трансформация в clean версию (убираем createdAt/updatedAt)
            const cleanData = prismaData.data?.map(category => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                image: category.image,
                isActive: category.isActive,
                sortOrder: category.sortOrder,
                categorySubcategories: category.categorySubcategories,
                _count: category._count
            })) ?? null;

            return {
                success: true,
                data: cleanData,
                message: null
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: formatError(error)
            };
        }
    },
    ['categories-light'],
    {
        revalidate: 3600, // 1 час
        tags: ['categories', 'categories-light']
    }
);

/**
 * Получает одну категорию в Light версии по slug
 */
export const getCategoryLightBySlug = unstable_cache(
    async (slug: string, activeOnly: boolean = true): Promise<GetCategoriesLightResponse> => {
        try {
            const category = await prisma.category.findUnique({
                where: {
                    slug,
                    ...(activeOnly ? { isActive: true } : {})
                },
                include: {
                    categorySubcategories: {
                        where: activeOnly ? {
                            subcategory: { isActive: true }
                        } : undefined,
                        include: {
                            subcategory: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    description: true,
                                    image: true,
                                    isActive: true,
                                    sortOrder: true
                                }
                            }
                        },
                        orderBy: {
                            sortOrder: 'asc'
                        }
                    },
                    _count: {
                        select: {
                            products: activeOnly ? {
                                where: { isActive: true }
                            } : true
                        }
                    }
                }
            });

            if (!category) {
                return {
                    success: false,
                    data: null,
                    message: 'Категория не найдена'
                };
            }

            return {
                success: true,
                data: [category], // Возвращаем массив для совместимости с типом
                message: null
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: formatError(error)
            };
        }
    },
    ['category-light-by-slug'],
    {
        revalidate: 3600, // 1 час
        tags: ['categories', 'categories-light']
    }
);
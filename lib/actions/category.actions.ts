"use server"

import { prisma } from "@/db/prisma"
import { formatError } from "@/lib/utils"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import { z } from "zod"
import { GetCategoriesResponse, GetCategoryByIdResponse } from "@/types"
import { createCategorySchema, updateCategorySchema } from "@/lib/validations/category.validation"
import {CategoryForFiltersResponse} from "@/lib/validations/category.actions.validation";

/**
 * ============================================================================
 * CATEGORY ACTIONS
 * ============================================================================
 */

/**
 * Получает все категории с возможностью фильтрации по активности
 */
export const getCategories = unstable_cache(
    async (activeOnly: boolean = false): Promise<GetCategoriesResponse> => {
        try {
            const categories = await prisma.category.findMany({
                where: activeOnly ? { isActive: true } : undefined,
                orderBy: [
                    { sortOrder: 'asc' },
                    { name: 'asc' }
                ],
                include: {
                    categorySubcategories: {
                        include: {
                            subcategory: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true
                                }
                            }
                        },
                        orderBy: {
                            sortOrder: 'asc'
                        }
                    },
                    _count: {
                        select: {
                            products: true
                        }
                    }
                }
            });

            return {
                success: true,
                data: categories
            };
        } catch (error) {
            return {
                success: false,
                message: formatError(error)
            };
        }
    },
    ['getCategories'],
    {
        revalidate: 3600, // 1 час
        tags: ['categories']
    }
);


export const getCategoriesForFilters = unstable_cache(
    async (activeOnly: boolean = false): Promise<CategoryForFiltersResponse> => {
        try {
            const categories = await prisma.category.findMany({
                where: activeOnly ? { isActive: true } : undefined,
                orderBy: [
                    { sortOrder: 'asc' },
                    { name: 'asc' }
                ],
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    isActive: true,
                    sortOrder: true,
                    _count: {
                        select: {
                            products: true
                        }
                    }
                }
            });

            return {
                success: true,
                data: categories
            };
        } catch (error) {
            return {
                success: false,
                message: formatError(error)
            };
        }
    },
    ['getCategories'],
    {
        revalidate: 3600, // 1 час
        tags: ['categories', 'getCategories']
    }
);

/**
 * Создает новую категорию
 */
export async function createCategory(data: z.infer<typeof createCategorySchema>) {
    try {
        const validatedData = createCategorySchema.parse(data);
        const { subcategoryIds, ...categoryData } = validatedData;

        await prisma.category.create({
            data: {
                ...categoryData,
                ...(subcategoryIds && subcategoryIds.length > 0 && {
                    categorySubcategories: {
                        create: subcategoryIds.map((subcategoryId, index) => ({
                            subcategoryId,
                            sortOrder: index
                        }))
                    }
                })
            }
        });

        revalidateTag('categories'); // Сбрасываем кэш
        revalidatePath('/admin/categories');
        return { success: true, message: 'Category created successfully' };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

/**
 * Удаляет категорию
 */
export async function deleteCategory(id: string) {
    try {
        const productsCount = await prisma.product.count({
            where: { categoryId: id }
        });

        if (productsCount > 0) {
            return {
                success: false,
                message: `Cannot delete category: it has ${productsCount} associated products`
            };
        }

        // Удаляем связи с подкатегориями (каскадное удаление должно сработать автоматически)
        await prisma.category.delete({
            where: { id }
        });

        revalidateTag('categories'); // Сбрасываем кэш
        revalidatePath('/admin/categories');
        return {
            success: true,
            message: 'Category deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Получает категорию по ID
 */
export const getCategoryById = unstable_cache(
    async (id: string): Promise<GetCategoryByIdResponse> => {
        try {
            const category = await prisma.category.findUnique({
                where: { id },
                include: {
                    categorySubcategories: {
                        include: {
                            subcategory: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true
                                }
                            }
                        },
                        orderBy: {
                            sortOrder: 'asc'
                        }
                    },
                    _count: {
                        select: {
                            products: true
                        }
                    }
                }
            });

            if (!category) {
                return {
                    success: false,
                    message: 'Category not found'
                };
            }

            return {
                success: true,
                data: category
            };
        } catch (error) {
            return {
                success: false,
                message: formatError(error)
            };
        }
    },
    ['getCategoryById'],
    {
        revalidate: 3600,
        tags: ['categories']
    }
);

/**
 * Обновляет категорию
 */
export async function updateCategory(data: z.infer<typeof updateCategorySchema>) {
    try {
        const validatedData = updateCategorySchema.parse(data);
        const { id, subcategoryIds, ...categoryData } = validatedData;

        // Проверяем существование категории
        const existingCategory = await prisma.category.findUnique({
            where: { id }
        });

        if (!existingCategory) {
            return {
                success: false,
                message: 'Category not found'
            };
        }

        // Если указан slug, проверяем его уникальность (исключая текущую категорию)
        if (categoryData.slug) {
            const existingSlug = await prisma.category.findFirst({
                where: {
                    slug: categoryData.slug,
                    NOT: { id }
                }
            });

            if (existingSlug) {
                return {
                    success: false,
                    message: 'Category with this slug already exists'
                };
            }
        }

        // Обновляем категорию в транзакции
        await prisma.$transaction(async (tx) => {
            // Обновляем основные данные категории
            await tx.category.update({
                where: { id },
                data: categoryData
            });

            // Если переданы subcategoryIds, обновляем связи
            if (subcategoryIds !== undefined) {
                // Удаляем все существующие связи
                await tx.categorySubcategory.deleteMany({
                    where: { categoryId: id }
                });

                // Создаем новые связи, если есть подкатегории
                if (subcategoryIds.length > 0) {
                    await tx.categorySubcategory.createMany({
                        data: subcategoryIds.map((subcategoryId, index) => ({
                            categoryId: id,
                            subcategoryId,
                            sortOrder: index
                        }))
                    });
                }
            }
        });

        revalidateTag('categories'); // Сбрасываем кэш
        revalidatePath('/admin/categories');
        return {
            success: true,
            message: 'Category updated successfully'
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: error.errors.map(e => e.message).join(', ')
            };
        }

        return {
            success: false,
            message: formatError(error)
        };
    }
}
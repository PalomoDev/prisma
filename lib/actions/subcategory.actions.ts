"use server"

import { prisma } from "@/db/prisma"
import { formatError } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { GetSubcategoriesResponse, GetSubcategoryByIdResponse } from "@/types"
import { createSubcategorySchema, updateSubcategorySchema } from "@/lib/validations/category.validation"

/**
 * ============================================================================
 * SUBCATEGORY ACTIONS
 * ============================================================================
 */

/**
 * Получает все подкатегории с возможностью фильтрации по активности
 */
export async function getSubcategories(activeOnly: boolean = false): Promise<GetSubcategoriesResponse> {
    try {
        const subcategories = await prisma.subcategory.findMany({
            where: activeOnly ? { isActive: true } : undefined,
            orderBy: [
                { sortOrder: 'asc' },
                { name: 'asc' }
            ],
            include: {
                categorySubcategories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            }
                        },
                        sortOrder: true,
                    },
                    orderBy: {
                        sortOrder: 'asc'
                    }
                },
                _count: {
                    select: {
                        productSubcategories: true,
                    }
                }
            }
        });

        return {
            success: true,
            data: subcategories
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Получает подкатегорию по ID
 */
export async function getSubcategoryById(id: string): Promise<GetSubcategoryByIdResponse> {
    try {
        const subcategory = await prisma.subcategory.findUnique({
            where: { id },
            include: {
                categorySubcategories: {
                    include: {
                        category: {
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
                        productSubcategories: true
                    }
                }
            }
        });

        if (!subcategory) {
            return {
                success: false,
                message: 'Subcategory not found'
            };
        }

        return {
            success: true,
            data: subcategory
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Обновляет подкатегорию
 */
export async function updateSubcategory(data: z.infer<typeof updateSubcategorySchema>) {
    try {
        const validatedData = updateSubcategorySchema.parse(data);
        const { id, categoryIds, ...subcategoryData } = validatedData;

        // Проверяем существование подкатегории
        const existingSubcategory = await prisma.subcategory.findUnique({
            where: { id }
        });

        if (!existingSubcategory) {
            return {
                success: false,
                message: 'Subcategory not found'
            };
        }

        // Если указан slug, проверяем его уникальность (исключая текущую подкатегорию)
        if (subcategoryData.slug) {
            const existingSlug = await prisma.subcategory.findFirst({
                where: {
                    slug: subcategoryData.slug,
                    NOT: { id }
                }
            });

            if (existingSlug) {
                return {
                    success: false,
                    message: 'Subcategory with this slug already exists'
                };
            }
        }

        // Обновляем подкатегорию в транзакции
        await prisma.$transaction(async (tx) => {
            // Обновляем основные данные подкатегории
            await tx.subcategory.update({
                where: { id },
                data: subcategoryData
            });

            // Если переданы categoryIds, обновляем связи
            if (categoryIds !== undefined) {
                // Удаляем все существующие связи
                await tx.categorySubcategory.deleteMany({
                    where: { subcategoryId: id }
                });

                // Создаем новые связи, если есть категории
                if (categoryIds.length > 0) {
                    await tx.categorySubcategory.createMany({
                        data: categoryIds.map((categoryId, index) => ({
                            categoryId,
                            subcategoryId: id,
                            sortOrder: index
                        }))
                    });
                }
            }
        });

        revalidatePath('/admin/subcategories');
        return {
            success: true,
            message: 'Subcategory updated successfully'
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

/**
 * Создает новую подкатегорию
 */
export async function createSubcategory(data: z.infer<typeof createSubcategorySchema>) {
    try {
        const validatedData = createSubcategorySchema.parse(data);
        const { categoryIds, ...subcategoryData } = validatedData;

        await prisma.subcategory.create({
            data: {
                ...subcategoryData,
                ...(categoryIds && categoryIds.length > 0 && {
                    categorySubcategories: {
                        create: categoryIds.map((categoryId, index) => ({
                            categoryId,
                            sortOrder: index
                        }))
                    }
                })
            }
        });

        revalidatePath('/admin/subcategories');
        return { success: true, message: 'Subcategory created successfully' };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

/**
 * Удаляет подкатегорию
 */
export async function deleteSubcategory(id: string) {
    try {
        const productsCount = await prisma.productSubcategory.count({
            where: { subcategoryId: id }
        });

        if (productsCount > 0) {
            return {
                success: false,
                message: `Cannot delete subcategory: it has ${productsCount} associated products`
            };
        }

        // Удаляем подкатегорию (связи удалятся каскадно)
        await prisma.subcategory.delete({
            where: { id }
        });

        revalidatePath('/admin/subcategories');
        return {
            success: true,
            message: 'Subcategory deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

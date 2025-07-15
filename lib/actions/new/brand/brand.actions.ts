"use server"

import { prisma } from "@/db/prisma"
import { formatError } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { CreateBrandInput, GetBrandByIdResponse, GetBrandsResponse } from "@/types"
import { createBrandSchema, updateBrandSchema } from "@/lib/validations/category.validation"

/**
 * ============================================================================
 * BRAND ACTIONS
 * ============================================================================
 */

/**
 * Получает все бренды с возможностью фильтрации по активности
 */
export async function getBrands(activeOnly: boolean = false): Promise<GetBrandsResponse> {
    try {
        const brands = await prisma.brand.findMany({
            where: activeOnly ? { isActive: true } : undefined,
            orderBy: [
                { sortOrder: 'asc' },
                { name: 'asc' }
            ],
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });

        return {
            success: true,
            data: brands
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Получает бренд по ID
 */
export async function getBrandById(id: string): Promise<GetBrandByIdResponse> {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });

        if (!brand) {
            return {
                success: false,
                message: 'Brand not found'
            };
        }

        return {
            success: true,
            data: brand
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Создает новый бренд
 */
export async function createBrand(data: CreateBrandInput) {
    try {
        const validatedData = createBrandSchema.parse(data);

        // Проверяем уникальность slug
        const existingBrand = await prisma.brand.findUnique({
            where: { slug: validatedData.slug }
        });

        if (existingBrand) {
            return {
                success: false,
                message: 'Brand with this slug already exists'
            };
        }

        const brand = await prisma.brand.create({
            data: validatedData
        });

        revalidatePath('/admin/brands');
        return {
            success: true,
            data: { id: brand.id },
            message: 'Brand created successfully'
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
 * Обновляет бренд
 */
export async function updateBrand(data: z.infer<typeof updateBrandSchema>) {
    try {
        const validatedData = updateBrandSchema.parse(data);
        const { id, ...brandData } = validatedData;

        // Проверяем существование бренда
        const existingBrand = await prisma.brand.findUnique({
            where: { id }
        });

        if (!existingBrand) {
            return {
                success: false,
                message: 'Brand not found'
            };
        }

        // Если указан slug, проверяем его уникальность (исключая текущий бренд)
        if (brandData.slug) {
            const existingSlug = await prisma.brand.findFirst({
                where: {
                    slug: brandData.slug,
                    NOT: { id }
                }
            });

            if (existingSlug) {
                return {
                    success: false,
                    message: 'Brand with this slug already exists'
                };
            }
        }

        // Обновляем бренд
        await prisma.brand.update({
            where: { id },
            data: brandData
        });

        revalidatePath('/admin/brands');
        return {
            success: true,
            message: 'Brand updated successfully'
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
 * Удаляет бренд
 */
export async function deleteBrand(id: string) {
    try {
        const brandWithProducts = await prisma.brand.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });

        if (!brandWithProducts) {
            return {
                success: false,
                message: 'Brand not found'
            };
        }

        if (brandWithProducts._count.products > 0) {
            return {
                success: false,
                message: `Cannot delete brand: it has ${brandWithProducts._count.products} associated products`
            };
        }

        await prisma.brand.delete({
            where: { id }
        });

        revalidatePath('/admin/brands');
        return {
            success: true,
            message: 'Brand deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}

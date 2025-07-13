//lib/actions/spec-features.actions.ts
'use server'

import { prisma } from "@/db/prisma"
import { formatError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import {
    CreateSpecificationWithCategoriesInput,
    createSpecificationWithCategoriesSchema,
    UpdateSpecificationWithCategoriesInput,
    updateSpecificationWithCategoriesSchema
} from "@/lib/validations/specs-features.validation";
import { CreateFeatureInput, UpdateFeatureInput } from "@/types";
import { createFeatureSchema, updateFeatureSchema } from "@/lib/validations/category.validation";

// ========================================
// SPECIFICATION ACTIONS - Действия для спецификаций
// ========================================

/**
 * Создает новую спецификацию с привязкой к категориям
 * @param data - Данные спецификации с категориями
 * @returns Результат создания спецификации
 */
export const createSpecification = async (data: CreateSpecificationWithCategoriesInput) => {

    try {
        // Валидируем данные
        const validatedData = createSpecificationWithCategoriesSchema.parse(data);

        // Проверяем уникальность ключа
        const existingSpecification = await prisma.specification.findUnique({
            where: { key: validatedData.key }
        });

        if (existingSpecification) {
            return {
                success: false,
                message: 'Спецификация с таким ключом уже существует'
            };
        }

        // Определяем целевые категории
        let targetCategoryIds: string[] = [];

        if (validatedData.isGlobal) {
            const allActiveCategories = await prisma.category.findMany({
                where: { isActive: true },
                select: { id: true }
            });
            targetCategoryIds = allActiveCategories.map(cat => cat.id);
        } else {
            targetCategoryIds = validatedData.categoryIds;
        }

        // Создаем спецификацию и связи в транзакции
        const result = await prisma.$transaction(async (tx) => {
            // Создаем спецификацию
            const specification = await tx.specification.create({
                data: {
                    name: validatedData.name,
                    key: validatedData.key,
                    description: validatedData.description || null,
                    unit: validatedData.unit || null,
                    type: validatedData.type,
                    options: [], // Пустой массив
                    icon: validatedData.icon || null,
                    isActive: validatedData.isActive,
                    sortOrder: validatedData.sortOrder,
                }
            });

            // Создаем связи с категориями
            if (targetCategoryIds.length > 0) {
                const categorySpecsData = targetCategoryIds.map(categoryId => ({
                    categoryId,
                    specificationId: specification.id,
                    isRequired: false,
                    sortOrder: 0,
                }));

                await tx.categorySpecification.createMany({
                    data: categorySpecsData
                });
            } else {
            }

            return specification;
        });

        revalidatePath('/admin/products/specifications');

        const successMessage = `Спецификация успешно создана${validatedData.isGlobal ? ' для всех категорий' : targetCategoryIds.length > 0 ? ` для ${targetCategoryIds.length} категорий` : ''}`;

        return {
            success: true,
            data: { id: result.id },
            message: successMessage
        };

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
};

/**
 * Получает спецификацию по ID с полной информацией о связях
 * @param id - ID спецификации
 * @returns Спецификация с категориями
 */
export const getSpecificationById = async (id: string) => {
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
                                slug: true
                            }
                        }
                    }
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
                message: 'Спецификация не найдена'
            };
        }

        return {
            success: true,
            data: specification
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
};

/**
 * Обновляет спецификацию и её связи с категориями
 * @param data - Данные для обновления
 * @returns Результат обновления
 */
export const updateSpecification = async (data: UpdateSpecificationWithCategoriesInput) => {
    try {
        const validatedData = updateSpecificationWithCategoriesSchema.parse(data);

        // Проверяем уникальность ключа (исключая текущую спецификацию)
        if (validatedData.key) {
            const existingSpecification = await prisma.specification.findFirst({
                where: {
                    key: validatedData.key,
                    NOT: { id: validatedData.id }
                }
            });

            if (existingSpecification) {
                return {
                    success: false,
                    message: 'Спецификация с таким ключом уже существует'
                };
            }
        }

        // Определяем целевые категории для обновления
        let targetCategoryIds: string[] = [];

        if (validatedData.isGlobal) {
            const allActiveCategories = await prisma.category.findMany({
                where: { isActive: true },
                select: { id: true }
            });
            targetCategoryIds = allActiveCategories.map(cat => cat.id);
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
                    ...(validatedData.description !== undefined && { description: validatedData.description }),
                    ...(validatedData.unit !== undefined && { unit: validatedData.unit }),
                    ...(validatedData.type && { type: validatedData.type }),
                    ...(validatedData.icon !== undefined && { icon: validatedData.icon }),
                    ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
                    ...(validatedData.sortOrder !== undefined && { sortOrder: validatedData.sortOrder }),
                }
            });

            // Обновляем связи с категориями если они переданы
            if (validatedData.isGlobal !== undefined || validatedData.categoryIds !== undefined) {
                // Удаляем существующие связи
                await tx.categorySpecification.deleteMany({
                    where: { specificationId: validatedData.id }
                });

                // Создаем новые связи
                if (targetCategoryIds.length > 0) {
                    await tx.categorySpecification.createMany({
                        data: targetCategoryIds.map(categoryId => ({
                            categoryId,
                            specificationId: validatedData.id,
                            isRequired: false,
                            sortOrder: 0,
                        }))
                    });
                }
            }

            return specification;
        });

        revalidatePath('/admin/products/specifications');

        return {
            success: true,
            data: { id: result.id },
            message: 'Спецификация успешно обновлена'
        };

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
};

/**
 * Получает все спецификации с возможностью фильтрации по активности
 * @param activeOnly - Получить только активные спецификации
 * @returns Список спецификаций с категориями
 */
export const getAllSpecifications = async (activeOnly: boolean = false) => {
    try {
        const where = activeOnly ? { isActive: true } : {};

        const specifications = await prisma.specification.findMany({
            where,
            orderBy: {
                sortOrder: 'asc'
            },
            include: {
                categorySpecs: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        }
                    }
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
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        };
    }
};

/**
 * Удаляет спецификацию (только если нет связанных продуктов)
 * @param id - ID спецификации
 * @returns Результат удаления
 */
export const deleteSpecification = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
        // Проверяем есть ли связанные продукты
        const specWithProducts = await prisma.specification.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        productSpecifications: true
                    }
                }
            }
        });

        if (!specWithProducts) {
            return {
                success: false,
                message: 'Спецификация не найдена'
            };
        }

        if (specWithProducts._count.productSpecifications > 0) {
            return {
                success: false,
                message: `Нельзя удалить спецификацию. К ней привязано ${specWithProducts._count.productSpecifications} товаров`
            };
        }

        // Удаляем спецификацию (связи удалятся каскадно)
        await prisma.specification.delete({
            where: { id }
        });

        revalidatePath('/admin/products/specifications');

        return {
            success: true,
            message: 'Спецификация успешно удалена'
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
};

// ========================================
// FEATURE ACTIONS - Действия для особенностей
// ========================================

/**
 * Создает новую особенность товара
 * @param data - Данные особенности
 * @returns Результат создания особенности
 */
export const createFeature = async (data: CreateFeatureInput) => {
    try {
        const validatedData = createFeatureSchema.parse(data);

        // Проверяем уникальность ключа
        const existingFeature = await prisma.feature.findUnique({
            where: { key: validatedData.key }
        });

        if (existingFeature) {
            return {
                success: false,
                message: 'Особенность с таким ключом уже существует'
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
                isActive: validatedData.isActive,
                sortOrder: validatedData.sortOrder,
            }
        });

        revalidatePath('/admin/products/features');

        return {
            success: true,
            data: { id: feature.id },
            message: 'Особенность успешно создана'
        };

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
};

/**
 * Получает особенность по ID
 * @param id - ID особенности
 * @returns Особенность с подсчетом связанных продуктов
 */
export const getFeatureById = async (id: string) => {
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
                message: 'Особенность не найдена'
            };
        }

        return {
            success: true,
            data: feature
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
};

/**
 * Обновляет особенность товара
 * @param data - Данные для обновления
 * @returns Результат обновления
 */
export const updateFeature = async (data: UpdateFeatureInput) => {
    try {
        const validatedData = updateFeatureSchema.parse(data);

        // Проверяем уникальность ключа (исключая текущую особенность)
        if (validatedData.key) {
            const existingFeature = await prisma.feature.findFirst({
                where: {
                    key: validatedData.key,
                    NOT: { id: validatedData.id }
                }
            });

            if (existingFeature) {
                return {
                    success: false,
                    message: 'Особенность с таким ключом уже существует'
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
                ...(validatedData.iconImage !== undefined && { iconImage: validatedData.iconImage }),
                ...(validatedData.description !== undefined && { description: validatedData.description }),
                ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
                ...(validatedData.sortOrder !== undefined && { sortOrder: validatedData.sortOrder }),
            }
        });

        revalidatePath('/admin/products/features');

        return {
            success: true,
            data: { id: feature.id },
            message: 'Особенность успешно обновлена'
        };

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
};

/**
 * Получает все особенности с возможностью фильтрации по активности
 * @param activeOnly - Получить только активные особенности
 * @returns Список особенностей
 */
export const getAllFeatures = async (activeOnly: boolean = false) => {
    try {
        const where = activeOnly ? { isActive: true } : {};

        const features = await prisma.feature.findMany({
            where,
            orderBy: {
                sortOrder: 'asc'
            },
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
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        };
    }
};

/**
 * Удаляет особенность (только если нет связанных продуктов)
 * @param id - ID особенности
 * @returns Результат удаления
 */
export const deleteFeature = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
        // Проверяем есть ли связанные продукты
        const featureWithProducts = await prisma.feature.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        productFeatures: true
                    }
                }
            }
        });

        if (!featureWithProducts) {
            return {
                success: false,
                message: 'Особенность не найдена'
            };
        }

        if (featureWithProducts._count.productFeatures > 0) {
            return {
                success: false,
                message: `Нельзя удалить особенность. К ней привязано ${featureWithProducts._count.productFeatures} товаров`
            };
        }

        // Удаляем особенность
        await prisma.feature.delete({
            where: { id }
        });

        revalidatePath('/admin/products/features');

        return {
            success: true,
            message: 'Особенность успешно удалена'
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
};
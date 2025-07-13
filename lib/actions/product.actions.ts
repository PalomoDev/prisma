"use server"

import {prisma} from "@/db/prisma"
import {PAGE_SIZE} from "@/lib/constants";
import {formatError} from "@/lib/utils";
import {revalidatePath} from "next/cache";
import {z} from "zod";
// Types
import {
    GetAllProductsResponse, ProductsGalleryResponse,
} from "@/types";
import {insertProductSchema} from "@/lib/validations/product.validation";
import { Decimal } from '@prisma/client/runtime/library';


/**
 * ============================================================================
 * PRODUCT ACTIONS
 * ============================================================================
 */


/**
 * Создает новый продукт
 */
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
    try {
        const validatedData = insertProductSchema.parse(data);
        const { subcategoryIds, featureIds, specifications, ...productData } = validatedData;

        // Проверяем уникальность slug
        const existingSlug = await prisma.product.findUnique({
            where: { slug: validatedData.slug }
        });

        if (existingSlug) {
            return {
                success: false,
                message: 'Product with this slug already exists'
            };
        }

        // Проверяем уникальность sku
        const existingSku = await prisma.product.findUnique({
            where: { sku: validatedData.sku }
        });

        if (existingSku) {
            return {
                success: false,
                message: 'Product with this SKU already exists'
            };
        }

        // Проверяем существование категории
        const category = await prisma.category.findUnique({
            where: { id: validatedData.categoryId }
        });

        if (!category) {
            return {
                success: false,
                message: 'Category not found'
            };
        }

        // Проверяем существование бренда
        const brand = await prisma.brand.findUnique({
            where: { id: validatedData.brandId }
        });

        if (!brand) {
            return {
                success: false,
                message: 'Brand not found'
            };
        }

        // Проверяем существование подкатегорий (если переданы)
        if (subcategoryIds && subcategoryIds.length > 0) {
            const subcategoriesCount = await prisma.subcategory.count({
                where: {
                    id: {
                        in: subcategoryIds
                    }
                }
            });

            if (subcategoriesCount !== subcategoryIds.length) {
                return {
                    success: false,
                    message: 'One or more subcategories not found'
                };
            }
        }

        // Проверяем существование особенностей (если переданы)
        if (featureIds && featureIds.length > 0) {
            const featuresCount = await prisma.feature.count({
                where: {
                    id: {
                        in: featureIds
                    }
                }
            });

            if (featuresCount !== featureIds.length) {
                return {
                    success: false,
                    message: 'One or more features not found'
                };
            }
        }

        // Проверяем существование спецификаций (если переданы)
        let specificationMap: Record<string, string> = {};
        if (specifications && specifications.length > 0) {
            const specificationKeys = specifications.map(spec => spec.key);
            const existingSpecs = await prisma.specification.findMany({
                where: {
                    key: {
                        in: specificationKeys
                    }
                },
                select: {
                    id: true,
                    key: true
                }
            });

            if (existingSpecs.length !== specificationKeys.length) {
                const foundKeys = existingSpecs.map(spec => spec.key);
                const missingKeys = specificationKeys.filter(key => !foundKeys.includes(key));
                return {
                    success: false,
                    message: `Specifications not found: ${missingKeys.join(', ')}`
                };
            }

            // Создаем карту key -> id для спецификаций
            specificationMap = existingSpecs.reduce((acc, spec) => {
                acc[spec.key] = spec.id;
                return acc;
            }, {} as Record<string, string>);
        }

        // Создаем продукт в транзакции
        const result = await prisma.$transaction(async (tx) => {
            // Создаем основную запись продукта
            const newProduct = await tx.product.create({
                data: productData
            });

            // Создаем связи с подкатегориями
            if (subcategoryIds && subcategoryIds.length > 0) {
                await tx.productSubcategory.createMany({
                    data: subcategoryIds.map(subcategoryId => ({
                        productId: newProduct.id,
                        subcategoryId
                    }))
                });
            }

            // Создаем связи с особенностями
            if (featureIds && featureIds.length > 0) {
                await tx.productFeature.createMany({
                    data: featureIds.map(featureId => ({
                        productId: newProduct.id,
                        featureId
                    }))
                });
            }

            // Создаем значения спецификаций
            if (specifications && specifications.length > 0) {
                await tx.productSpecificationValue.createMany({
                    data: specifications.map(spec => ({
                        productId: newProduct.id,
                        specificationId: specificationMap[spec.key],
                        value: spec.value
                    }))
                });
            }

            return newProduct;
        });

        revalidatePath('/admin/products');
        return {
            success: true,
            data: { id: result.id },
            message: 'Product created successfully'
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
 * Получает все продукты из базы данных
 */
export async function getProducts() {
    try {
        const products = await prisma.product.findMany();
        return { success: true, data: products };
    } catch (error) {
        console.error('Ошибка при получении продуктов:', error);
        return { success: false, error: 'Не удалось загрузить продукты' };
    }
}

/**
 * Получает продукты с пагинацией и всеми связанными данными
 */
export async function getAllProducts({
                                         page = 1,
                                         limit = PAGE_SIZE,
                                     }: {
    page?: number;
    limit?: number;
}): Promise<GetAllProductsResponse> {
    try {
        console.log('🚀 getAllProducts: Начинаем загрузку продуктов...', { page, limit });

        const rawData = await prisma.product.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                // Категория - соответствует productCategoryResponseSchema
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        isActive: true,
                        sortOrder: true,
                    },
                },
                // Бренд - соответствует productBrandResponseSchema
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        logo: true,
                        website: true,
                        isActive: true,
                        sortOrder: true,
                    },
                },
                // Подкатегории - соответствует productSubcategoryResponseSchema
                productSubcategories: {
                    include: {
                        subcategory: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                description: true,
                                isActive: true,
                                sortOrder: true,
                            }
                        }
                    }
                },
                // Особенности - соответствует productFeatureResponseSchema
                features: {
                    include: {
                        feature: {
                            select: {
                                id: true,
                                name: true,
                                key: true,
                                icon: true,
                                iconImage: true,
                                description: true,
                                category: true,
                                color: true,
                                isActive: true,
                                sortOrder: true,
                            }
                        }
                    }
                },
                // Спецификации - соответствует productSpecificationResponseSchema
                // НО! В схеме specifications, а в БД specificationValues
                specificationValues: {
                    include: {
                        specification: {
                            select: {
                                id: true,
                                name: true,
                                key: true,
                                description: true,
                                unit: true,
                                type: true,
                                icon: true,
                                category: true,
                                isActive: true,
                                sortOrder: true,
                            }
                        }
                    },
                    orderBy: {
                        specification: {
                            sortOrder: 'asc'
                        }
                    }
                },
            },
        });

        const totalCount = await prisma.product.count();

        console.log('📊 getAllProducts: Данные загружены из БД', {
            productsCount: rawData.length,
            totalCount,
            sampleProduct: rawData[0] ? {
                id: rawData[0].id,
                name: rawData[0].name,
                categoryName: rawData[0].category.name,
                brandName: rawData[0].brand.name,
                subcategoriesCount: rawData[0].productSubcategories.length,
                featuresCount: rawData[0].features.length,
                specificationsCount: rawData[0].specificationValues.length,
            } : null
        });

        // Преобразуем данные под схему productResponseSchema
        // Данные уже готовы для передачи на клиент
        const data = rawData.map(product => ({
            ...product,
            // Преобразуем specificationValues в specifications для соответствия схеме
            specifications: product.specificationValues.map(sv => ({
                id: sv.specification.id,
                name: sv.specification.name,
                key: sv.specification.key,
                value: sv.value,
                unit: sv.specification.unit,
                type: sv.specification.type,
                sortOrder: sv.specification.sortOrder,
            })),
            // Преобразуем features в productFeatures для соответствия схеме
            productFeatures: product.features,
            // Убираем исходные поля
            specificationValues: undefined,
            features: undefined,
        }));

        console.log('✅ getAllProducts: Данные преобразованы и сериализованы', {
            serializedCount: data.length,
            sampleTransformed: data[0] ? {
                id: data[0].id,
                name: data[0].name,
                category: data[0].category,
                brand: data[0].brand,
                specificationsCount: data[0].specifications?.length || 0,
            } : null
        });



        return {
            success: true,
            data: data as any, // Обходим проверку типов, так как сериализация будет на клиенте
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            totalCount,
        };

    } catch (error) {
        console.error('❌ Error in getAllProducts:', error);



        return {
            success: false,
            data: [],
            totalPages: 0,
            currentPage: page,
            totalCount: 0,
            message: formatError(error)
        };
    }
}

/**
 * Получает все продукты с базовой информацией
 */
export async function getGalleryProducts(): Promise<ProductsGalleryResponse> {
    try {
        const rawData = await prisma.product.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                categoryId: true,
                brandId: true,
                name: true,
                slug: true,
                images: true,
                price: true,
                description: true,
            },
        });

        // Преобразуем price (и, если нужно, rating) из Decimal в number
        const data = rawData.map(product => ({
            ...product,
            price: (product.price as Decimal).toNumber(),

        }));

        return {
            success: true,
            data,

        };
    } catch (error) {
        return {
            success: false,
            data: [],

        };
    }
}

/**
 * Получает рекомендуемые продукты (isFeatured = true) с базовой информацией
 */
export async function getFeaturedProducts(limit: number = 4) {
    try {
        const rawData = await prisma.product.findMany({
            where: {
                isFeatured: true,
                isActive: true, // Только активные продукты
            },
            take: limit,
            orderBy: {
                createdAt: 'desc', // Сначала новые
            },
            select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                price: true,
                rating: true,
                description: true,
                isFeatured: true,
            },
        });



        return {
            success: true,
            data: rawData,
            error: undefined,
        }

    } catch (error) {
        return {
            success: false,
            data: [],
            error: formatError(error)
        };
    }
}

/**
 * Получает продукт по ID со всеми связанными данными для редактирования
 */
export async function getProductById(id: string) {
    try {
        console.log('🔍 getProductById: Загружаем продукт...', { id });

        const rawData = await prisma.product.findUnique({
            where: { id },
            include: {
                // Категория
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        isActive: true,
                        sortOrder: true,
                    },
                },
                // Бренд
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        logo: true,
                        website: true,
                        isActive: true,
                        sortOrder: true,
                    },
                },
                // Подкатегории
                productSubcategories: {
                    include: {
                        subcategory: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                description: true,
                                isActive: true,
                                sortOrder: true,
                            }
                        }
                    }
                },
                // Особенности
                features: {
                    include: {
                        feature: {
                            select: {
                                id: true,
                                name: true,
                                key: true,
                                icon: true,
                                iconImage: true,
                                description: true,
                                category: true,
                                color: true,
                                isActive: true,
                                sortOrder: true,
                            }
                        }
                    }
                },
                // Спецификации со значениями
                specificationValues: {
                    include: {
                        specification: {
                            select: {
                                id: true,
                                name: true,
                                key: true,
                                description: true,
                                unit: true,
                                type: true,
                                icon: true,
                                category: true,
                                isActive: true,
                                sortOrder: true,
                            }
                        }
                    },
                    orderBy: {
                        specification: {
                            sortOrder: 'asc'
                        }
                    }
                },
            },
        });

        if (!rawData) {
            console.log('❌ getProductById: Продукт не найден', { id });
            return {
                success: false,
                message: 'Product not found'
            };
        }

        console.log('📊 getProductById: Продукт загружен', {
            id: rawData.id,
            name: rawData.name,
            sku: rawData.sku,
            categoryName: rawData.category.name,
            brandName: rawData.brand.name,
            subcategoriesCount: rawData.productSubcategories.length,
            featuresCount: rawData.features.length,
            specificationsCount: rawData.specificationValues.length,
            imagesCount: rawData.images.length,
        });

        // Преобразуем данные под схему для формы редактирования
        const transformedData = {
            ...rawData,
            // Преобразуем в формат для формы
            subcategoryIds: rawData.productSubcategories.map(ps => ps.subcategory.id),
            featureIds: rawData.features.map(pf => pf.feature.id),
            specifications: rawData.specificationValues.map(sv => ({
                name: sv.specification.name,
                key: sv.specification.key,
                value: sv.value,
                unit: sv.specification.unit,
                type: sv.specification.type as 'number' | 'text' | 'select' | 'boolean',
                sortOrder: sv.specification.sortOrder,
            })),
            // Убираем исходные поля связей
            productSubcategories: undefined,
            features: undefined,
            specificationValues: undefined,
        };

        console.log('✅ getProductById: Данные преобразованы для формы', {
            subcategoryIds: transformedData.subcategoryIds,
            featureIds: transformedData.featureIds,
            specificationsCount: transformedData.specifications.length,
        });

        return {
            success: true,
            data: transformedData as any, // Обходим проверку типов
        };

    } catch (error) {
        console.error('❌ Error in getProductById:', error);
        return {
            success: false,
            message: formatError(error)
        };
    }
}

/**
 * Обновляет продукт
 */
export async function updateProduct(id: string, data: z.infer<typeof insertProductSchema>) {
    try {
        const validatedData = insertProductSchema.parse(data);
        const { subcategoryIds, featureIds, specifications, ...productData } = validatedData;

        console.log('🔄 updateProduct: Начинаем обновление продукта...', {
            productId: id,
            productName: validatedData.name,
            productSku: validatedData.sku
        });

        // Проверяем существование продукта
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct) {
            return {
                success: false,
                message: 'Product not found'
            };
        }

        // Проверяем уникальность slug (исключая текущий продукт)
        if (validatedData.slug !== existingProduct.slug) {
            const existingSlug = await prisma.product.findFirst({
                where: {
                    slug: validatedData.slug,
                    NOT: { id }
                }
            });

            if (existingSlug) {
                return {
                    success: false,
                    message: 'Product with this slug already exists'
                };
            }
        }

        // Проверяем уникальность sku (исключая текущий продукт)
        if (validatedData.sku !== existingProduct.sku) {
            const existingSku = await prisma.product.findFirst({
                where: {
                    sku: validatedData.sku,
                    NOT: { id }
                }
            });

            if (existingSku) {
                return {
                    success: false,
                    message: 'Product with this SKU already exists'
                };
            }
        }

        // Проверяем существование категории
        const category = await prisma.category.findUnique({
            where: { id: validatedData.categoryId }
        });

        if (!category) {
            return {
                success: false,
                message: 'Category not found'
            };
        }

        // Проверяем существование бренда
        const brand = await prisma.brand.findUnique({
            where: { id: validatedData.brandId }
        });

        if (!brand) {
            return {
                success: false,
                message: 'Brand not found'
            };
        }

        // Проверяем существование подкатегорий (если переданы)
        if (subcategoryIds && subcategoryIds.length > 0) {
            const subcategoriesCount = await prisma.subcategory.count({
                where: {
                    id: {
                        in: subcategoryIds
                    }
                }
            });

            if (subcategoriesCount !== subcategoryIds.length) {
                return {
                    success: false,
                    message: 'One or more subcategories not found'
                };
            }
        }

        // Проверяем существование особенностей (если переданы)
        if (featureIds && featureIds.length > 0) {
            const featuresCount = await prisma.feature.count({
                where: {
                    id: {
                        in: featureIds
                    }
                }
            });

            if (featuresCount !== featureIds.length) {
                return {
                    success: false,
                    message: 'One or more features not found'
                };
            }
        }

        // Проверяем существование спецификаций (если переданы)
        let specificationMap: Record<string, string> = {};
        if (specifications && specifications.length > 0) {
            const specificationKeys = specifications.map(spec => spec.key);
            const existingSpecs = await prisma.specification.findMany({
                where: {
                    key: {
                        in: specificationKeys
                    }
                },
                select: {
                    id: true,
                    key: true
                }
            });

            if (existingSpecs.length !== specificationKeys.length) {
                const foundKeys = existingSpecs.map(spec => spec.key);
                const missingKeys = specificationKeys.filter(key => !foundKeys.includes(key));
                return {
                    success: false,
                    message: `Specifications not found: ${missingKeys.join(', ')}`
                };
            }

            // Создаем карту key -> id для спецификаций
            specificationMap = existingSpecs.reduce((acc, spec) => {
                acc[spec.key] = spec.id;
                return acc;
            }, {} as Record<string, string>);
        }

        console.log('💾 updateProduct: Начинаем транзакцию обновления...', {
            subcategoriesCount: subcategoryIds?.length || 0,
            featuresCount: featureIds?.length || 0,
            specificationsCount: specifications?.length || 0,
        });

        // Обновляем продукт в транзакции
        const result = await prisma.$transaction(async (tx) => {
            // Обновляем основную запись продукта
            const updatedProduct = await tx.product.update({
                where: { id },
                data: productData
            });

            // Удаляем существующие связи с подкатегориями
            await tx.productSubcategory.deleteMany({
                where: { productId: id }
            });

            // Создаем новые связи с подкатегориями
            if (subcategoryIds && subcategoryIds.length > 0) {
                await tx.productSubcategory.createMany({
                    data: subcategoryIds.map(subcategoryId => ({
                        productId: id,
                        subcategoryId
                    }))
                });
            }

            // Удаляем существующие связи с особенностями
            await tx.productFeature.deleteMany({
                where: { productId: id }
            });

            // Создаем новые связи с особенностями
            if (featureIds && featureIds.length > 0) {
                await tx.productFeature.createMany({
                    data: featureIds.map(featureId => ({
                        productId: id,
                        featureId
                    }))
                });
            }

            // Удаляем существующие значения спецификаций
            await tx.productSpecificationValue.deleteMany({
                where: { productId: id }
            });

            // Создаем новые значения спецификаций
            if (specifications && specifications.length > 0) {
                await tx.productSpecificationValue.createMany({
                    data: specifications.map(spec => ({
                        productId: id,
                        specificationId: specificationMap[spec.key],
                        value: spec.value
                    }))
                });
            }

            return updatedProduct;
        });

        console.log('✅ updateProduct: Продукт успешно обновлен', {
            productId: result.id,
            productName: result.name,
            productSku: result.sku,
        });

        revalidatePath('/admin/products');
        return {
            success: true,
            data: { id: result.id },
            message: 'Product updated successfully'
        };

    } catch (error) {
        console.error('❌ Error in updateProduct:', error);

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
 * Получает продукт по slug со всеми связанными данными (возвращает сырые данные Prisma)
 */
export async function getProductBySlug(slug: string) {
    try {
        console.log('🔍 getProductBySlug: Загружаем продукт по slug...', { slug });

        const product = await prisma.product.findUnique({
            where: {
                slug,
                isActive: true // Только активные продукты
            },
            include: {
                // Категория
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        isActive: true,
                        sortOrder: true,
                    },
                },
                // Бренд
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        logo: true,
                        website: true,
                        isActive: true,
                        sortOrder: true,
                    },
                },
                // Подкатегории
                productSubcategories: {
                    include: {
                        subcategory: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                description: true,
                                isActive: true,
                                sortOrder: true,
                            }
                        }
                    }
                },
                // Особенности
                features: {
                    include: {
                        feature: {
                            select: {
                                id: true,
                                name: true,
                                key: true,
                                icon: true,
                                iconImage: true,
                                description: true,
                                category: true,
                                color: true,
                                isActive: true,
                                sortOrder: true,
                            }
                        }
                    }
                },
                // Спецификации со значениями
                specificationValues: {
                    include: {
                        specification: {
                            select: {
                                id: true,
                                name: true,
                                key: true,
                                description: true,
                                unit: true,
                                type: true,
                                icon: true,
                                category: true,
                                isActive: true,
                                sortOrder: true,
                            }
                        }
                    },
                    orderBy: {
                        specification: {
                            sortOrder: 'asc'
                        }
                    }
                },
                // Отзывы (только одобренные)
                Review: {
                    where: {
                        isApproved: true
                    },
                    select: {
                        id: true,
                        rating: true,
                        title: true,
                        description: true,
                        isVerifiedPurchase: true,
                        createdAt: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 10 // Ограничиваем количество отзывов
                }
            },
        });

        if (!product) {
            console.log('❌ getProductBySlug: Продукт не найден', { slug });
            return {
                success: false,
                message: 'Product not found'
            };
        }

        console.log('✅ getProductBySlug: Продукт загружен', {
            id: product.id,
            name: product.name,
            sku: product.sku,
            slug: product.slug,
            categoryName: product.category.name,
            brandName: product.brand.name,
            subcategoriesCount: product.productSubcategories.length,
            featuresCount: product.features.length,
            specificationsCount: product.specificationValues.length,
            reviewsCount: product.Review.length,
            imagesCount: product.images.length,
            stock: product.stock,
            price: product.price,
            rating: product.rating,
            numReviews: product.numReviews,
        });

        // Возвращаем в стандартном формате проекта
        return {
            success: true,
            data: product
        };

    } catch (error) {
        console.error('❌ Error in getProductBySlug:', error);
        return {
            success: false,
            message: formatError(error)
        };
    }
}
/**
 * Удаляет продукт по ID с проверкой связей
 */
export async function deleteProduct(id: string) {
    try {
        const productExist = await prisma.product.findUnique({ where: { id } });

        if (!productExist) {
            return { success: false, message: "Product not found" };
        }

        // Проверяем есть ли заказы с этим товаром
        const ordersCount = await prisma.orderItem.count({
            where: { productId: id }
        });

        if (ordersCount > 0) {
            return {
                success: false,
                message: `Cannot delete product: it appears in ${ordersCount} order${ordersCount > 1 ? 's' : ''}`
            };
        }

        // Проверяем есть ли отзывы (опционально, можно удалить вместе с товаром)
        const reviewsCount = await prisma.review.count({
            where: { productId: id }
        });

        console.log(`🗑️ Deleting product ${productExist.name} (${productExist.sku}):`, {
            ordersCount,
            reviewsCount,
            willDeleteReviews: reviewsCount > 0
        });

        await prisma.product.delete({ where: { id } });
        revalidatePath('/admin/products');

        return {
            success: true,
            message: `Product "${productExist.name}" deleted successfully${reviewsCount > 0 ? ` (${reviewsCount} reviews also deleted)` : ''}`
        };
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        return { success: false, message: formatError(error) };
    }
}

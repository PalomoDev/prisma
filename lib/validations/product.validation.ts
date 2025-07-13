import { z } from 'zod';
import { currency } from "@/lib/validations/unit.validation";

// ========================================
// PRODUCT SCHEMAS - Схемы для продуктов
// ========================================

/**
 * Схема валидации для создания продукта
 */
export const insertProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    sku: z.string().min(1, 'SKU is required'),
    categoryId: z.string().uuid('Please select a valid category'),
    brandId: z.string().uuid('Please select a valid brand'),
    description: z.string().min(3, 'Description must be at least 3 characters'),
    stock: z.coerce.number().min(0, 'Stock must be a positive number'),
    images: z.array(z.string()).min(1, 'Product must have at least one image'),
    price: currency,

    // Optional поля
    isFeatured: z.boolean().optional(),
    banner: z.string().nullable().optional(),

    // Many-to-many связи
    subcategoryIds: z.array(z.string().uuid()).optional(),
    featureIds: z.array(z.string().uuid()).optional(),

    // Характеристики товара
    specifications: z.array(z.object({
        name: z.string().min(1, 'Specification name is required'),
        key: z.string().min(1, 'Specification key is required'),
        value: z.string().min(1, 'Specification value is required'),
        unit: z.string().nullable().optional(),
        type: z.enum(['number', 'text', 'select', 'boolean']),
        sortOrder: z.number().optional(),
    })).optional(),
});

/**
 * Схема валидации для обновления продукта
 */
export const updateProductSchema = insertProductSchema
    .partial()
    .extend({
        id: z.string().uuid('Invalid product ID'),
    });

/**
 * Схема валидации для получения продукта по ID
 */
export const getProductByIdSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

/**
 * Схема валидации для удаления продукта
 */
export const deleteProductSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

// ========================================
// RESPONSE SCHEMAS - Схемы ответов
// ========================================

/**
 * Схема для характеристик продукта в ответе
 */
export const productSpecificationResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    key: z.string(),
    value: z.string(),
    unit: z.string().nullable(),
    type: z.string(),
    sortOrder: z.number(),
});

/**
 * Схема для особенностей продукта в ответе
 */
export const productFeatureResponseSchema = z.object({
    feature: z.object({
        id: z.string(),
        name: z.string(),
        key: z.string(),
        icon: z.string(),
        iconImage: z.string().nullable(),
        description: z.string().nullable(),
        category: z.string().nullable(),
        color: z.string().nullable(),
        isActive: z.boolean(),
        sortOrder: z.number(),
    }),
});

/**
 * Схема для подкатегорий продукта в ответе
 */
export const productSubcategoryResponseSchema = z.object({
    subcategory: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().nullable(),
        isActive: z.boolean(),
        sortOrder: z.number(),
    }),
});

/**
 * Схема для категории в ответе продукта
 */
export const productCategoryResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number(),
});

/**
 * Схема для бренда в ответе продукта (переименована для избежания конфликта)
 */
export const productBrandResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    logo: z.string().nullable(),
    website: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number(),
});

/**
 * Схема продукта в ответе (полная)
 */
export const productResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    sku: z.string(),
    categoryId: z.string(),
    brandId: z.string(),
    images: z.array(z.string()),
    description: z.string(),
    stock: z.number(),
    price: z.number(),
    rating: z.number(),
    numReviews: z.number(),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),

    // Связанные данные
    category: productCategoryResponseSchema,
    brand: productBrandResponseSchema,
    productSubcategories: z.array(productSubcategoryResponseSchema),
    specifications: z.array(productSpecificationResponseSchema),
    productFeatures: z.array(productFeatureResponseSchema),
});

/**
 * Схема ответа функции getAllProducts
 */
export const getAllProductsResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(productResponseSchema).optional(),
    totalPages: z.number().optional(),
    currentPage: z.number().optional(),
    totalCount: z.number().optional(),
    message: z.string().optional(),
});

export const productShortResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    categoryId: z.string(),
    brandId: z.string(),
    images: z.array(z.string()),
    description: z.string(),
    price: z.number(),
});


export const getGalleryProductResponseSchema = z.object({
    success: z.boolean().optional(),
    data: z.array(productShortResponseSchema).optional(),
    message: z.string().optional(),
    }
)

/**
 * Схема ответа для одного продукта
 */
export const getProductResponseSchema = z.object({
    success: z.boolean(),
    data: productResponseSchema.optional(),
    message: z.string().optional(),
});

/**
 * Схема ответа для создания/обновления продукта
 */
export const productActionResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        id: z.string(),
    }).optional(),
    message: z.string().optional(),
});
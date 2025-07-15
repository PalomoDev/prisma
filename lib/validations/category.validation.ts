import { z } from 'zod';

// ========================================
// CATEGORY SCHEMAS - Схемы для категорий
// ========================================

/**
 * Схема валидации для создания категории
 */
export const createCategorySchema = z.object({
    name: z.string().min(1, { message: 'Название категории обязательно' }),
    slug: z.string().min(3, 'Slug должен содержать минимум 3 символа'),
    description: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    isActive: z.boolean(),
    sortOrder: z.coerce.number().int(),
    subcategoryIds: z.array(z.string().uuid()).optional(),
});

/**
 * Схема для категории из базы данных
 */
export const CategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

/**
 * Схема валидации для обновления категории
 */
export const updateCategorySchema = createCategorySchema.partial().extend({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

/**
 * Схема валидации для получения категории по ID
 */
export const getCategoryByIdSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

/**
 * Схема валидации для получения категории по slug
 */
export const getCategoryBySlugSchema = z.object({
    slug: z.string().min(1, { message: 'Slug обязателен' }),
});

/**
 * Схема валидации для удаления категории
 */
export const deleteCategorySchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

/**
 * Схема для связи категории и подкатегории в ответе getCategoryById
 */
export const categorySubcategoryWithSubcategorySchema = z.object({
    id: z.string().uuid(),
    categoryId: z.string().uuid(),
    subcategoryId: z.string().uuid(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    subcategory: z.object({
        id: z.string().uuid(),
        name: z.string(),
        slug: z.string(),
    }),
});

/**
 * Схема для полных данных категории (как в getCategoryById)
 */
export const categoryWithRelationsSchema = CategorySchema.extend({
    categorySubcategories: z.array(categorySubcategoryWithSubcategorySchema),
    _count: z.object({
        products: z.number().int(),
    }),
});

/**
 * Схема ответа функции getCategoryById
 */
export const getCategoryByIdResponseSchema = z.object({
    success: z.boolean(),
    data: categoryWithRelationsSchema.optional(),
    message: z.string().optional(),
});

// ========================================
// SUBCATEGORY SCHEMAS - Схемы для подкатегорий
// ========================================

/**
 * Схема валидации для создания подкатегории
 */
export const createSubcategorySchema = z.object({
    name: z.string().min(1, { message: 'Название подкатегории обязательно' }),
    slug: z.string().min(3, 'Slug должен содержать минимум 3 символа'),
    description: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    isActivity: z.boolean(),
    isActive: z.boolean(),
    sortOrder: z.coerce.number().int(),
    categoryIds: z.array(z.string().uuid({ message: 'Неверный формат ID категории' })).optional(),
});

/**
 * Схема для подкатегории из базы данных
 */
export const SubcategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    isActivity: z.boolean(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

/**
 * Схема валидации для обновления подкатегории
 */
export const updateSubcategorySchema = createSubcategorySchema.partial().extend({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

/**
 * Схема валидации для получения подкатегории по ID
 */
export const getSubcategoryByIdSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

/**
 * Схема валидации для получения подкатегорий по ID категории
 */
export const getSubcategoriesByCategoryIdSchema = z.object({
    categoryId: z.string().uuid({ message: 'Неверный формат ID категории' }),
});

/**
 * Схема валидации для удаления подкатегории
 */
export const deleteSubcategorySchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

/**
 * Схема для связи подкатегории и категории в ответе getSubcategoryById
 */
export const subcategoryCategoryWithCategorySchema = z.object({
    id: z.string().uuid(),
    categoryId: z.string().uuid(),
    subcategoryId: z.string().uuid(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    category: z.object({
        id: z.string().uuid(),
        name: z.string(),
        slug: z.string(),
    }),
});

/**
 * Схема для полных данных подкатегории (как в getSubcategoryById)
 */
export const subcategoryWithRelationsSchema = SubcategorySchema.extend({
    categorySubcategories: z.array(subcategoryCategoryWithCategorySchema),
    _count: z.object({
        productSubcategories: z.number().int(),
    }),
});

/**
 * Схема ответа функции getSubcategoryById
 */
export const getSubcategoryByIdResponseSchema = z.object({
    success: z.boolean(),
    data: subcategoryWithRelationsSchema.optional(),
    message: z.string().optional(),
});

// ========================================
// CATEGORY-SUBCATEGORY RELATION SCHEMAS - Схемы для связей категорий и подкатегорий
// ========================================

/**
 * Схема для связи категории и подкатегории
 */
export const createCategorySubcategorySchema = z.object({
    categoryId: z.string().uuid({ message: 'Неверный формат ID категории' }),
    subcategoryId: z.string().uuid({ message: 'Неверный формат ID подкатегории' }),
    sortOrder: z.coerce.number().int().default(0),
});

/**
 * Схема для массового создания связей
 */
export const createMultipleCategorySubcategorySchema = z.object({
    categoryId: z.string().uuid({ message: 'Неверный формат ID категории' }),
    subcategoryIds: z.array(z.string().uuid({ message: 'Неверный формат ID подкатегории' })),
    sortOrder: z.coerce.number().int().default(0),
});

/**
 * Схема для удаления связи категории и подкатегории
 */
export const deleteCategorySubcategorySchema = z.object({
    categoryId: z.string().uuid({ message: 'Неверный формат ID категории' }),
    subcategoryId: z.string().uuid({ message: 'Неверный формат ID подкатегории' }),
});

// ========================================
// BRAND SCHEMAS - Схемы для брендов
// ========================================

/**
 * Схема валидации для создания бренда
 */
export const createBrandSchema = z.object({
    name: z.string().min(1, 'Название бренда обязательно'),
    slug: z.string().min(1, 'Slug обязателен'),
    description: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
    website: z.string()
        .nullable()
        .optional()
        .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
            message: 'Неверный формат URL сайта'
        }),
    isActive: z.boolean(),
    sortOrder: z.coerce.number().int(),
});

/**
 * Схема для бренда из базы данных
 */
export const brandSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    logo: z.string().nullable(),
    website: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

/**
 * Схема для полных данных бренда (как в getBrandById)
 */
export const brandWithRelationsSchema = brandSchema.extend({
    _count: z.object({
        products: z.number().int(),
    }),
});

/**
 * Схема ответа функции getBrandById
 */
export const getBrandByIdResponseSchema = z.object({
    success: z.boolean(),
    data: brandWithRelationsSchema.optional(),
    message: z.string().optional(),
});

/**
 * Схема валидации для обновления бренда
 */
export const updateBrandSchema = createBrandSchema.partial().extend({
    id: z.string().uuid('Неверный формат ID бренда'),
});

/**
 * Схема валидации для получения бренда по ID
 */
export const getBrandByIdSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID бренда' }),
});

/**
 * Схема валидации для получения бренда по slug
 */
export const getBrandBySlugSchema = z.object({
    slug: z.string().min(1, { message: 'Slug обязателен' }),
});

/**
 * Схема валидации для удаления бренда
 */
export const deleteBrandSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID бренда' }),
});

// ========================================
// FEATURE SCHEMAS - Схемы для особенностей
// ========================================

/**
 * Схема валидации для создания особенности
 */
export const createFeatureSchema = z.object({
    name: z.string().min(1, 'Название особенности обязательно'),
    key: z.string().min(1, 'Ключ особенности обязателен'),
    icon: z.string().min(1, 'Иконка обязательна'),
    iconImage: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    isActive: z.boolean(),
    sortOrder: z.coerce.number().int(),
});

/**
 * Схема для особенности из базы данных
 */
export const featureSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    key: z.string(),
    icon: z.string(),
    iconImage: z.string().nullable(),
    description: z.string().nullable(),
    category: z.string().nullable(),
    color: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

/**
 * Схема валидации для обновления особенности
 */
export const updateFeatureSchema = createFeatureSchema.partial().extend({
    id: z.string().uuid('Неверный формат ID особенности'),
});

/**
 * Схема валидации для получения особенности по ID
 */
export const getFeatureByIdSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID особенности' }),
});

/**
 * Схема валидации для получения особенности по key
 */
export const getFeatureByKeySchema = z.object({
    key: z.string().min(1, { message: 'Ключ особенности обязателен' }),
});

/**
 * Схема валидации для удаления особенности
 */
export const deleteFeatureSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID особенности' }),
});

// ========================================
// RESPONSE SCHEMAS - Схемы для ответов API
// ========================================

export const GetCategoriesResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(CategorySchema.extend({
        categorySubcategories: z.array(z.object({
            subcategory: z.object({
                id: z.string(),
                name: z.string(),
                slug: z.string(),
            }),
            sortOrder: z.number().int(),
        })),
        _count: z.object({
            products: z.number().int(),
        }),
    })).optional(),
    message: z.string().optional(),
});

/**
 * Схема ответа функции getSubcategories
 */
export const GetSubcategoriesResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(SubcategorySchema.extend({
        categorySubcategories: z.array(z.object({
            category: z.object({
                id: z.string(),
                name: z.string(),
                slug: z.string(),
            }),
            sortOrder: z.number().int(),
        })),
        _count: z.object({
            productSubcategories: z.number().int(),
        }),
    })).optional(),
    message: z.string().optional(),
});

/**
 * Схема ответа функции getBrands
 */
export const brandsResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(brandSchema.extend({
        _count: z.object({
            products: z.number().int(),
        }),
    })).optional(),
    message: z.string().optional(),
});

/**
 * Схема ответа для одного бренда
 */
export const brandResponseSchema = z.object({
    success: z.boolean(),
    data: brandSchema.optional(),
    message: z.string().optional(),
});

/**
 * Схема ответа функции getFeatures
 */
export const featuresResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(featureSchema).optional(),
    message: z.string().optional(),
});

/**
 * Схема ответа для одной особенности
 */
export const featureResponseSchema = z.object({
    success: z.boolean(),
    data: featureSchema.optional(),
    message: z.string().optional(),
});

// ========================================
// UTILITY SCHEMAS - Вспомогательные схемы
// ========================================

/**
 * Схема для валидации массива ID
 */
export const idsArraySchema = z.array(z.string().uuid('Неверный формат ID'));

/**
 * Схема для валидации slug
 */
export const slugSchema = z.string()
    .min(1, 'Slug обязателен')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug может содержать только строчные буквы, цифры и дефисы');

/**
 * Схема для валидации параметров пагинации
 */
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1, 'Номер страницы должен быть больше 0').default(1),
    limit: z.coerce.number().int().min(1, 'Лимит должен быть больше 0').max(100, 'Лимит не может быть больше 100').default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
});
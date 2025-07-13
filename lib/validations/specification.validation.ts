import { z } from 'zod';

// ========================================
// SPECIFICATION SCHEMAS - Схемы для спецификаций
// ========================================

/**
 * Схема валидации для создания спецификации
 */
export const createSpecificationSchema = z.object({
    name: z.string().min(1, { message: 'Название спецификации обязательно' }),
    key: z.string()
        .min(1, 'Ключ спецификации обязателен')
        .regex(/^[a-z0-9_-]+$/, 'Ключ может содержать только строчные буквы, цифры и подчеркивания'),
    description: z.string().nullable().optional(),
    unit: z.string().nullable().optional(),
    type: z.enum(['number', 'text', 'select', 'boolean', 'range'], {
        errorMap: () => ({ message: 'Неверный тип спецификации' })
    }),
    options: z.array(z.string()).optional(),
    icon: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    isActive: z.boolean(),
    sortOrder: z.coerce.number().int(),
});

/**
 * Схема для спецификации из базы данных
 */
export const specificationSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    key: z.string(),
    description: z.string().nullable(),
    unit: z.string().nullable(),
    type: z.string(),
    options: z.array(z.string()),
    icon: z.string().nullable(),
    category: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

/**
 * Схема валидации для обновления спецификации
 */
export const updateSpecificationSchema = createSpecificationSchema.partial().extend({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

/**
 * Схема валидации для получения спецификации по ID
 */
export const getSpecificationByIdSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

/**
 * Схема валидации для получения спецификации по key
 */
export const getSpecificationByKeySchema = z.object({
    key: z.string().min(1, { message: 'Ключ спецификации обязателен' }),
});

/**
 * Схема валидации для удаления спецификации
 */
export const deleteSpecificationSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

// ========================================
// CATEGORY SPECIFICATION SCHEMAS - Схемы для связей категорий и спецификаций
// ========================================

/**
 * Схема валидации для создания связи категории и спецификации
 */
export const createCategorySpecificationSchema = z.object({
    categoryId: z.string().uuid({ message: 'Неверный формат ID категории' }),
    specificationId: z.string().uuid({ message: 'Неверный формат ID спецификации' }),
    isRequired: z.boolean().default(false),
    sortOrder: z.coerce.number().int().default(0),
});

/**
 * Схема для связи категории и спецификации из базы данных
 */
export const categorySpecificationSchema = z.object({
    id: z.string().uuid(),
    categoryId: z.string().uuid(),
    specificationId: z.string().uuid(),
    isRequired: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

/**
 * Схема валидации для массового создания связей категории со спецификациями
 */
export const createMultipleCategorySpecificationSchema = z.object({
    categoryId: z.string().uuid({ message: 'Неверный формат ID категории' }),
    specifications: z.array(z.object({
        specificationId: z.string().uuid({ message: 'Неверный формат ID спецификации' }),
        isRequired: z.boolean().default(false),
        sortOrder: z.coerce.number().int().default(0),
    })),
});

/**
 * Схема валидации для обновления связи категории и спецификации
 */
export const updateCategorySpecificationSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID связи' }),
    isRequired: z.boolean().optional(),
    sortOrder: z.coerce.number().int().optional(),
});

/**
 * Схема валидации для удаления связи категории и спецификации
 */
export const deleteCategorySpecificationSchema = z.object({
    categoryId: z.string().uuid({ message: 'Неверный формат ID категории' }),
    specificationId: z.string().uuid({ message: 'Неверный формат ID спецификации' }),
});

/**
 * Схема валидации для получения спецификаций по ID категории
 */
export const getSpecificationsByCategoryIdSchema = z.object({
    categoryId: z.string().uuid({ message: 'Неверный формат ID категории' }),
    includeInactive: z.boolean().default(false),
});

// ========================================
// PRODUCT SPECIFICATION VALUE SCHEMAS - Схемы для значений спецификаций товаров
// ========================================

/**
 * Схема валидации для создания значения спецификации товара
 */
export const createProductSpecificationValueSchema = z.object({
    productId: z.string().uuid({ message: 'Неверный формат ID товара' }),
    specificationId: z.string().uuid({ message: 'Неверный формат ID спецификации' }),
    value: z.string().min(1, { message: 'Значение спецификации обязательно' }),
});

/**
 * Схема для значения спецификации товара из базы данных
 */
export const productSpecificationValueSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    specificationId: z.string().uuid(),
    value: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

/**
 * Схема валидации для массового создания значений спецификаций товара
 */
export const createMultipleProductSpecificationValueSchema = z.object({
    productId: z.string().uuid({ message: 'Неверный формат ID товара' }),
    specifications: z.array(z.object({
        specificationId: z.string().uuid({ message: 'Неверный формат ID спецификации' }),
        value: z.string().min(1, { message: 'Значение спецификации обязательно' }),
    })),
});

/**
 * Схема валидации для обновления значения спецификации товара
 */
export const updateProductSpecificationValueSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID значения' }),
    value: z.string().min(1, { message: 'Значение спецификации обязательно' }),
});

/**
 * Схема валидации для массового обновления значений спецификаций товара
 */
export const updateMultipleProductSpecificationValueSchema = z.object({
    productId: z.string().uuid({ message: 'Неверный формат ID товара' }),
    specifications: z.array(z.object({
        specificationId: z.string().uuid({ message: 'Неверный формат ID спецификации' }),
        value: z.string().min(1, { message: 'Значение спецификации обязательно' }),
    })),
});

/**
 * Схема валидации для удаления значения спецификации товара
 */
export const deleteProductSpecificationValueSchema = z.object({
    productId: z.string().uuid({ message: 'Неверный формат ID товара' }),
    specificationId: z.string().uuid({ message: 'Неверный формат ID спецификации' }),
});

/**
 * Схема валидации для получения значений спецификаций по ID товара
 */
export const getProductSpecificationValuesByProductIdSchema = z.object({
    productId: z.string().uuid({ message: 'Неверный формат ID товара' }),
});

// ========================================
// RESPONSE SCHEMAS - Схемы для ответов API
// ========================================

/**
 * Схема ответа функции getSpecifications
 */
export const specificationsResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(specificationSchema.extend({
        _count: z.object({
            productSpecifications: z.number().int(),
            categorySpecs: z.number().int(),
        }).optional(),
    })).optional(),
    message: z.string().optional(),
});

/**
 * Схема ответа для одной спецификации
 */
export const specificationResponseSchema = z.object({
    success: z.boolean(),
    data: specificationSchema.optional(),
    message: z.string().optional(),
});

/**
 * Схема ответа функции getCategorySpecifications
 */
export const categorySpecificationsResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(categorySpecificationSchema.extend({
        specification: specificationSchema,
        category: z.object({
            id: z.string().uuid(),
            name: z.string(),
            slug: z.string(),
        }),
    })).optional(),
    message: z.string().optional(),
});

/**
 * Схема ответа функции getSpecificationsByCategory с расширенной информацией
 */
export const specificationsByCategoryResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(specificationSchema.extend({
        categorySpecification: z.object({
            isRequired: z.boolean(),
            sortOrder: z.number().int(),
        }).optional(),
    })).optional(),
    message: z.string().optional(),
});

/**
 * Схема ответа функции getProductSpecificationValues
 */
export const productSpecificationValuesResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(productSpecificationValueSchema.extend({
        specification: specificationSchema,
        product: z.object({
            id: z.string().uuid(),
            name: z.string(),
            slug: z.string(),
        }).optional(),
    })).optional(),
    message: z.string().optional(),
});

/**
 * Схема ответа для значений спецификаций товара с группировкой по категориям
 */
export const groupedProductSpecificationValuesResponseSchema = z.object({
    success: z.boolean(),
    data: z.record(
        z.string(), // category name
        z.array(productSpecificationValueSchema.extend({
            specification: specificationSchema,
        }))
    ).optional(),
    message: z.string().optional(),
});

// ========================================
// FILTER SCHEMAS - Схемы для фильтрации
// ========================================

/**
 * Схема для фильтрации спецификаций
 */
export const specificationFilterSchema = z.object({
    category: z.string().optional(),
    type: z.enum(['number', 'text', 'select', 'boolean', 'range']).optional(),
    isActive: z.boolean().optional(),
    search: z.string().optional(), // Поиск по названию или ключу
});

/**
 * Схема для фильтрации товаров по спецификациям
 */
export const productSpecificationFilterSchema = z.object({
    specifications: z.record(
        z.string(), // specification key
        z.union([
            z.string(), // Точное значение
            z.object({
                min: z.number().optional(),
                max: z.number().optional(),
            }), // Диапазон для числовых значений
            z.array(z.string()), // Массив значений для множественного выбора
        ])
    ).optional(),
});

// ========================================
// UTILITY SCHEMAS - Вспомогательные схемы
// ========================================

/**
 * Схема для валидации значения спецификации в зависимости от типа
 */
export const validateSpecificationValueSchema = z.object({
    type: z.enum(['number', 'text', 'select', 'boolean', 'range']),
    value: z.string(),
    options: z.array(z.string()).optional(),
}).refine((data) => {
    switch (data.type) {
        case 'number':
            return !isNaN(Number(data.value));
        case 'boolean':
            return ['true', 'false', '1', '0'].includes(data.value.toLowerCase());
        case 'select':
            return data.options ? data.options.includes(data.value) : true;
        case 'range':
            // Проверяем формат "min-max" для диапазона
            const rangeParts = data.value.split('-');
            return rangeParts.length === 2 &&
                !isNaN(Number(rangeParts[0])) &&
                !isNaN(Number(rangeParts[1]));
        case 'text':
        default:
            return true;
    }
}, {
    message: 'Неверное значение для данного типа спецификации',
});

/**
 * Схема для валидации типов спецификаций
 */
export const specificationTypeSchema = z.enum(['number', 'text', 'select', 'boolean', 'range']);

/**
 * Схема для валидации категорий спецификаций
 */
export const specificationCategorySchema = z.enum(['size', 'comfort', 'protection', 'material', 'performance', 'durability', 'weight']);

/**
 * Схема для массового импорта спецификаций
 */
export const bulkImportSpecificationsSchema = z.object({
    specifications: z.array(createSpecificationSchema),
    categoryId: z.string().uuid({ message: 'Неверный формат ID категории' }).optional(),
    overwriteExisting: z.boolean().default(false),
});
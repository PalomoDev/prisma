import {z} from "zod";
import {specificationCategorySchema, specificationTypeSchema} from "@/lib/validations/specification.validation";

/**
 * Схема для получения всех спецификаций с фильтрацией
 */
export const getAllSpecificationsSchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    category: specificationCategorySchema.optional(),
    type: specificationTypeSchema.optional(),
    isActive: z.boolean().optional(),
    sortBy: z.enum(['name', 'createdAt', 'sortOrder', 'category']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Получение всех спецификаций
export type GetAllSpecifications = z.infer<typeof getAllSpecificationsSchema>;

/**
 * Схема для получения всех особенностей с фильтрацией
 */
export const getAllFeaturesSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    category: z.enum(['protection', 'comfort', 'convenience', 'performance', 'durability']).optional(),
    color: z.enum(['blue', 'green', 'orange', 'red', 'purple', 'yellow', 'gray']).optional(),
    isActive: z.boolean().optional(),
    sortBy: z.enum(['name', 'createdAt', 'sortOrder', 'category']).default('sortOrder'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Получение всех особенностей
export type GetAllFeatures = z.infer<typeof getAllFeaturesSchema>;

// ========================================
// SPECIFICATION SCHEMAS WITH CATEGORIES - Схемы спецификаций с категориями
// ========================================

/**
 * Полная схема для создания спецификации с категориями
 */
export const createSpecificationWithCategoriesSchema = z.object({
    name: z.string().min(1, { message: 'Название спецификации обязательно' }),
    key: z.string()
        .min(1, 'Ключ спецификации обязателен')
        .regex(/^[a-z0-9_-]+$/, 'Ключ может содержать только строчные буквы, цифры, подчеркивания и дефисы'),
    description: z.string().nullable().optional(),
    unit: z.string().nullable().optional(),
    type: z.enum(['number', 'text', 'select', 'boolean', 'range'], {
        errorMap: () => ({ message: 'Неверный тип спецификации' })
    }),
    icon: z.string().nullable().optional(),
    isActive: z.boolean(),
    sortOrder: z.coerce.number().int(),
    categoryIds: z.array(z.string().uuid()),
    isGlobal: z.boolean(),
});

/**
 * Схема для обновления спецификации с категориями
 */
export const updateSpecificationWithCategoriesSchema = createSpecificationWithCategoriesSchema.partial().extend({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

// Типы
export type CreateSpecificationWithCategoriesInput = z.infer<typeof createSpecificationWithCategoriesSchema>;
export type UpdateSpecificationWithCategoriesInput = z.infer<typeof updateSpecificationWithCategoriesSchema>;
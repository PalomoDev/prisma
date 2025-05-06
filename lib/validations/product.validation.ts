import { z } from 'zod';

/**
 * Схема валидации для создания продукта
 */
export const createProductSchema = z.object({
    name: z.string().min(1, { message: 'Название продукта обязательно' }),
    imageUrl: z.string().url({ message: 'Неверный формат URL изображения' }),
});

/**
 * Схема валидации для обновления продукта
 */
export const updateProductSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
    name: z.string().min(1, { message: 'Название продукта обязательно' }).optional(),
    imageUrl: z.string().url({ message: 'Неверный формат URL изображения' }).optional(),
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

/**
 * Типы на основе схем Zod для использования в TypeScript
 */
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductByIdInput = z.infer<typeof getProductByIdSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
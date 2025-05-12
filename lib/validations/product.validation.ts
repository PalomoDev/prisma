import { z } from 'zod';
import {formatNumberWithDecimal} from "@/lib/utils";


const currency = z
    .string()
    .refine(
        (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
        'Price must be a number with 2 decimal places'
    )

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

export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z.number().int().nonnegative('Quantity must be a positive number'),
    image: z.string().min(1, 'Image is required'),
    price: currency,
});

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart id is required'),
    userId: z.string().optional().nullable(),
});


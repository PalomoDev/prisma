import { z } from "zod";
import { currency } from "@/lib/validations/unit.validation";

// ========================================
// CART SCHEMAS - Схемы для корзины
// ========================================

/**
 * Схема для элемента корзины
 */
export const cartItemSchema = z.object({
    productId: z.string().uuid('Invalid product ID'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z.number().int().min(1, 'Quantity must be at least 1'),
    image: z.string().min(1, 'Image is required'),
    price: currency,
});

/**
 * Схема для создания корзины
 */
export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart id is required'),
    userId: z.string().uuid().optional().nullable(),
});

/**
 * Схема для обновления корзины
 */
export const updateCartSchema = insertCartSchema.partial().extend({
    id: z.string().uuid('Invalid cart ID'),
});

/**
 * Схема для получения корзины по ID
 */
export const getCartByIdSchema = z.object({
    id: z.string().uuid('Invalid cart ID'),
});

/**
 * Схема для получения корзины по session ID
 */
export const getCartBySessionSchema = z.object({
    sessionCartId: z.string().min(1, 'Session cart ID is required'),
});

/**
 * Схема для добавления товара в корзину
 */
export const addToCartSchema = z.object({
    productId: z.string().uuid('Invalid product ID'),
    qty: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Maximum quantity is 10'),
    sessionCartId: z.string().min(1, 'Session cart ID is required'),
    userId: z.string().uuid().optional().nullable(),
});

/**
 * Схема для обновления количества товара в корзине
 */
export const updateCartItemSchema = z.object({
    productId: z.string().uuid('Invalid product ID'),
    qty: z.number().int().min(0, 'Quantity must be positive').max(10, 'Maximum quantity is 10'),
    sessionCartId: z.string().min(1, 'Session cart ID is required'),
});

/**
 * Схема для удаления товара из корзины
 */
export const removeFromCartSchema = z.object({
    productId: z.string().uuid('Invalid product ID'),
    sessionCartId: z.string().min(1, 'Session cart ID is required'),
});

/**
 * Схема для очистки корзины
 */
export const clearCartSchema = z.object({
    sessionCartId: z.string().min(1, 'Session cart ID is required'),
});

// ========================================
// RESPONSE SCHEMAS - Схемы ответов
// ========================================

/**
 * Схема ответа корзины
 */
export const cartResponseSchema = z.object({
    id: z.string(),
    userId: z.string().nullable(),
    sessionCartId: z.string(),
    items: z.array(cartItemSchema),
    itemsPrice: z.number(),
    totalPrice: z.number(),
    shippingPrice: z.number(),
    taxPrice: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

/**
 * Схема ответа для операций с корзиной
 */
export const cartActionResponseSchema = z.object({
    success: z.boolean(),
    data: cartResponseSchema.optional(),
    message: z.string().optional(),
});
'use server'

import { cookies } from 'next/headers';
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import type { CartItem } from "@/types";
import {formatError, PrismaToJson} from "@/lib/utils";
import {cartItemSchema, insertCartSchema} from "@/lib/validations/product.validation";
import { roundTwoDecimals } from "@/lib/utils";
import {map} from "zod";
import {revalidatePath} from "next/cache";
import { Prisma } from '@/prisma/generated/client';

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = roundTwoDecimals(
            items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
        ),
        shippingPrice = roundTwoDecimals(itemsPrice > 100 ? 0 : 10),
        taxPrice = roundTwoDecimals(0.21 * itemsPrice),
        totalPrice = roundTwoDecimals(itemsPrice + taxPrice + shippingPrice);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    };
};


/**
 * Добавляет товар в корзину или обновляет его количество, если он уже существует
 *
 * Эта функция обрабатывает несколько сценариев:
 * 1. Если корзины не существует, создает новую корзину с товаром
 * 2. Если корзина существует и товар уже в ней, увеличивает количество
 * 3. Если корзина существует, но товара в ней нет, добавляет товар в корзину
 *
 * Функция также выполняет проверки:
 * - Проверяет наличие ID сессии корзины
 * - Проверяет существование товара в базе данных
 * - Убеждается, что товар есть в наличии перед добавлением/обновлением
 * - Проверяет данные товара на соответствие схеме
 *
 * После успешной операции обновляет страницу продукта для обеспечения
 * согласованности интерфейса с актуальной информацией о наличии.
 *
 * @param data - Товар для добавления в корзину, с данными о продукте и количеством
 * @returns Объект, указывающий на успех/неудачу и содержащий описательное сообщение
 *
 * @example
 * // Добавление нового товара в корзину
 * const result = await addItemToCart({
 *   productId: '123',
 *   name: 'Пример товара',
 *   slug: 'primer-tovara',
 *   qty: 1,
 *   image: '/images/product.jpg',
 *   price: '29.99'
 * });
 */

export async function addItemToCart(data: CartItem) {
    try {
        // Check for cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Cart session not found');

        // Get session and user ID
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;

        // Get cart
        const cart = await getMyCart();

        // Parse and validate item
        const item = cartItemSchema.parse(data);

        // Find product in database
        const product = await prisma.product.findFirst({
            where: { id: item.productId },
        });
        if (!product) throw new Error('Product not found');

        if (!cart) {
            // Create new cart object
            const newCart = insertCartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calcPrice([item]),
            });

            // Add to database
            await prisma.cart.create({
                data: newCart,
            });

            // Revalidate product page
            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} added to cart`,
            };
        } else {
            // Check if item is already in cart
            const existItem = (cart.items as CartItem[]).find(
                (x) => x.productId === item.productId
            );

            if (existItem) {
                // Check stock
                if (product.stock < existItem.qty + 1) {
                    throw new Error('Not enough stock');
                }

                // Increase the quantity
                (cart.items as CartItem[]).find(
                    (x) => x.productId === item.productId
                )!.qty = existItem.qty + 1;
            } else {
                // If item does not exist in cart
                // Check stock
                if (product.stock < 1) throw new Error('Not enough stock');

                // Add item to the cart.items
                cart.items.push(item);
            }

            // Save to database
            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrice(cart.items as CartItem[]),
                },
            });

            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} ${
                    existItem ? 'updated in' : 'added to'
                } cart`,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        };
    }
}


export async function getMyCart() {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('No session cart ID');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get user cart from database
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) return undefined;

    // Convert decimals and return
    return PrismaToJson({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    });
}

export async function removeItemFromCart(productId: string) {
    try {
        // Check for cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Cart session not found');

        // Get Product
        const product = await prisma.product.findFirst({
            where: { id: productId },
        });
        if (!product) throw new Error('Product not found');

        // Get user cart
        const cart = await getMyCart();
        if (!cart) throw new Error('Cart not found');

        // Check for item
        const exist = (cart.items as CartItem[]).find(
            (x) => x.productId === productId
        );
        if (!exist) throw new Error('Item not found');

        // Check if only one in qty
        if (exist.qty === 1) {
            // Remove from cart
            cart.items = (cart.items as CartItem[]).filter(
                (x) => x.productId !== exist.productId
            );
        } else {
            // Decrease qty
            (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
                exist.qty - 1;
        }

        // Update cart in database
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as CartItem[]),
            },
        });

        revalidatePath(`/product/${product.slug}`);

        return {
            success: true,
            message: `${product.name} was removed from cart`,
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}


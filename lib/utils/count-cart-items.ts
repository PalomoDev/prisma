/**
 * Подсчитывает общее количество товаров в корзине
 *
 * Эта функция принимает массив товаров из корзины и суммирует
 * количество (qty) каждого товара, чтобы получить общее
 * количество товаров в корзине.
 *
 * @param items - Массив товаров в корзине
 * @returns Общее количество товаров в корзине
 *
 * @example
 * // Пример использования
 * const cartItems = [
 *   { productId: '123', qty: 2, ... },
 *   { productId: '456', qty: 3, ... }
 * ];
 * const totalItems = countCartItems(cartItems); // Вернет 5
 */
import { CartItem } from "@/types";

export const countCartItems = (
    items: CartItem[] | undefined
): number => {
    if (!items || items.length === 0) {
        return 0;
    }

    return items.reduce((total, item) => total + (item.qty || 0), 0);
};
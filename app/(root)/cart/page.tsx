import Image from 'next/image';
import Link from 'next/link';
import { getMyCart } from "@/lib/actions/cart.actions";
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';


const CartPage = async () => {
    const cart = await getMyCart();
    const items = cart?.items || [];
    const itemsPrice = cart?.itemsPrice || '0.00';
    const totalPrice = cart?.totalPrice || '0.00';
    const taxPrice = cart?.taxPrice || '0.00';
    const shippingPrice = cart?.shippingPrice || '0.00';

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <ShoppingCart size={64} className="text-gray-300 mb-6" />
                <h1 className="text-2xl font-bold mb-2">Ваша корзина пуста</h1>
                <p className="text-gray-500 mb-6">Похоже, вы еще не добавили товары в свою корзину</p>
                <Link href="/products">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        Перейти к покупкам
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <section className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-8">Mi carro de la compra</h1>
            <h3 className={'mb-4'}>Inicia sesión para sincronizar los artículos en tu carro de la compra. Inicia sesión ahora</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Таблица товаров (занимает 2 колонки на больших экранах) */}
                <div className="lg:col-span-2">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="py-4 px-2 text-left text-sm font-medium text-gray-500">Товар</th>
                                <th className="py-4 px-2 text-center text-sm font-medium text-gray-500">Цена</th>
                                <th className="py-4 px-2 text-center text-sm font-medium text-gray-500">Количество</th>
                                <th className="py-4 px-2 text-right text-sm font-medium text-gray-500">Итого</th>
                                <th className="py-4 px-2 text-right text-sm font-medium text-gray-500"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((item) => {
                                const itemTotal = (Number(item.price) * item.qty).toFixed(2);

                                return (
                                    <tr key={item.productId} className="border-b">
                                        <td className="py-4 px-2">
                                            <div className="flex items-center">
                                                <div className="w-16 h-16 relative flex-shrink-0 mr-4">
                                                    <Image
                                                        src={`/${item.image}`}
                                                        alt={item.name}
                                                        fill
                                                        sizes="64px"
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <Link href={`/product/${item.slug}`} className="font-medium text-blue-600 hover:text-blue-800">
                                                        {item.name}
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-center">${item.price}</td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center justify-center">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    aria-label="Уменьшить количество"
                                                >
                                                    <Minus size={16} />
                                                </Button>
                                                <span className="w-8 text-center mx-2">{item.qty}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    aria-label="Увеличить количество"
                                                >
                                                    <Plus size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-right font-medium">${itemTotal}</td>
                                        <td className="py-4 px-2 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-500 hover:text-red-500"
                                                aria-label="Удалить из корзины"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Сводка заказа */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Сводка заказа</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-4">
                                <span className="text-gray-600">Подытог</span>
                                <span className="font-medium">${itemsPrice}</span>
                            </div>

                            <div className="flex justify-between border-b pb-4">
                                <span className="text-gray-600">Налог</span>
                                <span className="font-medium">${taxPrice}</span>
                            </div>

                            <div className="flex justify-between border-b pb-4">
                                <span className="text-gray-600">Доставка</span>
                                <span className="font-medium">${shippingPrice}</span>
                            </div>

                            <div className="flex justify-between pt-2">
                                <span className="text-lg font-bold">Итого</span>
                                <span className="text-lg font-bold">${totalPrice}</span>
                            </div>

                            <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                                Оформить заказ
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartPage;
'use client'
import { Cart, CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart, removeEntireItemFromCart} from "@/lib/actions/cart.actions";
import { ArrowRight, ShoppingCart, Trash2, Plus, Minus, Loader } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';



type Props = {
    cart?: Cart;
}

function RemoveButton({ item }: { item: CartItem }) {

    const [isPending, startTransition] = useTransition();
    return (
        <Button
            disabled={isPending}
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            aria-label="Уменьшить количество"
            type='button'
            onClick={() =>
                startTransition(async () => {
                    await removeItemFromCart(item.productId);

                })
            }
        >
            {isPending ? (
                <Loader className='w-4 h-4 animate-spin' />
            ) : (
                <Minus className='w-4 h-4' />
            )}
        </Button>
    );
}

function AddButton({ item }: { item: CartItem }) {

    const [isPending, startTransition] = useTransition();
    return (
        <Button
            disabled={isPending}
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            aria-label="Увеличить количество"
            type='button'
            onClick={() =>
                startTransition(async () => {
                    await addItemToCart(item);
                })
            }
        >
            {isPending ? (
                <Loader className='w-4 h-4 animate-spin' />
            ) : (
                <Plus className='w-4 h-4' />
            )}
        </Button>
    );
}

function Trash({ item }: { item: CartItem }) {
    const [isPending, startTransition] = useTransition();


    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-500"
            aria-label="Удалить из корзины"
            onClick={() =>
                startTransition(async () => {
                    await removeEntireItemFromCart(item.productId);
                })
            }
        >
            {isPending ? (
                <Loader className='w-4 h-4 animate-spin' />
            ) : (
                <Trash2 size={18} />
            )}

        </Button>
    )
}

const CartTable = ({cart}: Props) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();
    const itemsPrice = cart?.itemsPrice || '0.00';
    const totalPrice = cart?.totalPrice || '0.00';
    const taxPrice = cart?.taxPrice || '0.00';
    const shippingPrice = cart?.shippingPrice || '0.00';

    return (
        <>

            {!cart || cart.items.length === 0 ? (
                <div className = {'flex flex-col items-center justify-center py-20 px-4 text-center'}>
                    <ShoppingCart size={64} className="text-gray-300 mb-6" />
                    <p className = {'text-center'}>No hay productos en tu carro</p>

                    <Link href = {'/'} passHref>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Ir a la tienda
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className={'grid md:grid-cols-4 md:gap-5 '}>
                    <div className='overflow-x-auto md:col-span-3'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Artículo</TableHead>
                                    <TableHead className="text-center">Precio Del Artículo</TableHead>
                                    <TableHead className="text-center">Cantidad</TableHead>
                                    <TableHead className="text-right">Precio</TableHead>
                                    <TableHead className="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.items.map((item) => {
                                    const itemTotal = (Number(item.price) * item.qty).toFixed(2);
                                    return (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className="flex items-center"
                                                >
                                                    <Image
                                                        src={`/${item.image}`}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    />
                                                    <span className="px-2">{item.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                €{item.price}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <RemoveButton item={item} />
                                                    <span className="w-8 text-center mx-2">{item.qty}</span>
                                                    <AddButton item={item} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">€{itemTotal}</TableCell>
                                            <TableCell className="text-center">
                                                <Trash item={item} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className='p-4 gap-4'>
                                <h2 className="text-xl font-bold mb-6">Resumen del pedido</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between border-b pb-4">
                                        <span className="text-gray-600">Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)})</span>
                                        <span className="font-medium">{formatCurrency(itemsPrice)}</span>
                                    </div>

                                    <div className="flex justify-between border-b pb-4">
                                        <span className="text-gray-600">Impuesto</span>
                                        <span className="font-medium">{formatCurrency(taxPrice)}</span>
                                    </div>

                                    <div className="flex justify-between border-b pb-4">
                                        <span className="text-gray-600">Envío</span>
                                        <span className="font-medium">{formatCurrency(shippingPrice)}</span>
                                    </div>

                                    <div className="flex justify-between pt-2">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-lg font-bold">{formatCurrency(totalPrice)}</span>
                                    </div>

                                    <Button
                                        className='w-full mt-6'
                                        disabled={isPending}
                                        onClick={() =>
                                            startTransition(() => router.push('/shipping-address'))
                                        }
                                    >
                                        {isPending ? (
                                            <Loader className='w-4 h-4 animate-spin' />
                                        ) : (
                                            <ArrowRight className='w-4 h-4' />
                                        )}{' '}
                                        Proceder al pago
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </>
    )
}

export default CartTable
import Image from 'next/image';
import Link from 'next/link';
import { getMyCart } from "@/lib/actions/cart.actions";
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import type { Metadata } from "next";
import CartTable from "@/app/(root)/cart/cart-table";

export const metadata: Metadata = {
    title: "Shopping Cart",
    description: "Alexika shop",
};


const CartPage = async () => {
    const cart = await getMyCart();
    const items = cart?.items || [];
    const itemsPrice = cart?.itemsPrice || '0.00';
    const totalPrice = cart?.totalPrice || '0.00';
    const taxPrice = cart?.taxPrice || '0.00';
    const shippingPrice = cart?.shippingPrice || '0.00';





    return (
        <section className="container mx-auto py-10 px-4 ">
            <h1 className="text-2xl font-bold mb-8">Mi carro de la compra</h1>
            <h3 className={'mb-4'}>Inicia sesión para sincronizar los artículos en tu carro de la compra. Inicia sesión ahora</h3>
            <CartTable cart={cart}/>

        </section>
    );
};

export default CartPage;
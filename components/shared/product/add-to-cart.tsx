'use client';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types';
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { cn } from '@/lib/utils';

import { toast } from "sonner"
import {addItemToCart, removeItemFromCart} from "@/lib/actions/cart.actions";
import { Cart } from "@/types";
import { useTransition } from "react";

interface AddToCartProps {
    cart?: Cart;
    item: CartItem;
    className?: string; // Добавили поддержку внешней стилизации
}

export const findItemIndexById = <T extends { productId: string }>(
    array: T[] | undefined,
    productId: string
): number => {
    if (!array || array.length === 0) {
        return -1;
    }

    return array.findIndex(item => item.productId === productId);
};

const AddToCart = ({ item, cart, className }: AddToCartProps) => {
    const router = useRouter();
    const productQuantity = cart?.items[findItemIndexById(cart?.items, item.productId)]?.qty;

    const [isPending, startTransition] = useTransition();

    const handleAddToCart = async () => {
        startTransition(async () => {
            const response = await addItemToCart(item);

            if (!response.success) {
                toast.error('Item not added to cart',);
                return
            }

            toast.success(response.message);

            return
        })
    }

    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const response = await removeItemFromCart(item.productId);

            if (!response.success) {
                toast.error('Item not added to cart',);
                return
            }

            toast.success(response.message);

            return
        })
    }

    return (
        <>
            {productQuantity ? (
                <div className="flex w-full items-center justify-center gap-2">
                    <Button
                        className="flex flex-1 items-center justify-center w-12 h-12 rounded-md bg-primary text-white hover:opacity-90"
                        type="button"
                        onClick={handleRemoveFromCart}
                        aria-label="Уменьшить количество"
                        disabled={!productQuantity}
                    >
                        {isPending ? (<Loader className={'animate-spin'}/>) : <Minus size={18} />}
                    </Button>

                    <div className="flex flex-1 items-center justify-center w-12 h-12 border border-gray-200 rounded-md">
                        {productQuantity}
                    </div>

                    <Button
                        className="flex flex-1 items-center justify-center w-12 h-12 rounded-md bg-primary text-white hover:opacity-90"
                        type="button"
                        onClick={handleAddToCart}
                        aria-label="Увеличить количество"
                    >
                        {isPending ? (<Loader className={'animate-spin'}/>) : <Plus size={18} />}
                    </Button>
                </div>
            ) : (
                <Button
                    className={cn(
                        "flex flex-1 items-center justify-center w-12 h-12 rounded-md bg-primary text-white hover:opacity-90",
                        className // Применяем внешние стили
                    )}
                    type="button"
                    onClick={handleAddToCart}
                    aria-label="Увеличить количество"
                >
                    {isPending ? (<Loader className={'animate-spin'}/>) : <div className={'flex gap-2'}> <Plus size={18}/> <span> Add to cart </span></div>  }
                </Button>
            )}
        </>
    );
}

export default AddToCart;
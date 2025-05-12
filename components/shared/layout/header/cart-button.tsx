'use client'
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type CartButtonProps = {
    quantity: number;
};

const CartButton = ({ quantity }: CartButtonProps) => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/cart');
    }

    return (
        <Button className="relative" variant="ghost" onClick={handleClick}>
            <ShoppingCart size={24} />
            {quantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[12px] font-medium text-white">
          {quantity > 99 ? "99+" : quantity}
        </span>
            )}
        </Button>
    );
};

export default CartButton;
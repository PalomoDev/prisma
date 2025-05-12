// Header.tsx (серверный компонент)
import { auth } from "@/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import Logo from "@/components/shared/logo";
import CartButton from "@/components/shared/layout/header/cart-button";
import { getMyCart } from "@/lib/actions/cart.actions";
import { countCartItems } from "@/lib/utils/count-cart-items";

export default async function Header() {
    // Получаем сессию напрямую на сервере
    const session = await auth();
    const cart = await getMyCart();
    const count = countCartItems(cart?.items);

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-sm">
            <div className="flex items-center">
                <Link href="/">
                    <Logo/>
                </Link>
            </div>
            <nav className="flex items-center space-x-4">
                <CartButton quantity={count}/>



                {/* Используем отдельные клиентские компоненты для кнопок входа/выхода */}

                {session && session.user ? <LogoutButton user={session.user.name} /> : <LoginButton />}
            </nav>
        </header>
    );
}


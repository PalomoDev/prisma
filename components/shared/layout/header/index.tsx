// Header.tsx (серверный компонент)
import { auth } from "@/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

export default async function Header() {
    // Получаем сессию напрямую на сервере
    const session = await auth();

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-sm">
            <div className="flex items-center">
                <h1 className="text-xl font-bold">Мой сайт</h1>
            </div>
            <nav className="flex items-center space-x-4">
                <Link href="/" className="hover:text-blue-500">
                    Главная
                </Link>
                <Link href="/about" className="hover:text-blue-500">
                    О нас
                </Link>

                {/* Используем отдельные клиентские компоненты для кнопок входа/выхода */}
                {session ? <LogoutButton /> : <LoginButton />}
            </nav>
        </header>
    );
}
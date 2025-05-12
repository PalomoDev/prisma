import type { Metadata } from "next";
import React from "react";
import Logo from "@/components/shared/logo";


export const metadata: Metadata = {
    title: "Auth - Create Next App",
    description: "Страница аутентификации",
};

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            {/* Блок для логотипа */}
            <Logo />

            {/* Область для основного содержимого */}
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
                {children}
            </div>
        </div>
    );
}
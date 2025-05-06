import type { Metadata } from "next";
import React from "react";
import Image from "next/image";


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
            <div className="w-full flex items-center justify-center mb-12">
                <div className="flex items-center">
                    <Image
                        src="/logo/logo-round.svg"
                        alt="Логотип"
                        width={60}
                        height={60}
                        priority
                    />
                    <Image
                        src="/logo/logo-name.svg"
                        alt="Название компании"
                        width={250}
                        height={40}
                        className="ml-2"
                        priority
                    />
                </div>
            </div>

            {/* Область для основного содержимого */}
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
                {children}
            </div>
        </div>
    );
}
// LoginButton.tsx (клиентский компонент)
'use client'

import { useRouter } from "next/navigation";

export default function LoginButton() {
    const router = useRouter();

    return (
        <button
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            onClick={() => router.push('/login')}
        >
            Войти
        </button>
    );
}
// LogoutButton.tsx (клиентский компонент)
'use client'

import { useRouter } from "next/navigation";
import { handleSignOut } from "@/lib/actions/auth.actions";

export default function LogoutButton() {
    const router = useRouter();

    const onLogout = async () => {
        const result = await handleSignOut();
        if (result.success) {
            router.refresh();
        }
    };

    return (
        <button
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            onClick={onLogout}
        >
            Выйти
        </button>
    );
}
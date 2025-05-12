// LoginButton.tsx (клиентский компонент)
'use client'

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";

export default function LoginButton() {
    const router = useRouter();

    return (
        <Button asChild
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            onClick={() => router.push('/login')}
        >
            <div>
                <UserIcon/> Login
            </div>
        </Button>
    );
}
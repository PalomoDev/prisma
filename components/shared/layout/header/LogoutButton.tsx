'use client'


import { handleSignOut } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
    user: string | null | undefined;
}


export default function LogoutButton({user}: LogoutButtonProps) {

    const handleLogout = async () => {
        await handleSignOut();
    };

    return (
        <Button
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            onClick={handleLogout}
        >
            {user && `${user} | `}Выйти
        </Button>
    );
}
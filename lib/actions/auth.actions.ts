'use server'

import { signOut } from "@/auth";
import { signIn } from "@/auth"
import { executeAction } from "@/lib/executeAction";

export async function handleSignOut() {
    await signOut();
    return { success: true };
}

export async function handleLogin(prevState: any, formData: FormData) {
    const result = await executeAction({
        actionFn: async () => {
            await signIn('credentials', formData)
        },
        successMessage: "Вы успешно вошли в систему"
    });

    return result;
}
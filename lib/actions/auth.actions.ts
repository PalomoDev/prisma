'use server'

import {signIn, signOut} from "@/auth";
import {executeAction} from "@/lib/executeAction";


export async function handleSignOut() {
    await signOut();
    return { success: true };
}

export async function handleLogin(prevState: any, formData: FormData) {
    return await executeAction({
        actionFn: async () => {
            await signIn('credentials', formData)
        },
        successMessage: "Вы успешно вошли в систему"
    });
}
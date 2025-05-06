'use client'

import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { handleLogin } from "@/lib/actions/auth.actions";

// Компонент кнопки отправки
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className={`w-full py-2 px-4 rounded text-white transition-colors ${
                pending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            type="submit"
            disabled={pending}
        >
            {pending ? 'Вход...' : 'Войти'}
        </button>
    );
}

export default function LoginForm() {
    const [state, formAction] = useActionState(handleLogin, {
        success: false,
        message: ""
    });

    return (
        <>
            <form className="mt-8 space-y-6" action={formAction}>
                <div className="space-y-4 rounded-md shadow-sm">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Пароль
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <SubmitButton />

                {state.message && (
                    <div className={`mt-4 text-center ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                        {state.message}
                    </div>
                )}
            </form>
        </>
    );
}
"use server"

import { prisma } from "@/db/prisma"
import { compare } from "@/lib/encrypt";

export async function loginWithCredentials(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log(email, password)

    try {
        // Ищем пользователя в базе данных по email
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        // Если пользователь не найден
        if (!user) {
            return {
                success: false,
                message: "Пользователь с таким email не найден",
                user: {}
            }
        }

        // Проверяем пароль (предполагается, что у вас есть функция compare)
        const isPasswordValid = await compare(password, user.password as string)

        if (!isPasswordValid) {
            return {
                success: false,
                message: "Неверный пароль",
                user: {}
            }
        }

        // Если всё хорошо, возвращаем успешный результат
        return {
            success: true,
            message: "Вход выполнен успешно",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    } catch (error) {
        console.error("Ошибка при входе:", error)

        // Возвращаем общую ошибку
        return {
            success: false,
            message: "Произошла ошибка при попытке входа"
        }
    }
}
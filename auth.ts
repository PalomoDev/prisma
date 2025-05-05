/**
 * Конфигурация NextAuth для аутентификации пользователей в Next.js приложении.
 * @file Настраивает аутентификацию с использованием Prisma как адаптера и
 * Credentials Provider для входа по email/password.
 * @module auth/config
 */

import NextAuth from "next-auth"
import { PrismaAdapter} from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import Credentials from "next-auth/providers/credentials"
import { compare } from "@/lib/encrypt"
import type { NextAuthConfig } from "next-auth";

/**
 * Основная конфигурация NextAuth
 * @type {NextAuthConfig}
 */
export const config = {
    // Настройка путей для страниц аутентификации
    pages: {
        signIn: '/sign-in', // Путь к странице входа
        error: '/sign-in',  // Путь для отображения ошибок аутентификации
    },

    // Настройка сессии
    session: {
        strategy: 'jwt', // Использование JWT для хранения сессии
        maxAge: 30 * 24 * 60 * 60, // Время жизни сессии - 30 дней в секундах
    },

    // Адаптер для работы с базой данных через Prisma
    // Приведение типа к any используется для обхода несоответствия типов
    adapter: PrismaAdapter(prisma as any),

    // Настройка провайдеров аутентификации
    providers: [
        Credentials ({
            // Определение полей формы входа
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            /**
             * Метод авторизации пользователя по email и паролю
             * @param {Object} credentials - Учетные данные пользователя
             * @returns {Promise<Object|null>} - Данные пользователя или null при неудаче
             */
            async authorize(credentials) {
                // Ранний возврат, если credentials отсутствуют
                if (credentials == null) return null

                // Поиск пользователя в базе данных по email
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string,
                    }
                })

                // Проверка пароля, если пользователь найден
                if (user && user.password) {
                    // Сравнение хеша пароля с введенным значением
                    const isMatch = await compare(credentials.password as string, user.password)
                    if (isMatch) {
                        // Возвращаем объект пользователя с нужными полями
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    }
                }

                // Возвращаем null если пользователь не найден или пароль неверный
                return null
            }
        })
    ],

    // Обработчики событий авторизации
    callbacks: {
        /**
         * Функция для настройки содержимого сессии пользователя
         * @param {Object} session - Текущая сессия
         * @param {Object} user - Данные пользователя
         * @param {String} trigger - Тип события
         * @param {Object} token - JWT токен
         * @returns {Object} - Обновленная сессия
         */
        async session({ session, user, trigger, token }: any) {
            // Добавляем ID пользователя в объект сессии из токена
            session.user.id = token.sub;

            // Обновляем имя пользователя при событии 'update'
            if (trigger === 'update') {
                session.user.name = user.name;
            }
            return session
        }
    }
} satisfies NextAuthConfig

/**
 * Экспорт функций NextAuth для использования в приложении
 * @property {Object} handlers - HTTP обработчики для API маршрутов
 * @property {Function} signIn - Функция для программного входа пользователя
 * @property {Function} signOut - Функция для программного выхода пользователя
 * @property {Function} auth - Функция для проверки аутентификации
 */
export const { handlers, signIn, signOut, auth } = NextAuth(config)
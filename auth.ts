import NextAuth from "next-auth"
import Credentials from "@auth/core/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { compare } from "@/lib/encrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const adapter = PrismaAdapter(prisma as any)

/**
 * Конфигурация NextAuth для аутентификации пользователей
 * Использует JWT стратегию и Credentials провайдер для входа по email/паролю
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "<EMAIL>" },
                password: { label: "Password", type: "password" }
            },
            /**
             * Функция авторизации пользователя
             * Проверяет учетные данные и возвращает объект пользователя при успешной аутентификации
             * @param credentials - Учетные данные пользователя (email и пароль)
             * @returns Объект пользователя или null при неудачной авторизации
             */
            async authorize(credentials) {
                // Проверка наличия обязательных полей
                if (!credentials?.email || !credentials?.password) {
                    console.log('❌ Авторизация: отсутствуют email или пароль');
                    return null;
                }

                try {
                    console.log('🔍 Начало процесса авторизации для:', credentials.email);

                    // Поиск пользователя в базе данных
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email as string
                        }
                    });

                    if (!user) {
                        console.log(`❌ Пользователь не найден: ${credentials.email}`);
                        return null;
                    }

                    console.log('✅ Пользователь найден:', {
                        id: user.id,
                        email: user.email,
                        hasPassword: !!user.password
                    });

                    // Проверка наличия пароля у пользователя
                    if (!user.password) {
                        console.log('❌ У пользователя отсутствует пароль (возможно, использует OAuth)');
                        return null;
                    }

                    // === ПРОЦЕСС СРАВНЕНИЯ ПАРОЛЕЙ ===
                    console.log('🔐 === НАЧАЛО СРАВНЕНИЯ ПАРОЛЕЙ ===');
                    console.log('📝 Длина хеша в БД:', user.password.length);
                    console.log('📝 Первые 10 символов хеша:', user.password.substring(0, 10) + '...');

                    const startTime = Date.now();
                    const isPasswordValid = await compare(
                        credentials.password as string,
                        user.password as string
                    );
                    const compareTime = Date.now() - startTime;

                    console.log('⏱️ Время сравнения паролей:', compareTime, 'мс');
                    console.log('🔐 Результат сравнения:', isPasswordValid ? '✅ УСПЕХ' : '❌ НЕУДАЧА');
                    console.log('🔐 === КОНЕЦ СРАВНЕНИЯ ПАРОЛЕЙ ===');

                    if (!isPasswordValid) {
                        console.log("❌ Неверный пароль для пользователя:", credentials.email);
                        return null;
                    }

                    console.log('✅ === АВТОРИЗАЦИЯ УСПЕШНА ===');
                    console.log('👤 Возвращаемый объект пользователя:', {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    });

                    // Возвращаем только необходимые поля пользователя (без пароля!)
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    };
                } catch (error) {
                    console.error("❌ Критическая ошибка при авторизации:", error);
                    return null;
                }
            }
        })
    ],

    /**
     * Настройки сессии
     * Используется JWT стратегия с временем жизни 30 дней
     */
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 дней
    },

    /**
     * Кастомные страницы для аутентификации
     */
    pages: {
        signIn: '/login',
        error: '/login',
    },

    /**
     * Режим отладки - включен только в development окружении
     */
    debug: process.env.NODE_ENV === "development",

    callbacks: {
        /**
         * Callback для обработки сессии
         * Добавляет дополнительные поля из токена в объект сессии
         * @param session - Текущая сессия
         * @param user - Объект пользователя
         * @param trigger - Триггер обновления
         * @param token - JWT токен
         * @returns Модифицированный объект сессии
         */
        async session({ session, user, trigger, token }: any) {
            console.log('🔄 === SESSION CALLBACK ===');
            console.log('📦 Token данные:', {
                sub: token.sub,
                name: token.name,
                role: token.role
            });

            // Добавляем данные из токена в сессию
            session.user.id = token.sub;
            session.user.name = token.name;
            session.user.role = token.role;

            console.log('✅ Сессия обновлена:', {
                userId: session.user.id,
                userName: session.user.name,
                userRole: session.user.role
            });

            // Обработка обновления имени пользователя
            if (trigger === 'update') {
                session.user.name = user.name;
                console.log('🔄 Имя пользователя обновлено:', user.name);
            }

            return session;
        },

        /**
         * JWT Callback
         * Обрабатывает JWT токен при входе и обновлениях
         * Также синхронизирует корзину при входе в систему
         * @param token - JWT токен
         * @param user - Объект пользователя (при первом входе)
         * @param trigger - Триггер события
         * @param session - Данные сессии (при обновлении)
         * @returns Модифицированный токен
         */
        async jwt({ token, user, trigger, session }: any) {
            console.log('🎫 === JWT CALLBACK ===');

            // При первом входе добавляем данные пользователя в токен
            if(user) {
                console.log('👤 Новый вход пользователя:', {
                    id: user.id,
                    email: user.email,
                    role: user.role
                });

                token.id = user.id;
                token.role = user.role;

                // Синхронизация корзины при входе
                if (trigger === 'signIn' || trigger === 'signUp') {
                    console.log('🛒 Синхронизация корзины...');

                    const cookiesObject = await cookies();
                    const sessionCartId = cookiesObject.get('sessionCartId')?.value;

                    if (sessionCartId) {
                        const sessionCart = await prisma.cart.findFirst({
                            where: {sessionCartId},
                        });

                        if (sessionCart) {
                            console.log('🛒 Найдена сессионная корзина:', sessionCart.id);

                            // Удаляем старую корзину пользователя
                            const deletedCarts = await prisma.cart.deleteMany({
                                where: {userId: user.id},
                            });
                            console.log('🗑️ Удалено старых корзин:', deletedCarts.count);

                            // Привязываем сессионную корзину к пользователю
                            await prisma.cart.update({
                                where: {id: sessionCart.id},
                                data: {userId: user.id},
                            });
                            console.log('✅ Корзина привязана к пользователю');
                        }
                    }
                }

                // Обновление имени при триггере update
                if (session?.user.name && trigger === 'update') {
                    token.name = session.user.name;
                    console.log('🔄 Имя в токене обновлено:', session.user.name);
                }
            }

            console.log('🎫 Финальный токен:', {
                sub: token.sub,
                name: token.name,
                role: token.role
            });

            return token;
        },
    },
});


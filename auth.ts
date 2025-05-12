import NextAuth from "next-auth"
import Credentials from "@auth/core/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { compare } from "@/lib/encrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const adapter = PrismaAdapter(prisma as any)

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "<EMAIL>" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email as string
                        }
                    });

                    if (!user) {
                        console.log(`Пользователь не найден: ${credentials.email}`);
                        return null;
                    }

                    const isPasswordValid = await compare(credentials.password as string, user.password as string);

                    if (!isPasswordValid) {
                        console.log("Неверный пароль");
                        return null;
                    }

                    // Возвращаем только базовые поля пользователя
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role // Поле role не будет доступно в сессии без callbacks
                    };
                } catch (error) {
                    console.error("Ошибка при авторизации:", error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 дней
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    debug: process.env.NODE_ENV === "development",

    callbacks: {
        async session({ session, user, trigger, token }: any) {


            // Set the user ID from the token
            session.user.id = token.sub;
            session.user.name = token.name;
            session.user.role = token.role;

            // If there is an update, set the user name
            if (trigger === 'update') {
                session.user.name = user.name;
            }

            return session;
        },

        async jwt({ token, user, trigger, session }: any) {
            if(user) {

                token.role = user.role;
            }

            return token;
        },





    },


});
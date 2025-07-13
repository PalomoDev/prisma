import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const authConfig = {
  providers: [],
  callbacks: {
    async authorized({ request, auth }: any) {
      const { pathname } = request.nextUrl;

      // Для админских путей получаем токен напрямую
      if (pathname.startsWith('/admin')) {
        const token = await getToken({
          req: request,
          secret: process.env.AUTH_SECRET
        });

        console.log('Admin check - Token:', token);

        if (!token) return false; // Не залогинен
        if (token.role !== 'admin') return false; // Не админ
      }

      // Остальные защищенные пути
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
      ];

      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // Сессионная корзина
      if (!request.cookies.get('sessionCartId')) {
        const sessionCartId = crypto.randomUUID();
        const response = NextResponse.next();
        response.cookies.set('sessionCartId', sessionCartId);
        return response;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
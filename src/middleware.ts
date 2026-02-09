import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect admin routes (except login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const session = request.cookies.get('admin_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Skip i18n for admin and API routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/', '/(zh|en|ms)/:path*', '/((?!_next|.*\\..*).*)']
};

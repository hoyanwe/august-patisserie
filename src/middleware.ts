import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, getSessionSecret, verifySession } from './lib/session';

const intlMiddleware = createMiddleware(routing);

// Security headers applied to every document/response the middleware handles.
// CSP is intentionally permissive for inline styles/scripts (the app relies on
// them heavily) but still locks down framing, base-uri, objects and mixed content.
function applySecurityHeaders(res: NextResponse): NextResponse {
    const csp = [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "img-src 'self' data: https://www.google.com https://*.googleusercontent.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "script-src 'self' 'unsafe-inline'",
        "connect-src 'self'",
        "form-action 'self' https://accounts.google.com",
        "frame-src https://accounts.google.com",
    ].join('; ');
    res.headers.set('Content-Security-Policy', csp);
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return res;
}

export default async function middleware(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;

    // Protect admin pages (except login). API routes enforce auth themselves.
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const secret = getSessionSecret();
        const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
        const ok = secret ? await verifySession(secret, token) : false;
        if (!ok) {
            return applySecurityHeaders(
                NextResponse.redirect(new URL('/admin/login', request.url)),
            );
        }
    }

    // Skip i18n for admin and API routes.
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
        return applySecurityHeaders(NextResponse.next());
    }

    return applySecurityHeaders(intlMiddleware(request) as NextResponse);
}

export const config = {
    // Only the locales that actually exist in routing (en, zh).
    matcher: ['/', '/(zh|en)/:path*', '/((?!_next|.*\\..*).*)'],
};

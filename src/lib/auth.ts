import { cookies } from 'next/headers';
import {
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_MAX_AGE,
    getSessionSecret,
    signSession,
    verifySession,
} from './session';

const encoder = new TextEncoder();

// Constant-time string comparison for the admin password.
function safeEqual(a: string, b: string): boolean {
    const ab = encoder.encode(a);
    const bb = encoder.encode(b);
    // Compare against a fixed length to avoid leaking length via early return.
    const len = Math.max(ab.length, bb.length);
    let diff = ab.length ^ bb.length;
    for (let i = 0; i < len; i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
    return diff === 0;
}

export async function checkAuth(): Promise<boolean> {
    const secret = getSessionSecret();
    if (!secret) return false; // fail closed when no signing secret is configured
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    return verifySession(secret, session?.value);
}

export async function login(password: string): Promise<boolean> {
    const expected = process.env.ADMIN_PASSWORD;
    const secret = getSessionSecret();
    // Fail closed: without a configured password or signing secret, no login succeeds.
    if (!expected || !secret) return false;
    if (!safeEqual(password, expected)) return false;

    const token = await signSession(secret, ADMIN_SESSION_MAX_AGE);
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: ADMIN_SESSION_MAX_AGE,
    });
    return true;
}

export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_COOKIE);
}

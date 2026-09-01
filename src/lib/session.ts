// Signed admin-session tokens, usable from both Node route handlers and the
// edge middleware. The token is a stateless HMAC: `payload.signature`, where
// payload is base64url(JSON{exp}) and signature is base64url(HMAC-SHA256).
// Verification recomputes the HMAC and compares in constant time, so a forged
// cookie value can no longer pass as authenticated.

const encoder = new TextEncoder();

function base64urlEncode(bytes: Uint8Array): string {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(str: string): Uint8Array {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
    const bin = atob(b64 + pad);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}

// Constant-time comparison of two byte arrays.
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
}

async function importKey(secret: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify'],
    );
}

/** Mint a signed session token valid for `maxAgeSeconds` from now. */
export async function signSession(secret: string, maxAgeSeconds: number): Promise<string> {
    const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
    const payload = base64urlEncode(encoder.encode(JSON.stringify({ exp })));
    const key = await importKey(secret);
    const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
    return `${payload}.${base64urlEncode(sig)}`;
}

/** Verify a signed session token; returns true only for an intact, unexpired token. */
export async function verifySession(secret: string, token: string | undefined): Promise<boolean> {
    if (!secret || !token) return false;
    const dot = token.indexOf('.');
    if (dot <= 0) return false;
    const payload = token.slice(0, dot);
    const providedSig = token.slice(dot + 1);
    try {
        const key = await importKey(secret);
        const expected = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
        const provided = base64urlDecode(providedSig);
        if (!timingSafeEqual(expected, provided)) return false;
        const data = JSON.parse(new TextDecoder().decode(base64urlDecode(payload))) as { exp?: number };
        if (typeof data.exp !== 'number') return false;
        return data.exp > Math.floor(Date.now() / 1000);
    } catch {
        return false;
    }
}

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * The secret used to sign admin sessions. Prefer a dedicated secret, fall back
 * to the always-present NEXTAUTH_SECRET. Returns undefined when neither is set,
 * so callers can fail closed.
 */
export function getSessionSecret(): string | undefined {
    return process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || undefined;
}

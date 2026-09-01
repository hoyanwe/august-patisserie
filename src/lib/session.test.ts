import { describe, it, expect } from 'vitest';
import { signSession, verifySession } from './session';

const SECRET = 'test-secret-value-please-change';

describe('signed admin session', () => {
    it('accepts a freshly minted, unexpired token', async () => {
        const token = await signSession(SECRET, 3600);
        expect(await verifySession(SECRET, token)).toBe(true);
    });

    it('rejects the legacy forgeable constant', async () => {
        // The old vulnerability: cookie value === 'authenticated'.
        expect(await verifySession(SECRET, 'authenticated')).toBe(false);
    });

    it('rejects a tampered signature', async () => {
        const token = await signSession(SECRET, 3600);
        const tampered = token.slice(0, -2) + (token.endsWith('a') ? 'bb' : 'aa');
        expect(await verifySession(SECRET, tampered)).toBe(false);
    });

    it('rejects a token signed with a different secret', async () => {
        const token = await signSession('other-secret', 3600);
        expect(await verifySession(SECRET, token)).toBe(false);
    });

    it('rejects an expired token', async () => {
        const token = await signSession(SECRET, -1);
        expect(await verifySession(SECRET, token)).toBe(false);
    });

    it('rejects empty / malformed input', async () => {
        expect(await verifySession(SECRET, undefined)).toBe(false);
        expect(await verifySession(SECRET, '')).toBe(false);
        expect(await verifySession(SECRET, 'no-dot')).toBe(false);
        expect(await verifySession('', await signSession(SECRET, 3600))).toBe(false);
    });
});

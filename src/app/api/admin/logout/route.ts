import { NextResponse } from 'next/server';
import { checkAuth, logout } from '@/lib/auth';


export async function POST() {
    // Only an authenticated session can log itself out. Combined with the
    // sameSite=strict session cookie, this closes the CSRF-logout vector.
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await logout();
    return NextResponse.json({ success: true });
}

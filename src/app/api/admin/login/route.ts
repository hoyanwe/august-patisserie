import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';


export async function POST(request: Request) {
    try {
        const { password } = await request.json() as { password: string };

        const success = await login(password);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}

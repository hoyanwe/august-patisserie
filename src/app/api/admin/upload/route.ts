import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { uploadToR2 } from '@/lib/storage';

export const runtime = 'edge';

export async function POST(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const ext = file.name.split('.').pop();
        const filename = `${Date.now()}.${ext}`;

        // Upload to R2
        const url = await uploadToR2(buffer, filename, file.type);

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

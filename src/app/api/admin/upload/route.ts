import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { uploadToR2 } from '@/lib/storage';


// Server-controlled allowlist. SVG is intentionally excluded (stored-XSS risk).
const ALLOWED: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
};
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const ext = ALLOWED[file.type];
        if (!ext) {
            return NextResponse.json(
                { error: 'Unsupported file type. Allowed: PNG, JPEG, WebP, GIF, AVIF.' },
                { status: 415 },
            );
        }

        if (file.size > MAX_BYTES) {
            return NextResponse.json(
                { error: `File too large (max ${MAX_BYTES / (1024 * 1024)} MB).` },
                { status: 413 },
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Filename is derived server-side (timestamp + allowlisted extension) —
        // the client cannot influence the R2 key or content-type.
        const filename = `${Date.now()}.${ext}`;
        const url = await uploadToR2(buffer, filename, file.type);

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

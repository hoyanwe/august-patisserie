import { getBucket } from '@/lib/storage';

// Serves user-uploaded images out of R2. The BUCKET binding is shared with the
// OpenNext incremental cache, so we only serve keys that match the upload
// naming scheme (<timestamp>.<ext>) — this blocks path traversal and prevents
// anyone from reading arbitrary ISR cache objects through this route.
const ALLOWED_KEY = /^[0-9]+\.[a-z0-9]+$/i;

const CONTENT_TYPES: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    avif: 'image/avif',
    svg: 'image/svg+xml',
};

export async function GET(
    _request: Request,
    context: { params: Promise<{ filename: string }> },
) {
    const { filename } = await context.params;

    if (!filename || !ALLOWED_KEY.test(filename)) {
        return new Response('Not found', { status: 404 });
    }

    try {
        const bucket = getBucket();
        if (!bucket) {
            return new Response('Storage unavailable', { status: 503 });
        }

        const object = await bucket.get(filename);
        if (!object) {
            return new Response('Not found', { status: 404 });
        }

        const ext = filename.split('.').pop()?.toLowerCase() ?? '';
        // Never trust the stored content-type for rendering; derive it from the
        // extension against an allowlist. SVG is served as a download to avoid
        // stored-XSS from a malicious upload.
        const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream';
        const disposition = ext === 'svg' ? 'attachment' : 'inline';

        return new Response(object.body, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': disposition,
                'X-Content-Type-Options': 'nosniff',
                // Uploads are timestamp-named and never mutated → safe to cache hard.
                'Cache-Control': 'public, max-age=31536000, immutable',
                ...(object.httpEtag ? { ETag: object.httpEtag } : {}),
            },
        });
    } catch (error) {
        console.error('Image serve error:', error);
        return new Response('Error', { status: 500 });
    }
}

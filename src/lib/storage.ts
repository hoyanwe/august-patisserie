import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getBucket(): R2Bucket | undefined {
    try {
        const context = getCloudflareContext();
        if (context?.env?.BUCKET) {
            return context.env.BUCKET;
        }
    } catch {
        console.warn('Bucket context not found');
    }
    return undefined;
}

export async function uploadToR2(file: File | Buffer, filename: string, contentType: string) {
    const bucket = getBucket();
    if (!bucket) {
        throw new Error('R2 Bucket not available');
    }

    await bucket.put(filename, file, {
        httpMetadata: { contentType }
    });

    // Served back through /api/images/[filename] (see that route handler).
    return `/api/images/${filename}`;
}

export async function deleteFromR2(filename: string) {
    const bucket = getBucket();
    if (!bucket) {
        throw new Error('R2 Bucket not available');
    }
    await bucket.delete(filename);
}

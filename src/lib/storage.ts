import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getBucket() {
    try {
        const context = getCloudflareContext();
        if (context?.env?.BUCKET) {
            return context.env.BUCKET;
        }
    } catch (e) {
        console.warn('Bucket context not found');
    }
    return (process.env as any).BUCKET as R2Bucket;
}

export async function uploadToR2(file: File | Buffer, filename: string, contentType: string) {
    const bucket = getBucket();
    if (!bucket) {
        throw new Error('R2 Bucket not available');
    }

    await bucket.put(filename, file, {
        httpMetadata: { contentType }
    });

    // In production, you would typically return a public URL or a path to your proxy route
    return `/api/images/${filename}`;
}

export async function deleteFromR2(filename: string) {
    const bucket = getBucket();
    if (!bucket) {
        throw new Error('R2 Bucket not available');
    }
    await bucket.delete(filename);
}

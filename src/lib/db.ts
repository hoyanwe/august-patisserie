import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
}

export function getDb() {
    try {
        const context = getCloudflareContext();
        if (context?.env?.DB) {
            return context.env.DB;
        }
    } catch (e) {
        // Fallback for local development if not in request context
        console.warn('DB context not found, attempting fallback or returning null');
    }

    // In a real OpenNext setup, the DB is available via the request context.
    // For local dev without wrangler, this might need a different approach (e.g. better-sqlite3)
    // but for now we assume we're running in a CF-compatible environment.
    return (process.env as any).DB as D1Database;
}

export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
    const db = getDb();
    if (!db) {
        throw new Error('Database connection not available');
    }
    const { results } = await db.prepare(sql).bind(...params).all<T>();
    return results;
}

export async function execute(sql: string, params: any[] = []): Promise<D1Response> {
    const db = getDb();
    if (!db) {
        throw new Error('Database connection not available');
    }
    return await db.prepare(sql).bind(...params).run();
}

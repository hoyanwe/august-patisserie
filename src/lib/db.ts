import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
}

export function getDb(): D1Database | undefined {
    try {
        const context = getCloudflareContext();
        if (context?.env?.DB) {
            return context.env.DB;
        }
    } catch {
        console.warn('DB context not found');
    }
    return undefined;
}

export async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const db = getDb();
    if (!db) {
        throw new Error('Database connection not available');
    }
    const { results } = await db.prepare(sql).bind(...params).all<T>();
    return results;
}

export async function execute(sql: string, params: unknown[] = []): Promise<D1Response> {
    const db = getDb();
    if (!db) {
        throw new Error('Database connection not available');
    }
    return await db.prepare(sql).bind(...params).run();
}

/**
 * Run several statements atomically. D1 wraps a `batch()` in a single implicit
 * transaction that rolls back as a unit, so a mid-sequence failure can no longer
 * leave a table half-written (e.g. DELETE committed but re-INSERT failed).
 * `statements` receives the live D1Database so callers can build prepared+bound
 * statements.
 */
export async function batch(
    build: (db: D1Database) => D1PreparedStatement[],
): Promise<D1Result[]> {
    const db = getDb();
    if (!db) {
        throw new Error('Database connection not available');
    }
    return db.batch(build(db));
}

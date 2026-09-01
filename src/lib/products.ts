import { query } from './db';

export interface Product {
    id: string;
    name: { en: string; zh: string };
    price: number;
    category: string;
    description: { en: string; zh: string };
    isBestSeller: boolean;
    image: string;
    images: string[];
}

export interface ProductRow {
    id: string;
    name_en: string;
    name_zh: string;
    price: number;
    category_id: string;
    description_en: string;
    description_zh: string;
    is_best_seller: number;
    main_image: string;
    images_list?: string | null;
}

// '||' separator instead of ',' so a comma in an image URL can never split one
// image into two. The inner ordered subquery guarantees gallery order follows
// product_images.sort_order regardless of the SQLite GROUP_CONCAT dialect.
const IMAGES_SUBQUERY =
    "(SELECT group_concat(url, '||') FROM (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order)) AS images_list";

const IMAGE_SEP = '||';

/** Single source of truth for turning a DB row into the app's Product shape. */
export function mapProductRow(row: ProductRow): Product {
    return {
        id: row.id,
        name: { en: row.name_en, zh: row.name_zh },
        price: row.price,
        category: row.category_id,
        description: { en: row.description_en, zh: row.description_zh },
        isBestSeller: row.is_best_seller === 1,
        image: row.main_image,
        images: row.images_list ? row.images_list.split(IMAGE_SEP) : [],
    };
}

export async function getAllProducts(): Promise<Product[]> {
    const rows = await query<ProductRow>(
        `SELECT p.*, ${IMAGES_SUBQUERY} FROM products p ORDER BY p.id DESC`,
    );
    return rows.map(mapProductRow);
}

export async function getBestSellers(): Promise<Product[]> {
    const rows = await query<ProductRow>(
        `SELECT p.*, ${IMAGES_SUBQUERY} FROM products p WHERE p.is_best_seller = 1 ORDER BY p.id DESC`,
    );
    return rows.map(mapProductRow);
}

export async function getProductById(id: string): Promise<Product | null> {
    const rows = await query<ProductRow>(
        `SELECT p.*, ${IMAGES_SUBQUERY} FROM products p WHERE p.id = ?`,
        [id],
    );
    return rows.length ? mapProductRow(rows[0]) : null;
}

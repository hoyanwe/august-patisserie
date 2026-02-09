import fs from 'fs/promises';
import path from 'path';

async function migrate() {
    console.log('Starting migration from JSON to SQL transactions...');

    const dataDir = path.join(process.cwd(), 'src/content/data');
    const sqlFile = path.join(process.cwd(), 'migrations/0002_seed_data.sql');

    let sql = '-- Seed data from local JSON files\n\n';

    // 1. Home Content
    try {
        const homeData = await fs.readFile(path.join(dataDir, 'home.json'), 'utf8');
        sql += `INSERT INTO home_content (id, data) VALUES ('main', '${homeData.replace(/'/g, "''")}') ON CONFLICT(id) DO UPDATE SET data = excluded.data;\n\n`;
    } catch (e) { console.warn('home.json not found'); }

    // 2. Categories
    try {
        const categoriesData = JSON.parse(await fs.readFile(path.join(dataDir, 'categories.json'), 'utf8'));
        const categories = categoriesData.categories || categoriesData;
        for (const cat of categories) {
            sql += `INSERT INTO categories (id, name_en, name_zh) VALUES ('${cat.id}', '${cat.name.en.replace(/'/g, "''")}', '${cat.name.zh.replace(/'/g, "''")}') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh;\n`;
        }
        sql += '\n';
    } catch (e) { console.warn('categories.json not found'); }

    // 3. Products
    try {
        const productsData = JSON.parse(await fs.readFile(path.join(dataDir, 'products.json'), 'utf8'));
        const products = productsData.products || productsData;
        for (const p of products) {
            sql += `INSERT INTO products (id, name_en, name_zh, price, category_id, description_en, description_zh, is_best_seller, main_image) VALUES ('${p.id}', '${p.name.en.replace(/'/g, "''")}', '${p.name.zh.replace(/'/g, "''")}', ${p.price}, '${p.category}', '${p.description.en.replace(/'/g, "''")}', '${p.description.zh.replace(/'/g, "''")}', ${p.isBestSeller ? 1 : 0}, '${p.image}') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh, price = excluded.price, category_id = excluded.category_id, description_en = excluded.description_en, description_zh = excluded.description_zh, is_best_seller = excluded.is_best_seller, main_image = excluded.main_image;\n`;

            // Product Images
            if (p.images && p.images.length > 0) {
                sql += `DELETE FROM product_images WHERE product_id = '${p.id}';\n`;
                for (let i = 0; i < p.images.length; i++) {
                    sql += `INSERT INTO product_images (product_id, url, sort_order) VALUES ('${p.id}', '${p.images[i]}', ${i});\n`;
                }
            }
        }
        sql += '\n';
    } catch (e) { console.warn('products.json not found'); }

    // 4. Announcements
    try {
        const annData = JSON.parse(await fs.readFile(path.join(dataDir, 'announcements.json'), 'utf8'));
        for (const ann of annData) {
            sql += `INSERT INTO announcements (id, text_en, text_zh, active) VALUES ('${ann.id}', '${ann.text.en.replace(/'/g, "''")}', '${ann.text.zh.replace(/'/g, "''")}', ${ann.active ? 1 : 0}) ON CONFLICT(id) DO UPDATE SET text_en = excluded.text_en, text_zh = excluded.text_zh, active = excluded.active;\n`;
        }
        sql += '\n';
    } catch (e) { console.warn('announcements.json not found'); }

    // 5. Ingredients
    try {
        const ingData = JSON.parse(await fs.readFile(path.join(dataDir, 'ingredients.json'), 'utf8'));
        for (const ing of ingData) {
            sql += `INSERT INTO ingredients (id, name_en, name_zh, description_en, description_zh, image) VALUES ('${ing.id}', '${ing.name.en.replace(/'/g, "''")}', '${ing.name.zh.replace(/'/g, "''")}', '${ing.description.en.replace(/'/g, "''")}', '${ing.description.zh.replace(/'/g, "''")}', '${ing.image}') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh, description_en = excluded.description_en, description_zh = excluded.description_zh, image = excluded.image;\n`;
        }
        sql += '\n';
    } catch (e) { console.warn('ingredients.json not found'); }

    // 6. Story
    try {
        const storyData = await fs.readFile(path.join(dataDir, 'story.json'), 'utf8');
        sql += `INSERT INTO site_settings (key, value) VALUES ('story', '${storyData.replace(/'/g, "''")}') ON CONFLICT(key) DO UPDATE SET value = excluded.value;\n\n`;
    } catch (e) { console.warn('story.json not found'); }

    // 7. Instagram
    try {
        const instaData = await fs.readFile(path.join(process.cwd(), 'src/content/instagram.json'), 'utf8');
        sql += `INSERT INTO site_settings (key, value) VALUES ('instagram', '${instaData.replace(/'/g, "''")}') ON CONFLICT(key) DO UPDATE SET value = excluded.value;\n\n`;
    } catch (e) { console.warn('instagram.json not found'); }

    // 8. Contact
    try {
        const contactData = await fs.readFile(path.join(dataDir, 'contact.json'), 'utf8');
        sql += `INSERT INTO site_settings (key, value) VALUES ('contact', '${contactData.replace(/'/g, "''")}') ON CONFLICT(key) DO UPDATE SET value = excluded.value;\n\n`;
    } catch (e) { console.warn('contact.json not found'); }

    await fs.writeFile(sqlFile, sql);
    console.log(`Generated seed SQL at ${sqlFile}`);
}

migrate().catch(console.error);

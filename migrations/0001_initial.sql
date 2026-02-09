-- Initial Schema for August Patisserie

-- Site settings for global data like contact info and general config
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT -- JSON blob
);

-- Home page content (Hero text, images, etc.)
CREATE TABLE IF NOT EXISTS home_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    data TEXT -- Full JSON blob of home.json
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    text_en TEXT,
    text_zh TEXT,
    active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0
);

-- Ingredients Spotlight
CREATE TABLE IF NOT EXISTS ingredients (
    id TEXT PRIMARY KEY,
    name_en TEXT,
    name_zh TEXT,
    description_en TEXT,
    description_zh TEXT,
    image TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Product Categories
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name_en TEXT,
    name_zh TEXT
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name_en TEXT,
    name_zh TEXT,
    price REAL,
    category_id TEXT,
    description_en TEXT,
    description_zh TEXT,
    is_best_seller BOOLEAN DEFAULT 0,
    main_image TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Product Multiple Images
CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT,
    url TEXT,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Customer Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    user_name TEXT,
    user_email TEXT,
    rating INTEGER,
    comment TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

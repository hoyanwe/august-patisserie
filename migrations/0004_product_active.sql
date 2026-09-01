-- Active/inactive flag so out-of-stock products can be hidden from the storefront
-- without deleting them. Existing products default to active.
ALTER TABLE products ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

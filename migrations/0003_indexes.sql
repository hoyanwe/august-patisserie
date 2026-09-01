-- Indexes for the hot-path queries. The initial schema declared none, so every
-- product/category/review lookup was a full table scan.

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort ON product_images(product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_best_seller ON products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_reviews_status_created ON reviews(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_sort ON announcements(sort_order);
CREATE INDEX IF NOT EXISTS idx_ingredients_sort ON ingredients(sort_order);

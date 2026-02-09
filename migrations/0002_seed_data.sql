-- Seed data from local JSON files

INSERT INTO home_content (id, data) VALUES ('main', '{
  "hero": {
    "en": {
      "title": "August Patisserie",
      "subtitle": "Crafted with Love",
      "buttonText": "Browse Menu"
    },
    "zh": {
      "title": "August Patisserie",
      "subtitle": "用心制作",
      "buttonText": "浏览菜单"
    }
  },
  "heroImage": "/images/hero-kitchen.png"
}') ON CONFLICT(id) DO UPDATE SET data = excluded.data;

INSERT INTO categories (id, name_en, name_zh) VALUES ('cakes', 'Cakes', '蛋糕') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh;
INSERT INTO categories (id, name_en, name_zh) VALUES ('pastries', 'Pastries', '点心') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh;
INSERT INTO categories (id, name_en, name_zh) VALUES ('breads', 'Breads', '面包') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh;
INSERT INTO categories (id, name_en, name_zh) VALUES ('cookies', 'Cookies', '饼干') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh;

INSERT INTO products (id, name_en, name_zh, price, category_id, description_en, description_zh, is_best_seller, main_image) VALUES ('1768406657308', 'MALTED DARK CHOCOLATE CUBE', '麦芽黑巧克力方块', 35, 'cookies', 'Rich cocoa, malty aroma & 70% Dark chocolate, whole grains crunch.', '浓郁可可，麦芽香气与70%黑巧克力，全谷物脆口。', 1, '/images/products/1768406638961.jpg') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh, price = excluded.price, category_id = excluded.category_id, description_en = excluded.description_en, description_zh = excluded.description_zh, is_best_seller = excluded.is_best_seller, main_image = excluded.main_image;
DELETE FROM product_images WHERE product_id = '1768406657308';
INSERT INTO product_images (product_id, url, sort_order) VALUES ('1768406657308', '/images/products/1768406638961.jpg', 0);
INSERT INTO product_images (product_id, url, sort_order) VALUES ('1768406657308', '/images/products/1768462385238.png', 1);
INSERT INTO product_images (product_id, url, sort_order) VALUES ('1768406657308', '/images/products/1768462388618.png', 2);

INSERT INTO announcements (id, text_en, text_zh, active) VALUES ('1', 'Free Delivery for orders above RM150', '订单满 RM150 即可享受免费送货', 1) ON CONFLICT(id) DO UPDATE SET text_en = excluded.text_en, text_zh = excluded.text_zh, active = excluded.active;
INSERT INTO announcements (id, text_en, text_zh, active) VALUES ('2', 'Pre-order now for Chinese New Year!', '现在就开始预订农历新年礼品！', 1) ON CONFLICT(id) DO UPDATE SET text_en = excluded.text_en, text_zh = excluded.text_zh, active = excluded.active;

INSERT INTO ingredients (id, name_en, name_zh, description_en, description_zh, image) VALUES ('1', 'Premium French Butter', '顶级法国黄油', 'Rich and creamy imported butter, ensuring a melt-in-your-mouth texture.', '浓郁柔滑的进口黄油，确保入口即化的口感。', '/images/products/1770218898793.png') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh, description_en = excluded.description_en, description_zh = excluded.description_zh, image = excluded.image;
INSERT INTO ingredients (id, name_en, name_zh, description_en, description_zh, image) VALUES ('2', 'High Protein Flour', '高筋面粉', 'Unbleached, high-protein flour for the perfect pastry structure.', '未经漂白的高筋面粉，打造完美的糕点结构。', '/images/products/1770219965597.png') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh, description_en = excluded.description_en, description_zh = excluded.description_zh, image = excluded.image;
INSERT INTO ingredients (id, name_en, name_zh, description_en, description_zh, image) VALUES ('3', '70% Dark Chocolate', '70% 黑巧克力', 'Sustainably sourced dark chocolate with deep cocoa notes for our signature ganache.', '可持续来源的黑巧克力，带有深沉的可可风味，用于我们的招牌甘那许。', '/images/products/1770219969771.png') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh, description_en = excluded.description_en, description_zh = excluded.description_zh, image = excluded.image;
INSERT INTO ingredients (id, name_en, name_zh, description_en, description_zh, image) VALUES ('4', 'Fresh Eggs', '新鲜鸡蛋', 'Farm-fresh, free-range eggs that lend our sponge cakes a signature golden hue and airy fluffiness.', '农场新鲜的散养鸡蛋，为我们的海绵蛋糕带来招牌的金黄色泽和轻盈蓬松感。', '/images/products/1770219945374.png') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh, description_en = excluded.description_en, description_zh = excluded.description_zh, image = excluded.image;
INSERT INTO ingredients (id, name_en, name_zh, description_en, description_zh, image) VALUES ('5', 'Fresh Fruits', '新鲜水果', 'Sun-ripened, locally sourced fruits.', '阳光下成熟的当地水果。', '/images/products/1770219932988.png') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh, description_en = excluded.description_en, description_zh = excluded.description_zh, image = excluded.image;
INSERT INTO ingredients (id, name_en, name_zh, description_en, description_zh, image) VALUES ('6', 'Pure & Honest', '纯净与诚实', 'Crafted without any artificial preservatives, ensuring every bite stays true to its natural, wholesome flavors. ', '不含任何人工防腐剂，确保每一口都保持天然、健康的原始风味。', '/images/products/1770219910595.png') ON CONFLICT(id) DO UPDATE SET name_en = excluded.name_en, name_zh = excluded.name_zh, description_en = excluded.description_en, description_zh = excluded.description_zh, image = excluded.image;

INSERT INTO site_settings (key, value) VALUES ('story', '{
    "en": {
        "title": "Our Story",
        "content": "Welcome to August Patisserie, where passion meets perfection. Our journey began with a simple dream: to create exceptional pastries that bring joy to every moment. Each creation is crafted with love, using only the finest ingredients and traditional techniques passed down through generations."
    },
    "zh": {
        "title": "我们的故事",
        "content": "欢迎来到 August Patisserie，这里是激情与完美的交汇之地。我们的旅程始于一个简单的梦想：创造卓越的糕点，为每一刻带来欢乐。每一件作品都倾注了爱心，只使用最优质的食材和代代相传的传统技艺。"
    }
}') ON CONFLICT(key) DO UPDATE SET value = excluded.value;

INSERT INTO site_settings (key, value) VALUES ('instagram', '[
  "/images/instagram/insta-1.jpg",
  "/images/instagram/insta-2.jpg",
  "/images/instagram/insta-3.jpg",
  "/images/instagram/insta-4.jpg",
  "/images/instagram/insta-5.jpg",
  "/images/instagram/insta-6.jpg",
  "/images/instagram/insta-7.jpg",
  "/images/instagram/insta-8.jpg",
  "/images/instagram/insta-9.jpg",
  "/images/instagram/insta-10.jpg",
  "/images/instagram/insta-11.jpg",
  "/images/instagram/insta-12.jpg"
]') ON CONFLICT(key) DO UPDATE SET value = excluded.value;

INSERT INTO site_settings (key, value) VALUES ('contact', '{
    "en": {
        "title": "Get in Touch",
        "intro": "We''d love to satisfy your sweet cravings.\nReach out for custom orders, inquiries, or just to say hello.",
        "whatsappTitle": "WhatsApp & Orders",
        "instagramTitle": "Follow Our Journey"
    },
    "zh": {
        "title": "联系我们",
        "intro": "我们很乐意满足您对甜品的渴望。\n欢迎联系我们定制订单、咨询或打个招呼。",
        "whatsappTitle": "WhatsApp 与订单",
        "instagramTitle": "关注我们的旅程"
    }
}') ON CONFLICT(key) DO UPDATE SET value = excluded.value;


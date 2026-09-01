import { describe, it, expect } from 'vitest';
import { mapProductRow, type ProductRow } from './products';

const base: ProductRow = {
    id: '1',
    name_en: 'Cube',
    name_zh: '方块',
    price: 35,
    category_id: 'cookies',
    description_en: 'desc',
    description_zh: '描述',
    is_best_seller: 1,
    main_image: '/api/images/1.png',
    images_list: null,
};

describe('mapProductRow', () => {
    it('surfaces isBestSeller (previously dropped on the menu page)', () => {
        expect(mapProductRow({ ...base, is_best_seller: 1 }).isBestSeller).toBe(true);
        expect(mapProductRow({ ...base, is_best_seller: 0 }).isBestSeller).toBe(false);
    });

    it('splits the image list on the || separator, not comma', () => {
        const p = mapProductRow({ ...base, images_list: '/api/images/1.png||/api/images/2.png' });
        expect(p.images).toEqual(['/api/images/1.png', '/api/images/2.png']);
    });

    it('does not split a single URL that happens to contain a comma', () => {
        const p = mapProductRow({ ...base, images_list: '/images/a,b.png' });
        expect(p.images).toEqual(['/images/a,b.png']);
    });

    it('returns an empty array when there are no images', () => {
        expect(mapProductRow({ ...base, images_list: null }).images).toEqual([]);
    });
});

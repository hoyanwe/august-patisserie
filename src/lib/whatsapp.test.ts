import { describe, it, expect } from 'vitest';
import { generateWhatsAppLink } from './whatsapp';

describe('generateWhatsAppLink', () => {
    it('percent-encodes the whole message so & does not truncate the order', () => {
        const url = generateWhatsAppLink(
            [{ id: '1', name: 'Chocolate & Hazelnut Tart', price: 25, quantity: 2 }],
            50,
            'en',
        );
        // There must be exactly one query separator: the '?text='. A raw '&'
        // from the product name would introduce a second, dropping the rest.
        expect(url.split('&').length).toBe(1);
        expect(url).toContain('?text=');
        const decoded = decodeURIComponent(url.split('?text=')[1]);
        expect(decoded).toContain('Chocolate & Hazelnut Tart');
        expect(decoded).toContain('Total: RM50.00');
    });

    it('handles # and non-ASCII (Chinese) names', () => {
        const url = generateWhatsAppLink(
            [{ id: '2', name: '月饼 #1', price: 43.9, quantity: 1 }],
            43.9,
            'zh',
        );
        expect(url.includes('#')).toBe(false); // encoded, not a raw fragment
        const decoded = decodeURIComponent(url.split('?text=')[1]);
        expect(decoded).toContain('月饼 #1');
        expect(decoded).toContain('您好，我想下单');
    });
});

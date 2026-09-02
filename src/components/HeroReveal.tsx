'use client';

import { useEffect } from 'react';
import { animate, stagger } from 'animejs';

// One-shot entrance animation for the hero, using anime.js. Degrades gracefully:
// if JS is off or reduced-motion is preferred, elements simply stay visible.
export default function HeroReveal() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const q = (s: string) => document.querySelector<HTMLElement>(s);
        const arch = q('.hl-arch');
        const badge = q('.hl-badge');
        const texts = ['.hl-headline', '.hl-brand', '.hl-info', '.hl-cta']
            .map(q)
            .filter((el): el is HTMLElement => el !== null);
        const sides = Array.from(document.querySelectorAll<HTMLElement>('.hl-vside'));

        // Hide, then reveal (effect runs after the first paint — the flash is a
        // single frame at most and never leaves anything hidden without JS).
        [arch, badge, ...texts, ...sides].forEach(el => { if (el) el.style.opacity = '0'; });

        if (arch) animate(arch, { opacity: [0, 1], scale: [0.94, 1], duration: 1000, ease: 'outCubic' });
        if (badge) animate(badge, { opacity: [0, 1], scale: [0.82, 1], duration: 900, delay: 500, ease: 'outBack' });
        if (sides.length) animate(sides, { opacity: [0, 1], duration: 900, delay: 250, ease: 'outCubic' });
        if (texts.length) {
            animate(texts, {
                opacity: [0, 1],
                translateY: [22, 0],
                duration: 850,
                delay: stagger(110, { start: 350 }),
                ease: 'outCubic',
            });
        }
    }, []);

    return null;
}

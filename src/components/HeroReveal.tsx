'use client';

import { useEffect } from 'react';
import { animate, stagger } from 'animejs';

// One-shot entrance animation for the hero, using anime.js.
// Robust: if the animation engine never runs (tab loaded in the background,
// reduced-motion, or any error), a safety timer forces everything visible so
// content can never get stuck hidden.
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
        const all = [arch, badge, ...texts, ...sides].filter((el): el is HTMLElement => el !== null);
        if (!all.length) return;

        const reveal = () => all.forEach(el => { el.style.opacity = ''; el.style.transform = ''; });

        // Hide, then reveal via animation.
        all.forEach(el => { el.style.opacity = '0'; });

        const anims: Array<{ pause?: () => void }> = [];
        try {
            if (arch) anims.push(animate(arch, { opacity: [0, 1], scale: [0.94, 1], duration: 1000, ease: 'outCubic' }));
            if (badge) anims.push(animate(badge, { opacity: [0, 1], scale: [0.82, 1], duration: 900, delay: 500, ease: 'outBack' }));
            if (sides.length) anims.push(animate(sides, { opacity: [0, 1], duration: 900, delay: 250, ease: 'outCubic' }));
            if (texts.length) anims.push(animate(texts, {
                opacity: [0, 1],
                translateY: [22, 0],
                duration: 850,
                delay: stagger(110, { start: 350 }),
                ease: 'outCubic',
            }));
        } catch {
            reveal();
        }

        // Safety net (fires even while the tab is hidden): guarantee visibility.
        const safety = setTimeout(() => {
            anims.forEach(a => { try { a.pause?.(); } catch { /* noop */ } });
            reveal();
        }, 1800);

        return () => clearTimeout(safety);
    }, []);

    return null;
}

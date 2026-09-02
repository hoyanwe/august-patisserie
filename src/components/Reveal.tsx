'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { animate, stagger } from 'animejs';

/**
 * Reveals its children with a staggered fade + rise when scrolled into view.
 * Robust: reduced-motion is respected, and a safety timer guarantees the content
 * becomes visible even if IntersectionObserver / anime.js never run.
 */
export default function Reveal({
    children,
    className,
    style,
    y = 20,
    step = 90,
    selector,
    as: Tag = 'div',
}: {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    y?: number;
    step?: number;
    selector?: string;      // if set, animate matching descendants; else direct children
    as?: 'div' | 'section';
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = ref.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const targets = (selector
            ? Array.from(root.querySelectorAll<HTMLElement>(selector))
            : (Array.from(root.children) as HTMLElement[]));
        if (!targets.length) return;

        const reveal = () => targets.forEach(el => { el.style.opacity = ''; el.style.transform = ''; });
        targets.forEach(el => { el.style.opacity = '0'; });

        let done = false;
        const run = () => {
            if (done) return;
            done = true;
            try {
                animate(targets, {
                    opacity: [0, 1],
                    translateY: [y, 0],
                    duration: 800,
                    delay: stagger(step),
                    ease: 'outCubic',
                });
            } catch {
                reveal();
            }
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { run(); io.disconnect(); } });
        }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
        io.observe(root);

        // Safety: never leave content hidden.
        const safety = setTimeout(() => { if (!done) reveal(); }, 4000);

        return () => { io.disconnect(); clearTimeout(safety); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Tag ref={ref as React.Ref<HTMLDivElement>} className={className} style={style}>
            {children}
        </Tag>
    );
}

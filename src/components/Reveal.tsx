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

        let started = false;
        let revealTimer: ReturnType<typeof setTimeout> | undefined;
        const run = () => {
            if (started) return;
            started = true;
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
            // Once triggered, guarantee visibility shortly after the animation
            // should have finished — even if the engine was paused (background tab).
            revealTimer = setTimeout(reveal, 1200 + step * targets.length);
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { run(); io.disconnect(); } });
        }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
        io.observe(root);

        // Global fallback: if it never entered view (or IO is unavailable), reveal.
        const globalSafety = setTimeout(() => { if (!started) reveal(); }, 8000);

        return () => { io.disconnect(); clearTimeout(globalSafety); if (revealTimer) clearTimeout(revealTimer); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Tag ref={ref as React.Ref<HTMLDivElement>} className={className} style={style}>
            {children}
        </Tag>
    );
}

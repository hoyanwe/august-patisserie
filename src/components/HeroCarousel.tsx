'use client';

import { useEffect, useRef, useState } from 'react';

// Slow cross-fade loop for the hero arch image. Only advances to an image that
// has actually finished loading, so a not-yet-loaded frame never flashes blank.
export default function HeroCarousel({ images, alt }: { images: string[]; alt: string }) {
    const [index, setIndex] = useState(0);
    const refs = useRef<(HTMLImageElement | null)[]>([]);

    useEffect(() => {
        if (images.length <= 1) return;
        const id = setInterval(() => {
            setIndex(cur => {
                for (let step = 1; step < images.length; step++) {
                    const cand = (cur + step) % images.length;
                    const el = refs.current[cand];
                    if (el && el.complete && el.naturalWidth > 0) return cand;
                }
                return cur; // nothing else loaded yet — hold the current image
            });
        }, 6000);
        return () => clearInterval(id);
    }, [images.length]);

    return (
        <div className="hl-carousel">
            {images.map((src, i) => (
                <img
                    key={src}
                    ref={el => { refs.current[i] = el; }}
                    src={src}
                    alt={i === 0 ? alt : ''}
                    aria-hidden={i !== index}
                    className="hl-carousel-img"
                    style={{ opacity: i === index ? 1 : 0 }}
                    draggable={false}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                />
            ))}
        </div>
    );
}

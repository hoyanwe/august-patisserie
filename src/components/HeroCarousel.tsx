'use client';

import { useEffect, useState } from 'react';

// Slow cross-fade loop for the hero arch image.
export default function HeroCarousel({ images, alt }: { images: string[]; alt: string }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const id = setInterval(() => setIndex(i => (i + 1) % images.length), 6000);
        return () => clearInterval(id);
    }, [images.length]);

    return (
        <div className="hl-carousel">
            {images.map((src, i) => (
                <img
                    key={src}
                    src={src}
                    alt={i === 0 ? alt : ''}
                    aria-hidden={i !== index}
                    className="hl-carousel-img"
                    style={{ opacity: i === index ? 1 : 0 }}
                    draggable={false}
                />
            ))}
        </div>
    );
}

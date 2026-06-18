"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const DEFAULT = [{
  title: "Elegant Modest Fashion",
  subtitle: "Thoughtfully crafted abayas, designed for the modern woman.",
  ctaText: "Shop Now", ctaLink: "/search", image: "/hero.jpg",
}];

export default function HeroCarousel({ banners }) {
  const slides = banners && banners.length ? banners : DEFAULT;
  const [i, setI] = useState(0);
  const n = slides.length;
  const go = useCallback((idx) => setI((idx + n) % n), [n]);

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n]);

  const s = slides[i];

  return (
    <section className="relative h-[78vh] min-h-[520px] overflow-hidden">
      {slides.map((slide, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-[#3a2e26] to-clay" />
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${slide.image || "/hero.jpg"}')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/10" />
        </div>
      ))}

      <div className="relative max-w-7xl mx-auto px-6 w-full h-full flex items-center">
        <div className="max-w-xl">
          <p className="text-sand/70 uppercase tracking-[0.35em] text-xs mb-5">Modora Élan</p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl text-sand leading-[1.02]">{s.title || "Elegant Modest Fashion"}</h1>
          {s.subtitle && <p className="text-sand/80 text-lg md:text-xl mt-5 max-w-md">{s.subtitle}</p>}
          <div className="mt-9">
            <Link href={s.ctaLink || "/search"} className="inline-block px-10 py-4 bg-sand text-ink hover:bg-clay hover:text-sand transition-colors tracking-wide">{s.ctaText || "Shop Now"}</Link>
          </div>
        </div>
      </div>

      {n > 1 && (
        <>
          <button onClick={() => go(i - 1)} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-sand/20 hover:bg-sand/40 text-sand text-2xl flex items-center justify-center backdrop-blur">‹</button>
          <button onClick={() => go(i + 1)} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-sand/20 hover:bg-sand/40 text-sand text-2xl flex items-center justify-center backdrop-blur">›</button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => go(idx)} aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-sand" : "w-2 bg-sand/40"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
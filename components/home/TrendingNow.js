"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function TrendingNow({ categories = [] }) {
  const tabs = [
    { label: "New Arrivals", q: "" },
    { label: "Best Sellers", q: "?featured=true" },
    ...categories.slice(0, 4).map((c) => ({ label: c.name, q: `?category=${c.slug}` })),
  ];
  const [active, setActive] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProducts(tabs[active].q)
      .then((d) => setProducts((d?.products || []).slice(0, 4)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [active]);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl">Trending Now</h2>
          <p className="text-ink/50 mt-2">From everyday essentials to the latest modest styles.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t, i) => (
            <button key={t.label} onClick={() => setActive(i)}
              className={`px-4 py-2 text-sm border rounded-full transition-colors capitalize ${active === i ? "bg-clay text-sand border-clay" : "border-ink/20 hover:border-ink"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-ink/5 animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <p className="text-ink/50">No products here yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((p) => {
            const disc = p.compareAtPrice > p.price ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : 0;
            return (
              <Link key={p._id} href={`/products/${p.slug}`} className="group">
                <div className="relative aspect-[3/4] bg-ink/5 overflow-hidden">
                  {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 50vw, 25vw" />}
                  {disc > 0 && <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5">-{disc}%</span>}
                </div>
                <p className="mt-2 text-[11px] text-ink/40 uppercase tracking-wide">Modora Élan</p>
                <p className="text-sm truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-sm ${disc > 0 ? "text-red-600 font-medium" : "text-ink/70"}`}>{formatPrice(p.price)}</span>
                  {disc > 0 && <span className="text-ink/40 line-through text-xs">{formatPrice(p.compareAtPrice)}</span>}
                  {disc > 0 && <span className="text-red-600 text-xs">-{disc}%</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
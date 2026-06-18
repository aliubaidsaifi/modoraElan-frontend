"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRecentlyViewed } from "@/lib/recentlyViewed";
import { formatPrice } from "@/lib/utils";

export default function RecentlyViewed({ currentId }) {
  const [items, setItems] = useState([]);
  useEffect(() => { setItems(getRecentlyViewed().filter((p) => p._id !== currentId).slice(0, 6)); }, [currentId]);
  if (items.length === 0) return null;
  return (
    <div className="mt-16">
      <h2 className="font-[family-name:var(--font-display)] text-2xl mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-8">
        {items.map((p) => {
          const disc = p.compareAtPrice > p.price ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : 0;
          return (
            <Link key={p._id} href={`/products/${p.slug}`} className="group">
              <div className="relative aspect-[3/4] bg-ink/5 overflow-hidden">
                {p.image && <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 50vw, 20vw" />}
              </div>
              <p className="mt-2 text-sm truncate">{p.name}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className={disc > 0 ? "text-red-600" : "text-ink/60"}>{formatPrice(p.price)}</span>
                {disc > 0 && <span className="text-ink/40 line-through text-xs">{formatPrice(p.compareAtPrice)}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
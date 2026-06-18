"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const SIZES = ["S", "M", "L", "XL", "Free Size"];
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

function SearchInner() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [f, setF] = useState({ category: "", minPrice: "", maxPrice: "", size: "", inStock: false, sort: "newest" });

  useEffect(() => {
    api.getCategories().then((d) => setCategories(d?.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (q) qs.set("search", q);
    if (f.category) qs.set("category", f.category);
    if (f.minPrice) qs.set("minPrice", f.minPrice);
    if (f.maxPrice) qs.set("maxPrice", f.maxPrice);
    if (f.size) qs.set("size", f.size);
    if (f.inStock) qs.set("inStock", "true");
    if (f.sort) qs.set("sort", f.sort);
    api.getProducts(`?${qs.toString()}`)
      .then((d) => setProducts(d?.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [q, f]);

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const reset = () => setF({ category: "", minPrice: "", maxPrice: "", size: "", inStock: false, sort: "newest" });
  const input = "w-full border border-ink/20 px-2 py-1.5 bg-white/60 outline-none focus:border-ink";

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-3xl mb-1">
        {q ? <>Search: &ldquo;{q}&rdquo;</> : "Shop All"}
      </h1>
      <p className="text-ink/50 text-sm mb-8">{loading ? "Searching..." : `${products.length} product${products.length === 1 ? "" : "s"}`}</p>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-6 text-sm">
          <div className="flex justify-between items-center">
            <h2 className="uppercase tracking-widest text-xs text-ink/50">Filters</h2>
            <button onClick={reset} className="text-xs text-clay hover:underline">Reset</button>
          </div>

          <div>
            <p className="font-medium mb-2">Sort</p>
            <select value={f.sort} onChange={(e) => set("sort", e.target.value)} className={input}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <p className="font-medium mb-2">Category</p>
            <select value={f.category} onChange={(e) => set("category", e.target.value)} className={input}>
              <option value="">All</option>
              {categories.map((c) => <option key={c._id} value={c.slug} className="capitalize">{c.name}</option>)}
            </select>
          </div>

          <div>
            <p className="font-medium mb-2">Price (₹)</p>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={f.minPrice} onChange={(e) => set("minPrice", e.target.value)} className={input} />
              <input type="number" placeholder="Max" value={f.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} className={input} />
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s} onClick={() => set("size", f.size === s ? "" : s)}
                  className={`px-2.5 py-1 border text-xs ${f.size === s ? "border-ink bg-ink text-sand" : "border-ink/20"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={f.inStock} onChange={(e) => set("inStock", e.target.checked)} />
            In stock only
          </label>
        </aside>

        <div>
          {loading ? (
            <p className="text-ink/50">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-ink/50">No products found. Try different filters.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
              {products.map((p) => (
                <Link key={p._id} href={`/products/${p.slug}`} className="group">
                  <div className="relative aspect-[3/4] bg-ink/5 overflow-hidden">
                    {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width:768px) 50vw, 33vw" />}
                  </div>
                  <p className="mt-2 text-sm">{p.name}</p>
                  <p className="text-sm text-ink/60">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="px-6 py-20 text-center text-ink/50">Loading...</div>}>
      <SearchInner />
    </Suspense>
  );
}
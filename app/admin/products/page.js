"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminApi } from "@/lib/adminApi";
import { formatPrice } from "@/lib/utils";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getProducts().then((d) => setProducts(d.products || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await adminApi.deleteProduct(id);
    setProducts((p) => p.filter((x) => x._id !== id));
  };
  const stockOf = (p) => (p.variants || []).reduce((s, v) => s + (v.stock || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Products</h1>
        <Link href="/admin/products/new" className="px-4 py-2 bg-ink text-sand text-sm hover:bg-clay transition-colors">+ Add Product</Link>
      </div>
      {loading ? <p className="text-ink/50">Loading...</p> : products.length === 0 ? (
        <p className="text-ink/50">No products yet. <Link href="/admin/products/new" className="text-clay underline">Add your first product</Link>.</p>
      ) : (
        <div className="border border-ink/10 bg-white/50 divide-y divide-ink/10">
          {products.map((p) => (
            <div key={p._id} className="flex items-center gap-4 p-3">
              <div className="relative w-12 h-14 bg-ink/5 shrink-0">
                {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="48px" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate">{p.name}</p>
                <p className="text-xs text-ink/50">{p.category?.name || "—"} · {formatPrice(p.price)} · Stock {stockOf(p)}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link href={`/admin/products/${p.slug}/edit`} className="text-clay hover:underline">Edit</Link>
                <button onClick={() => remove(p._id)} className="text-red-700 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
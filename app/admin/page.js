"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminApi } from "@/lib/adminApi";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { products } = await adminApi.getProducts();
      setProducts(products || []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const del = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await adminApi.deleteProduct(id);
    setProducts((p) => p.filter((x) => x._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Products</h1>
        <Link href="/admin/products/new"
          className="px-5 py-2.5 bg-ink text-sand text-sm hover:bg-clay transition-colors">
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-ink/50">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-ink/50">No products yet. Click "Add Product" to start.</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p._id}
              className="flex items-center gap-4 bg-white/50 border border-ink/10 px-4 py-3">
              <div className="relative w-12 h-16 bg-ink/5 shrink-0">
                {p.images?.[0] && (
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="48px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate">{p.name}</p>
                <p className="text-sm text-ink/50">
                  {formatPrice(p.price)} · {p.category?.name || "—"}
                  {p.isFeatured && " · ★ Featured"}
                </p>
              </div>
              <Link href={`/admin/products/${p.slug}/edit`}
                className="text-sm text-clay hover:underline">Edit</Link>
              <button onClick={() => del(p._id, p.name)}
                className="text-sm text-ink/40 hover:text-red-700">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

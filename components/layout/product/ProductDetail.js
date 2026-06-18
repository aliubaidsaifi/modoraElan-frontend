"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartStore";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { addRecentlyViewed } from "@/lib/recentlyViewed";
import RecentlyViewed from "./RecentlyViewed";

const MEASURE_FIELDS = ["Height", "Bust", "Shoulder", "Sleeve Length", "Length"];
const GLANCE = ["Custom sizing available", "Premium breathable fabric", "Cash on Delivery available", "Easy 7-day returns"];

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/10">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-4 text-left">
        <span className="text-sm uppercase tracking-widest">{title}</span>
        <span className="text-ink/40 text-lg">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pb-5 text-sm text-ink/60 leading-relaxed">{children}</div>}
    </div>
  );
}

export default function ProductDetail({ product }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState(product.colors?.[0]?.name || "");
  const [measurements, setMeasurements] = useState({});
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [related, setRelated] = useState([]);

  const isCustom = size === "Custom";
  const setM = (k, v) => setMeasurements((m) => ({ ...m, [k]: v }));
  const discount = product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

  useEffect(() => {
    addRecentlyViewed(product);
    if (product.category?.slug) {
      api.getProducts(`?category=${product.category.slug}`)
        .then((d) => setRelated((d?.products || []).filter((p) => p._id !== product._id).slice(0, 4)))
        .catch(() => {});
    }
  }, [product]);

  const buildItem = () => {
    if (!size) { setError("Please select a size"); return null; }
    if (isCustom) {
      const ok = MEASURE_FIELDS.every((f) => measurements[f]?.toString().trim());
      if (!ok) { setError("Please fill all measurements (in inches)"); return null; }
    }
    setError("");
    return { productId: product._id, name: product.name, price: product.price, size, image: product.images?.[0] || "", ...(color ? { color } : {}), ...(isCustom ? { measurements } : {}) };
  };
  const handleAdd = () => { const it = buildItem(); if (!it) return; add(it); setAdded(true); setTimeout(() => setAdded(false), 1500); };
  const handleBuyNow = () => { const it = buildItem(); if (!it) return; add(it); router.push("/checkout"); };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      <nav className="text-xs text-ink/50 mb-5 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-clay">Home</Link><span>/</span>
        {product.category?.slug && (<><Link href={`/category/${product.category.slug}`} className="hover:text-clay capitalize">{product.category.name}</Link><span>/</span></>)}
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="flex gap-3">
          {product.images?.length > 1 && (
            <div className="flex flex-col gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActive(i)} className={`relative w-16 h-20 overflow-hidden ${i === active ? "ring-2 ring-ink" : "opacity-60 hover:opacity-100"}`}>
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
          <div className="relative flex-1 aspect-[3/4] bg-ink/5 overflow-hidden">
            {product.images?.[active] && <Image src={product.images[active]} alt={product.name} fill className="object-cover" sizes="50vw" priority />}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex justify-between items-start gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-ink/40">Modora Élan</p>
              <h1 className="text-xl mt-1">{product.name}</h1>
            </div>
            <button onClick={() => setWished((w) => !w)} aria-label="Wishlist" className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center hover:border-ink shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className={`text-2xl ${discount > 0 ? "text-red-600 font-medium" : ""}`}>{formatPrice(product.price)}</span>
            {discount > 0 && <span className="text-ink/40 line-through">{formatPrice(product.compareAtPrice)}</span>}
            {discount > 0 && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5">-{discount}%</span>}
          </div>

          <p className="text-sm text-ink/60 mt-3">🚚 Delivery across India in 5–8 days · Cash on Delivery available</p>

          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm">Colour: <span className="text-ink/60">{color}</span></p>
              <div className="flex gap-2 mt-2">
                {product.colors.map((c) => (
                  <button key={c.name} onClick={() => setColor(c.name)} title={c.name}
                    className={`w-8 h-8 rounded-full border ${color === c.name ? "ring-2 ring-ink ring-offset-2" : "border-ink/20"}`} style={{ backgroundColor: c.hex || "#ccc" }} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm">Select a Size</p>
              <button onClick={() => setShowGuide((s) => !s)} className="text-sm underline text-ink/60 hover:text-ink">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants?.map((v) => (
                <button key={v.size} onClick={() => setSize(v.size)} disabled={v.stock === 0}
                  className={`min-w-[3rem] px-3 py-2.5 border text-sm ${size === v.size ? "border-ink bg-ink text-sand" : "border-ink/20 hover:border-ink"} ${v.stock === 0 ? "opacity-30 line-through" : ""}`}>{v.size}</button>
              ))}
              <button onClick={() => setSize("Custom")} className={`px-3 py-2.5 border text-sm ${isCustom ? "border-ink bg-ink text-sand" : "border-ink/20 hover:border-ink"}`}>Custom</button>
            </div>
            {showGuide && (
              <div className="mt-3 border border-ink/10 p-4 text-sm text-ink/60 bg-white/40">
                <p className="mb-2 font-medium text-ink">Size guide (inches)</p>
                <table className="w-full text-xs">
                  <thead><tr className="text-ink/40 text-left"><th className="py-1">Size</th><th>Bust</th><th>Length</th></tr></thead>
                  <tbody>
                    {[["S","36","54"],["M","38","55"],["L","40","56"],["XL","42","57"]].map((r) => (
                      <tr key={r[0]} className="border-t border-ink/10"><td className="py-1">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2">Apni exact fit ke liye <b>Custom</b> choose kar.</p>
              </div>
            )}
          </div>

          {isCustom && (
            <div className="mt-5 border border-ink/10 p-5 bg-white/40">
              <p className="text-sm mb-1">Your measurements <span className="text-ink/40">(in inches)</span></p>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {MEASURE_FIELDS.map((f) => (
                  <div key={f}>
                    <label className="text-xs text-ink/50">{f}</label>
                    <input type="number" value={measurements[f] || ""} onChange={(e) => setM(f, e.target.value)} className="w-full border-b border-ink/20 bg-transparent py-1.5 outline-none focus:border-ink text-sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-700 text-sm mt-4">{error}</p>}

          <button onClick={handleAdd} className="w-full mt-6 py-4 bg-ink text-sand text-sm tracking-widest uppercase hover:bg-clay transition-colors">
            {added ? "Added to Bag ✓" : "Add to Bag"}
          </button>
          <button onClick={handleBuyNow} className="w-full mt-3 py-4 border border-ink text-sm tracking-widest uppercase hover:bg-ink hover:text-sand transition-colors">Buy Now</button>

          <div className="mt-8">
            <p className="font-medium mb-3">At a Glance</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {GLANCE.map((g) => (
                <p key={g} className="flex items-center gap-2 text-sm text-ink/70"><span className="text-clay">✓</span> {g}</p>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Accordion title="Description" defaultOpen>{product.description || "A timeless piece, thoughtfully crafted for everyday elegance."}</Accordion>
            <Accordion title="Product Details & Care">{product.fabric ? `Fabric: ${product.fabric}. ` : ""}Gentle hand-wash or dry clean · Do not bleach · Warm iron if needed.</Accordion>
            <Accordion title="Delivery">Dispatched in 2–4 business days · Delivery across India in 5–8 days · Cash on Delivery available.</Accordion>
            <Accordion title="Returns">Easy 7-day return/exchange on unused items with tags. Custom-stitched pieces are non-returnable.</Accordion>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl mb-6">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
            {related.map((p) => (
              <Link key={p._id} href={`/products/${p.slug}`} className="group">
                <div className="relative aspect-[3/4] bg-ink/5 overflow-hidden">
                  {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 50vw, 25vw" />}
                </div>
                <p className="mt-2 text-sm truncate">{p.name}</p>
                <p className="text-sm text-ink/60">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <RecentlyViewed currentId={product._id} />
    </div>
  );
}
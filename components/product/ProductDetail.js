"use client";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cartStore";
import { formatPrice } from "@/lib/utils";

const MEASURE_FIELDS = ["Height", "Bust", "Shoulder", "Sleeve Length", "Length"];

export default function ProductDetail({ product }) {
  const [size, setSize] = useState(product.variants?.[0]?.size || "");
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const [measurements, setMeasurements] = useState({});
  const [error, setError] = useState("");
  const add = useCart((s) => s.add);

  const isCustom = size === "Custom";
  const setM = (k, v) => setMeasurements((m) => ({ ...m, [k]: v }));

  const handleAdd = () => {
    setError("");
    if (!size) return setError("Please select a size");
    if (isCustom) {
      const filled = MEASURE_FIELDS.every((f) => measurements[f]?.toString().trim());
      if (!filled) return setError("Please fill all measurements (in inches)");
    }
    add({
      productId: product._id,
      name: product.name,
      price: product.price,
      size,
      image: product.images?.[0] || "",
      ...(isCustom ? { measurements } : {}),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
      {/* Gallery */}
      <div>
        <div className="relative aspect-[3/4] bg-ink/5 overflow-hidden">
          {product.images?.[active] && (
            <Image src={product.images[active]} alt={product.name} fill className="object-cover" sizes="50vw" priority />
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-3 mt-3">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`relative w-16 h-20 overflow-hidden ${i === active ? "ring-2 ring-ink" : "opacity-60"}`}>
                <Image src={img} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">{product.name}</h1>
        <div className="flex gap-3 items-baseline mt-3">
          <p className="text-2xl">{formatPrice(product.price)}</p>
          {product.compareAtPrice > product.price && (
            <p className="text-ink/40 line-through">{formatPrice(product.compareAtPrice)}</p>
          )}
        </div>
        <p className="text-ink/60 mt-6 leading-relaxed">{product.description}</p>

        {/* Size */}
        <div className="mt-8">
          <p className="text-sm mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.variants?.map((v) => (
              <button key={v.size} onClick={() => setSize(v.size)} disabled={v.stock === 0}
                className={`px-4 py-2 border text-sm ${size === v.size ? "border-ink bg-ink text-sand" : "border-ink/20"} ${v.stock === 0 ? "opacity-30 line-through" : ""}`}>
                {v.size}
              </button>
            ))}
            <button onClick={() => setSize("Custom")}
              className={`px-4 py-2 border text-sm ${isCustom ? "border-ink bg-ink text-sand" : "border-ink/20"}`}>
              Custom
            </button>
          </div>
        </div>

        {/* Custom measurements */}
        {isCustom && (
          <div className="mt-6 border border-ink/10 p-5 bg-white/40">
            <p className="text-sm mb-1">Your measurements <span className="text-ink/40">(in inches)</span></p>
            <p className="text-xs text-ink/50 mb-4">Tailored to your exact fit. We&apos;ll confirm details on WhatsApp.</p>
            <div className="grid grid-cols-2 gap-3">
              {MEASURE_FIELDS.map((f) => (
                <div key={f}>
                  <label className="text-xs text-ink/50">{f}</label>
                  <input type="number" value={measurements[f] || ""} onChange={(e) => setM(f, e.target.value)}
                    className="w-full border-b border-ink/20 bg-transparent py-1.5 outline-none focus:border-ink text-sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-700 text-sm mt-4">{error}</p>}

        <button onClick={handleAdd} className="w-full mt-8 py-4 bg-ink text-sand hover:bg-clay transition-colors">
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
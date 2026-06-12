"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";

const ALL_SIZES = ["S", "M", "L", "XL", "Free Size"];

export default function ProductForm({ initial = null, productId = null }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "", description: "", price: "", compareAtPrice: "",
    category: "", isFeatured: false,
  });
  const [images, setImages] = useState([]); // cloudinary urls
  const [variants, setVariants] = useState({}); // { S: 5, M: 3 }
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.getCategories().then((d) => setCategories(d.categories || [])).catch(() => {});
  }, []);

  // prefill on edit
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        description: initial.description || "",
        price: initial.price ?? "",
        compareAtPrice: initial.compareAtPrice ?? "",
        category: initial.category?._id || initial.category || "",
        isFeatured: !!initial.isFeatured,
      });
      setImages(initial.images || []);
      const v = {};
      (initial.variants || []).forEach((x) => { v[x.size] = x.stock; });
      setVariants(v);
    }
  }, [initial]);

  const set = (k, val) => setForm((f) => ({ ...f, [k]: val }));

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    setUploading(true); setError("");
    try {
      for (const file of files) {
        const { url } = await adminApi.uploadImage(file);
        setImages((imgs) => [...imgs, url]);
      }
    } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  };

  const toggleSize = (size) =>
    setVariants((v) => {
      const next = { ...v };
      if (size in next) delete next[size];
      else next[size] = 0;
      return next;
    });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.category) return setError("Please select a category");
    if (images.length === 0) return setError("Add at least one image");

    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: Number(form.compareAtPrice) || 0,
      images,
      variants: Object.entries(variants).map(([size, stock]) => ({ size, stock: Number(stock) })),
    };

    setSaving(true);
    try {
      if (productId) await adminApi.updateProduct(productId, payload);
      else await adminApi.createProduct(payload);
      router.push("/admin");
    } catch (err) { setError(err.message); setSaving(false); }
  };

  const input = "w-full border border-ink/20 px-3 py-2 bg-white/60 outline-none focus:border-ink";

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <div>
        <label className="text-sm block mb-1">Product name</label>
        <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} required />
      </div>

      <div>
        <label className="text-sm block mb-1">Description</label>
        <textarea className={input} rows={4} value={form.description}
          onChange={(e) => set("description", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm block mb-1">Price (₹)</label>
          <input type="number" className={input} value={form.price}
            onChange={(e) => set("price", e.target.value)} required />
        </div>
        <div>
          <label className="text-sm block mb-1">Compare-at price (₹, optional)</label>
          <input type="number" className={input} value={form.compareAtPrice}
            onChange={(e) => set("compareAtPrice", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-sm block mb-1">Category</label>
        <select className={input} value={form.category} onChange={(e) => set("category", e.target.value)} required>
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm block mb-2">Sizes &amp; stock</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {ALL_SIZES.map((s) => (
            <button type="button" key={s} onClick={() => toggleSize(s)}
              className={`px-3 py-1.5 border text-sm ${s in variants ? "border-ink bg-ink text-sand" : "border-ink/20"}`}>
              {s}
            </button>
          ))}
        </div>
        {Object.keys(variants).length > 0 && (
          <div className="space-y-2">
            {Object.keys(variants).map((s) => (
              <div key={s} className="flex items-center gap-3">
                <span className="w-20 text-sm">{s}</span>
                <input type="number" placeholder="stock" className={`${input} w-32`}
                  value={variants[s]}
                  onChange={(e) => setVariants((v) => ({ ...v, [s]: e.target.value }))} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm block mb-2">Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative w-20 h-24 bg-ink/5 group">
              <Image src={url} alt="" fill className="object-cover" sizes="80px" />
              <button type="button" onClick={() => setImages((im) => im.filter((_, idx) => idx !== i))}
                className="absolute top-0 right-0 bg-ink text-sand text-xs w-5 h-5">×</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={handleUpload} className="text-sm" />
        {uploading && <p className="text-sm text-clay mt-1">Uploading...</p>}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
        Show on homepage (Featured)
      </label>

      {error && <p className="text-red-700 text-sm">{error}</p>}

      <button disabled={saving || uploading}
        className="px-8 py-3 bg-ink text-sand hover:bg-clay transition-colors disabled:opacity-50">
        {saving ? "Saving..." : productId ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
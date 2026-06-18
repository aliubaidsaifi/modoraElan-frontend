"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/adminApi";

const blank = { title: "", subtitle: "", image: "", ctaText: "Shop Now", ctaLink: "/search", isActive: true, order: 0 };

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => adminApi.getBanners().then((d) => setBanners(d.banners || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const upload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const res = await adminApi.uploadImage(file); set("image", res.url || res.secure_url || res.image); }
    catch (err) { alert(err.message); } finally { setUploading(false); }
  };
  const save = async () => {
    if (!form.image) return alert("Please upload a banner image");
    setSaving(true);
    try {
      if (editingId) await adminApi.updateBanner(editingId, form);
      else await adminApi.createBanner(form);
      setForm(blank); setEditingId(null); load();
    } catch (e) { alert(e.message); } finally { setSaving(false); }
  };
  const edit = (b) => { setForm({ title: b.title || "", subtitle: b.subtitle || "", image: b.image, ctaText: b.ctaText, ctaLink: b.ctaLink, isActive: b.isActive }); setEditingId(b._id); };
  const del = async (id) => { if (!confirm("Delete banner?")) return; await adminApi.deleteBanner(id); load(); };
  const toggle = async (b) => { await adminApi.updateBanner(b._id, { isActive: !b.isActive }); load(); };
  const input = "w-full border border-ink/20 px-3 py-2 bg-white/60 text-sm";

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl mb-6">Banners</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="border border-ink/10 bg-white/50 p-5 space-y-3">
          <h2 className="font-medium">{editingId ? "Edit banner" : "New hero banner"}</h2>
          <div>
            <label className="text-sm">Banner image (uploads to Cloudinary)</label>
            <input type="file" accept="image/*" onChange={upload} className="block text-sm mt-1" />
            {uploading && <p className="text-xs text-ink/50">Uploading...</p>}
            {form.image && (
              <div className="relative w-full h-32 mt-2 bg-ink/5"><Image src={form.image} alt="" fill className="object-cover" sizes="400px" /></div>
            )}
          </div>
          <input className={input} placeholder="Title (e.g. Eid Sale — 30% Off)" value={form.title} onChange={(e) => set("title", e.target.value)} />
          <input className={input} placeholder="Subtitle" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className={input} placeholder="Button text" value={form.ctaText} onChange={(e) => set("ctaText", e.target.value)} />
            <input className={input} placeholder="Button link (e.g. /search)" value={form.ctaLink} onChange={(e) => set("ctaLink", e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
          <input className={input} type="number" placeholder="Order (0 = first)" value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
            <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} /> Active (show on homepage)
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={save} disabled={saving} className="px-4 py-2 bg-ink text-sand text-sm hover:bg-clay transition-colors disabled:opacity-50">
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            {editingId && <button onClick={() => { setForm(blank); setEditingId(null); }} className="px-4 py-2 border border-ink/20 text-sm">Cancel</button>}
          </div>
        </div>

        <div className="space-y-3">
          {banners.length === 0 ? <p className="text-ink/50 text-sm">No banners yet.</p> : banners.map((b) => (
            <div key={b._id} className="border border-ink/10 bg-white/50 p-3 flex gap-3">
              <div className="relative w-24 h-16 bg-ink/5 shrink-0">{b.image && <Image src={b.image} alt="" fill className="object-cover" sizes="96px" />}</div>
              <div className="flex-1 min-w-0 text-sm">
                <p className="truncate font-medium">{b.title || "(no title)"}</p>
                <p className="text-ink/50 text-xs truncate">{b.subtitle}</p>
                <p className="text-xs mt-1">{b.isActive ? <span className="text-green-700">● Active</span> : <span className="text-ink/40">○ Hidden</span>}</p>
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <button onClick={() => edit(b)} className="text-clay">Edit</button>
                <button onClick={() => toggle(b)} className="text-ink/60">{b.isActive ? "Hide" : "Show"}</button>
                <button onClick={() => del(b._id)} className="text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
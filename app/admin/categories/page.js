"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () =>
    adminApi.getCategories().then((d) => setCategories(d.categories || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      await adminApi.createCategory({ name, parent: parent || null });
      setName(""); setParent("");
      load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  // helper: show parent name
  const parentName = (id) => categories.find((c) => c._id === id)?.name || "";

  const input = "w-full border border-ink/20 px-3 py-2 bg-white/60 outline-none focus:border-ink";

  return (
    <div className="max-w-2xl">
      <h1 className="font-[family-name:var(--font-display)] text-3xl mb-8">Categories</h1>

      <form onSubmit={add} className="bg-white/50 border border-ink/10 p-5 mb-8 space-y-4">
        <div>
          <label className="text-sm block mb-1">New category name</label>
          <input className={input} value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Children, Kurtas, Hijabs" required />
        </div>
        <div>
          <label className="text-sm block mb-1">Parent (optional — leave empty for a top-level section)</label>
          <select className={input} value={parent} onChange={(e) => setParent(e.target.value)}>
            <option value="">— Top level —</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button disabled={saving}
          className="px-6 py-2.5 bg-ink text-sand text-sm hover:bg-clay transition-colors disabled:opacity-50">
          {saving ? "Adding..." : "Add Category"}
        </button>
      </form>

      <div className="space-y-1">
        {categories.map((c) => (
          <div key={c._id} className="flex items-center gap-3 bg-white/40 border border-ink/10 px-4 py-2 text-sm">
            <span>{c.name}</span>
            {c.parent && <span className="text-ink/40">↳ under {parentName(c.parent)}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(() => {
      api.getProducts(`?search=${encodeURIComponent(q.trim())}`)
        .then((d) => { setResults((d?.products || []).slice(0, 6)); setOpen(true); })
        .catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submit = (e) => { e?.preventDefault(); if (!q.trim()) return; setOpen(false); router.push(`/search?q=${encodeURIComponent(q.trim())}`); };

  return (
    <div ref={ref} className="relative w-full">
      <form onSubmit={submit} className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => results.length && setOpen(true)}
          placeholder="Search for abayas, styles and more"
          className="w-full bg-ink/[0.04] hover:bg-ink/[0.06] focus:bg-white border border-transparent focus:border-ink/20 rounded pl-10 pr-3 py-2.5 text-sm outline-none transition-colors" />
      </form>
      {open && results.length > 0 && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-ink/10 shadow-lg z-50">
          {results.map((p) => (
            <Link key={p._id} href={`/products/${p.slug}`} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-ink/5">
              <div className="relative w-9 h-11 bg-ink/5 shrink-0">
                {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="36px" />}
              </div>
              <div className="text-sm min-w-0">
                <p className="truncate">{p.name}</p>
                <p className="text-xs text-ink/50">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
          <button onClick={submit} className="w-full text-left px-3 py-2 text-sm text-clay hover:bg-ink/5 border-t border-ink/10">
            See all results for &ldquo;{q}&rdquo; →
          </button>
        </div>
      )}
    </div>
  );
}
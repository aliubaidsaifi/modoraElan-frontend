"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e) => { e.preventDefault(); if (!email.trim()) return; setDone(true); setEmail(""); };
  return (
    <section className="bg-ink text-sand">
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="uppercase tracking-[0.35em] text-xs text-clay mb-4">Stay in touch</p>
        <h2 className="font-[family-name:var(--font-display)] text-4xl">Join the Élan circle</h2>
        <p className="text-sand/70 mt-4">New arrivals, private sales, and styling notes — straight to your inbox.</p>
        {done ? (
          <p className="mt-8 text-clay">Thank you — you&apos;re on the list ✓</p>
        ) : (
          <form onSubmit={submit} className="mt-8 flex gap-2 max-w-md mx-auto">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email"
              className="flex-1 bg-transparent border border-sand/30 px-4 py-3 text-sand placeholder:text-sand/40 outline-none focus:border-sand" />
            <button className="px-6 py-3 bg-sand text-ink hover:bg-clay hover:text-sand transition-colors">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}
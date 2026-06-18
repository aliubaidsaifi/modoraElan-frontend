"use client";
import { useState, useEffect } from "react";

const MSGS = ["Free shipping over ₹1499", "Cash on Delivery available", "Easy 7-day returns", "Crafted with care in Delhi"];

export default function PromoBar() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((p) => (p + 1) % MSGS.length), 3500); return () => clearInterval(t); }, []);
  return (
    <div className="bg-ink text-sand text-center text-[11px] md:text-xs tracking-[0.2em] uppercase py-2 px-4">
      {MSGS[i]}
    </div>
  );
}
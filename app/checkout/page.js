"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cartStore";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [form, setForm] = useState({ fullName: "", phone: "", line1: "", city: "", state: "", pincode: "" });
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const grand = total();
  const input = "w-full border border-ink/20 px-3 py-2 bg-white/60 outline-none focus:border-ink";

  if (done)
    return (
      <div className="px-6 py-24 text-center max-w-md mx-auto">
        <h1 className="font-[family-name:var(--font-display)] text-4xl mb-4">Order placed ✓</h1>
        <p className="text-ink/60">Thank you! We&apos;ll call you on {form.phone} to confirm your order.</p>
        <Link href="/" className="inline-block mt-8 px-8 py-3 bg-ink text-sand hover:bg-clay transition-colors">Continue shopping</Link>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="px-6 py-24 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-4">Your cart is empty</h1>
        <Link href="/category/abayas" className="text-clay underline">Shop now</Link>
      </div>
    );

  const orderItems = items.map((i) => ({
    product: i.productId, name: i.name, price: i.price, size: i.size,
    quantity: i.quantity, image: i.image, measurements: i.measurements || null,
  }));

  const validate = () => {
    if (!form.fullName || !form.phone) { setError("Please fill your name and phone"); return false; }
    setError(""); return true;
  };

  const buildMessage = () => {
    const lines = items.map((i) => {
      let l = `• ${i.name} (${i.size}) x${i.quantity} — ${formatPrice(i.price * i.quantity)}`;
      if (i.measurements) {
        const m = Object.entries(i.measurements).map(([k, v]) => `${k}: ${v}"`).join(", ");
        l += `\n   ↳ Measurements: ${m}`;
      }
      return l;
    }).join("\n");
    return `*New Order — Modora Élan*\n\n${lines}\n\n*Total: ${formatPrice(grand)}*\n\n`
      + `Name: ${form.fullName}\nPhone: ${form.phone}\n`
      + `Address: ${form.line1}, ${form.city}, ${form.state} ${form.pincode}`;
  };

  const orderWhatsApp = () => {
    if (!validate()) return;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(buildMessage())}`, "_blank");
  };

  const placeCOD = async () => {
    if (!validate()) return;
    if (!form.line1) { setError("Please add your address for Cash on Delivery"); return; }
    setPlacing(true);
    try {
      await api.createOrder({ items: orderItems, total: grand, shippingAddress: form });
      clear(); setDone(true);
    } catch (e) { setError(e.message); setPlacing(false); }
  };

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
      {/* Form */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-6">Checkout</h1>
        <div className="space-y-3">
          <input className={input} placeholder="Full name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
          <input className={input} placeholder="Phone (WhatsApp)" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          <input className={input} placeholder="Address (house, street, area)" value={form.line1} onChange={(e) => set("line1", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className={input} placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
            <input className={input} placeholder="State" value={form.state} onChange={(e) => set("state", e.target.value)} />
          </div>
          <input className={input} placeholder="Pincode" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
        </div>
        {error && <p className="text-red-700 text-sm mt-3">{error}</p>}

        <button onClick={orderWhatsApp}
          className="w-full mt-6 py-4 bg-ink text-sand hover:bg-clay transition-colors flex items-center justify-center gap-2">
          Place Order via WhatsApp
        </button>
        <button onClick={placeCOD} disabled={placing}
          className="w-full mt-3 py-3 border border-ink/30 hover:border-ink transition-colors disabled:opacity-50">
          {placing ? "Placing..." : "Cash on Delivery"}
        </button>
      </div>

      {/* Summary */}
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl mb-4">Your Order</h2>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {items.map((i) => (
            <div key={i.id} className="py-3 text-sm">
              <div className="flex justify-between">
                <span>{i.name} <span className="text-ink/50">({i.size}) ×{i.quantity}</span></span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </div>
              {i.measurements && (
                <p className="text-xs text-ink/50 mt-1">
                  {Object.entries(i.measurements).map(([k, v]) => `${k}: ${v}"`).join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-lg">
          <span>Total</span>
          <span className="font-[family-name:var(--font-display)] text-2xl">{formatPrice(grand)}</span>
        </div>
      </div>
    </div>
  );
}
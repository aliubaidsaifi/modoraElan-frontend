"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cartStore";
import { api } from "@/lib/api";
import { userAuth } from "@/lib/userAuth";
import { formatPrice } from "@/lib/utils";

const empty = { fullName: "", phone: "", line1: "", city: "", state: "", pincode: "" };

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [authed, setAuthed] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [view, setView] = useState("form");      // "list" | "form"
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(empty);
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const grand = total();
  const input = "w-full border border-ink/20 px-3 py-2 bg-white/60 outline-none focus:border-ink";

  useEffect(() => {
    if (!userAuth.isLoggedIn()) return;
    setAuthed(true);
    api.getAddresses(userAuth.getToken()).then((d) => {
      const addrs = d?.addresses || [];
      setAddresses(addrs);
      if (addrs.length) {
        setView("list");
        const def = addrs.find((a) => a.isDefault) || addrs[0];
        setSelectedId(def._id);
      }
    }).catch(() => {});
  }, []);

  if (done)
    return (
      <div className="px-6 py-24 text-center max-w-md mx-auto">
        <h1 className="font-[family-name:var(--font-display)] text-4xl mb-4">Order placed ✓</h1>
        <p className="text-ink/60">Thank you! We&apos;ll call you to confirm your order.</p>
        <Link href="/account" className="inline-block mt-8 px-8 py-3 bg-ink text-sand hover:bg-clay transition-colors">View my orders</Link>
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

  const placeOrder = async () => {
    setError("");
    let address;
    if (view === "list") {
      address = addresses.find((a) => a._id === selectedId);
      if (!address) return setError("Please select a delivery address");
    } else {
      if (!form.fullName || !form.phone || !form.line1) return setError("Please fill name, phone and address");
      address = form;
    }
    setPlacing(true);
    try {
      const token = authed ? userAuth.getToken() : null;
      if (authed && view === "form") {
        try { await api.addAddress(form, token); } catch {}
      }
      await api.createOrder(
        { items: orderItems, total: grand, shippingAddress: address, paymentMethod: "COD" },
        token
      );
      clear();
      setDone(true);
    } catch (e) {
      setError(e.message || "Could not place order. Please try again.");
      setPlacing(false);
    }
  };

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-6">Checkout</h1>

        {authed && view === "list" ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm uppercase tracking-widest text-ink/50">Delivery address</h2>
              <button onClick={() => { setForm(empty); setView("form"); }} className="text-sm text-clay hover:underline">+ Add new</button>
            </div>
            <div className="space-y-3">
              {addresses.map((a) => (
                <label key={a._id} className={`block border p-4 cursor-pointer transition-colors ${selectedId === a._id ? "border-ink bg-white/60" : "border-ink/15"}`}>
                  <div className="flex gap-3">
                    <input type="radio" checked={selectedId === a._id} onChange={() => setSelectedId(a._id)} className="mt-1" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {a.fullName} · {a.phone}
                        {a.isDefault && <span className="text-xs text-clay ml-2">Default</span>}
                      </p>
                      <p className="text-ink/60 mt-0.5">{a.line1}, {a.city}, {a.state} {a.pincode}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm uppercase tracking-widest text-ink/50">{authed ? "Add a new address" : "Delivery address"}</h2>
              {authed && addresses.length > 0 && (
                <button onClick={() => setView("list")} className="text-sm text-clay hover:underline">← Saved addresses</button>
              )}
            </div>
            <div className="space-y-3">
              <input className={input} placeholder="Full name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
              <input className={input} placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              <input className={input} placeholder="Address (house, street, area)" value={form.line1} onChange={(e) => set("line1", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input className={input} placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
                <input className={input} placeholder="State" value={form.state} onChange={(e) => set("state", e.target.value)} />
              </div>
              <input className={input} placeholder="Pincode" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
            </div>
          </div>
        )}

        {error && <p className="text-red-700 text-sm mt-3">{error}</p>}

        <button onClick={placeOrder} disabled={placing}
          className="w-full mt-6 py-4 bg-ink text-sand hover:bg-clay transition-colors disabled:opacity-50">
          {placing ? "Placing order..." : "Place Order"}
        </button>
        <p className="text-xs text-ink/50 mt-3 text-center">Cash on Delivery · Pay when your order arrives</p>
      </div>

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
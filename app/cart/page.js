"use client";
import { useCart } from "@/lib/cartStore";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function CartPage() {
  const { items, remove, total } = useCart();

  if (items.length === 0)
    return (
      <div className="px-6 py-24 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-4">Your cart is empty</h1>
        <Link href="/category/abayas" className="text-clay underline">Continue shopping</Link>
      </div>
    );

  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] text-4xl mb-8">Cart</h1>
      <div className="divide-y divide-ink/10">
        {items.map((i) => (
          <div key={i.id} className="flex justify-between items-start py-4">
            <div>
              <p>{i.name}</p>
              <p className="text-sm text-ink/50">Size {i.size} · Qty {i.quantity}</p>
              {i.measurements && (
                <p className="text-xs text-ink/50 mt-1">
                  {Object.entries(i.measurements).map(([k, v]) => `${k}: ${v}"`).join(" · ")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>{formatPrice(i.price * i.quantity)}</span>
              <button onClick={() => remove(i.id)} className="text-ink/40 hover:text-ink text-sm">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8 text-lg">
        <span>Total</span>
        <span className="font-[family-name:var(--font-display)] text-2xl">{formatPrice(total())}</span>
      </div>
      <Link href="/checkout"
        className="block text-center w-full mt-6 py-3 bg-ink text-sand hover:bg-clay transition-colors">
        Proceed to Checkout
      </Link>
    </div>
  );
}
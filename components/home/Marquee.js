"use client";
export default function Marquee({ items, dark }) {
  const text = items.join("\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0") + "\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0";
  return (
    <div className={`overflow-hidden whitespace-nowrap py-3 ${dark ? "bg-clay text-sand" : "bg-ink/[0.04] text-ink"}`}>
      <div className="inline-flex w-max animate-[marquee_30s_linear_infinite]">
        <span className="text-xs md:text-sm tracking-[0.2em] uppercase">{text.repeat(4)}</span>
        <span className="text-xs md:text-sm tracking-[0.2em] uppercase">{text.repeat(4)}</span>
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
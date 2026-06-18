import Link from "next/link";

export default function Hero({ banner }) {
  const title = banner?.title || "Elegant Modest Fashion";
  const subtitle = banner?.subtitle || "Thoughtfully crafted abayas, designed for the modern woman.";
  const ctaText = banner?.ctaText || "Shop Now";
  const ctaLink = banner?.ctaLink || "/search";
  const image = banner?.image || "/hero.jpg";

  return (
    <section className="relative h-[78vh] min-h-[520px] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-[#3a2e26] to-clay" />
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/10" />
      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-xl">
          <p className="text-sand/70 uppercase tracking-[0.35em] text-xs mb-5">Modora Élan</p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl text-sand leading-[1.02]">{title}</h1>
          <p className="text-sand/80 text-lg md:text-xl mt-5 max-w-md">{subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href={ctaLink} className="px-10 py-4 bg-sand text-ink hover:bg-clay hover:text-sand transition-colors tracking-wide">{ctaText}</Link>
            <Link href="/search" className="px-10 py-4 border border-sand/40 text-sand hover:bg-sand/10 transition-colors tracking-wide">New Arrivals</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
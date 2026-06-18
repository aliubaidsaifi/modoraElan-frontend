import Link from "next/link";

export const metadata = { title: "Kids — Coming Soon | Modora Élan" };

export default function KidsPage() {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center px-6 text-center overflow-hidden bg-sand">
      <div className="max-w-lg">
        <p className="uppercase tracking-[0.4em] text-xs text-clay mb-5">Modora Élan · Kids</p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl leading-tight">
          Little Élan<br />is on its way
        </h1>
        <p className="text-ink/60 mt-6 leading-relaxed">
          Modest, comfortable, beautifully crafted wear for little ones — coming soon to Modora Élan.
          The same care, in smaller sizes.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/search" className="px-8 py-3.5 bg-ink text-sand hover:bg-clay transition-colors">Shop Women&apos;s</Link>
          <Link href="/" className="px-8 py-3.5 border border-ink/20 hover:border-ink transition-colors">Back Home</Link>
        </div>
        <div className="mt-14 flex items-center justify-center gap-3 text-ink/40 text-sm">
          <span className="w-10 h-px bg-ink/20" /> Launching soon <span className="w-10 h-px bg-ink/20" />
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-sand border-t border-ink/10">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
        <img src="/logo-me-badge.svg" alt="" className="h-12 w-12 mb-3" />
          <p className="font-[family-name:var(--font-display)] text-2xl">Modora Élan</p>
          <p className="text-sm text-ink/50 mt-3 max-w-xs">
            Modest wear, thoughtfully crafted in Delhi.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/40 mb-4">Shop</p>
          <ul className="space-y-2 text-sm text-ink/70">
            <li><Link href="/category/abayas" className="hover:text-clay">Abayas</Link></li>
            <li><Link href="/" className="hover:text-clay">New In</Link></li>
            <li><Link href="/blog" className="hover:text-clay">Journal</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/40 mb-4">Help</p>
          <ul className="space-y-2 text-sm text-ink/70">
            <li><Link href="/" className="hover:text-clay">Shipping &amp; Returns</Link></li>
            <li><Link href="/" className="hover:text-clay">Size Guide</Link></li>
            <li><Link href="/" className="hover:text-clay">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/40 mb-4">Connect</p>
          <ul className="space-y-2 text-sm text-ink/70">
            <li><a href="#" className="hover:text-clay">Instagram</a></li>
            <li><a href="#" className="hover:text-clay">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10 py-6 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} Modora Élan · Crafted with care in Delhi.
      </div>
    </footer>
  );
}
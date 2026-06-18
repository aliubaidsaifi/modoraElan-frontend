import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }) {
  const img = product.images?.[0] || "https://res.cloudinary.com/demo/image/upload/v1/placeholder.jpg";
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
        <Image src={img} alt={product.name} fill sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105" />
        {product.compareAtPrice > product.price && (
          <span className="absolute top-3 left-3 bg-clay text-sand text-[10px] px-2 py-1 tracking-wide">SALE</span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-sm">{product.name}</h3>
        <div className="flex gap-2 items-baseline mt-1">
          <p className="text-sm text-ink/70">{formatPrice(product.price)}</p>
          {product.compareAtPrice > product.price && (
            <p className="text-xs text-ink/40 line-through">{formatPrice(product.compareAtPrice)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

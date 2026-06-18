import ProductCard from "./ProductCard";
export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
      {products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}

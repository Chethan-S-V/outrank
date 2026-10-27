import type { PublicProduct } from "@/services/products";
import { ProductCard } from "./product-card";
export function ProductGrid({ products }: { products: PublicProduct[] }) { return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.slug} product={product} />)}</div>; }

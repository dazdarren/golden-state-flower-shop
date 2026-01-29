import { Product } from '@/types/floristOne';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  basePath: string;
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  basePath,
  emptyMessage = 'No arrangements available',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          className="w-16 h-16 text-sage-300 mb-4"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 12c0 10-6 16-6 22s3 10 6 10 6-4 6-10-6-12-6-22z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M32 16c-5 6-10 12-10 18s3 8 10 8 10-2 10-8-5-12-10-18z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M22 32c3-1.5 6 0 10 3M42 32c-3-1.5-6 0-10 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className="font-display text-xl text-forest-800/60">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {products.map((product, index) => (
        <ProductCard
          key={product.sku}
          product={product}
          basePath={basePath}
          index={index}
        />
      ))}
    </div>
  );
}

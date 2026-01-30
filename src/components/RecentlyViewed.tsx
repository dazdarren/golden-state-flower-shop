'use client';

import Link from 'next/link';
import { useRecentlyViewed, RecentlyViewedProduct } from '@/hooks/useRecentlyViewed';

interface RecentlyViewedProps {
  basePath: string;
  currentSku?: string; // Exclude current product if on product page
  maxItems?: number;
  className?: string;
}

export default function RecentlyViewed({
  basePath,
  currentSku,
  maxItems = 6,
  className = "",
}: RecentlyViewedProps) {
  const { products, isLoaded } = useRecentlyViewed();

  // Filter out current product and limit items
  const displayProducts = products
    .filter((p) => p.sku !== currentSku)
    .slice(0, maxItems);

  if (!isLoaded || displayProducts.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="container-wide">
        <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
          Recently Viewed
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayProducts.map((product) => (
            <RecentlyViewedCard
              key={product.sku}
              product={product}
              basePath={basePath}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentlyViewedCard({
  product,
  basePath,
}: {
  product: RecentlyViewedProduct;
  basePath: string;
}) {
  return (
    <Link
      href={`${basePath}/product?sku=${product.sku}`}
      className="group block"
    >
      <div className="aspect-square bg-cream-100 rounded-xl overflow-hidden mb-2">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-sage-300" viewBox="0 0 64 64" fill="none">
              <path d="M32 12c0 10-6 16-6 22s3 10 6 10 6-4 6-10-6-12-6-22z" fill="currentColor" opacity="0.3"/>
              <path d="M32 16c-5 6-10 12-10 18s3 8 10 8 10-2 10-8-5-12-10-18z" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-forest-900 line-clamp-2 group-hover:text-sage-700 transition-colors">
        {product.name}
      </h3>
      <p className="text-sm font-semibold text-forest-900 mt-1">
        ${product.price.toFixed(2)}
      </p>
    </Link>
  );
}

// Hook to track product views - use this on product pages
export { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

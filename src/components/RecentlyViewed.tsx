'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface RecentlyViewedProduct {
  sku: string;
  name: string;
  price: number;
  image: string;
  viewedAt: number;
}

interface RecentlyViewedProps {
  basePath: string;
  currentSku?: string; // Exclude current product if on product page
  maxItems?: number;
  title?: string;
}

export default function RecentlyViewed({
  basePath,
  currentSku,
  maxItems = 4,
  title = 'Recently Viewed',
}: RecentlyViewedProps) {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        const parsed = JSON.parse(stored) as RecentlyViewedProduct[];
        // Filter out current product and limit
        const filtered = parsed
          .filter((p) => p.sku !== currentSku)
          .slice(0, maxItems);
        setProducts(filtered);
      }
    } catch (e) {
      console.error('Failed to load recently viewed:', e);
    }
  }, [currentSku, maxItems]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-forest-900">{title}</h2>
          <button
            onClick={() => {
              localStorage.removeItem('recentlyViewed');
              setProducts([]);
            }}
            className="text-sm text-forest-800/50 hover:text-forest-800 transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, index) => (
            <Link
              key={product.sku}
              href={`${basePath}/product?sku=${product.sku}`}
              className="group bg-white rounded-2xl overflow-hidden border border-cream-200
                       hover:border-sage-300 hover:shadow-soft-lg transition-all duration-300"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Image */}
              <div className="relative aspect-square bg-cream-100 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-100 to-cream-100">
                    <svg className="w-12 h-12 text-sage-300" viewBox="0 0 64 64" fill="none">
                      <path d="M32 12c0 10-6 16-6 22s3 10 6 10 6-4 6-10-6-12-6-22z" fill="currentColor" opacity="0.3"/>
                      <path d="M32 16c-5 6-10 12-10 18s3 8 10 8 10-2 10-8-5-12-10-18z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  </div>
                )}

                {/* Viewed indicator */}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm
                              flex items-center justify-center">
                  <svg className="w-3 h-3 text-forest-800/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium text-forest-900 text-sm line-clamp-2 mb-1 group-hover:text-sage-700 transition-colors">
                  {product.name}
                </h3>
                <p className="font-display text-lg font-semibold text-forest-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

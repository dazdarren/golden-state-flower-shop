'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/floristOne';

interface ApiProduct {
  sku: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageLarge: string;
  dimension?: string;
}

interface DynamicProductGridProps {
  basePath: string;
  occasion?: string;
  count?: number;
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-cream-200 rounded-2xl mb-4" />
      <div className="h-4 bg-cream-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-cream-200 rounded w-1/2" />
    </div>
  );
}

export default function DynamicProductGrid({
  basePath,
  occasion = 'best-sellers',
  count = 8,
}: DynamicProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api${basePath}/products?occasion=${occasion}&count=${count}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        if (data.success && data.data?.products) {
          // Transform API products to match our Product type
          const transformedProducts: Product[] = data.data.products.map((p: ApiProduct) => ({
            sku: p.sku,
            name: p.name,
            description: p.description,
            price: p.price,
            images: {
              small: p.image,
              medium: p.imageLarge,
              large: p.imageLarge,
            },
            category: occasion,
            occasions: [occasion],
            available: true,
          }));
          setProducts(transformedProducts);
        } else {
          setError(data.error || 'No products available');
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Unable to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [basePath, occasion, count]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error || products.length === 0) {
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
        </svg>
        <p className="font-display text-xl text-forest-800/60">
          {error || 'No arrangements available'}
        </p>
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

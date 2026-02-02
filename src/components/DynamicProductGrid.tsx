'use client';

import { useEffect, useState, useCallback } from 'react';
import ProductCard from './ProductCard';
import ProductFilters, { SortOption } from './ProductFilters';
import QuickViewModal from './QuickViewModal';
import DeliveryDateSelector from './DeliveryDateSelector';
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
  showFilters?: boolean;
  showDeliveryDate?: boolean;
  initialSort?: SortOption;
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
  showFilters = false,
  showDeliveryDate = false,
  initialSort = 'default',
}: DynamicProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      // Build query string with filters
      const params = new URLSearchParams({
        occasion,
        count: count.toString(),
        sort,
      });

      if (priceMin !== null) params.set('priceMin', priceMin.toString());
      if (priceMax !== null) params.set('priceMax', priceMax.toString());

      const response = await fetch(`/api${basePath}/products?${params.toString()}`);

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
          dimension: p.dimension,
        }));
        setProducts(transformedProducts);
        setTotalCount(data.data.total || transformedProducts.length);
      } else {
        setError(data.error || 'No products available');
        setProducts([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Unable to load products');
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [basePath, occasion, count, sort, priceMin, priceMax]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Track product views for recently viewed
  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);

    // Save to recently viewed
    try {
      const stored = localStorage.getItem('recentlyViewed');
      const existing = stored ? JSON.parse(stored) : [];
      const filtered = existing.filter((p: { sku: string }) => p.sku !== product.sku);
      const updated = [
        {
          sku: product.sku,
          name: product.name,
          price: product.price,
          image: product.images.medium || product.images.small || '',
          viewedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, 12);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to recently viewed:', e);
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
  };

  const handlePriceFilterChange = (min: number | null, max: number | null) => {
    setPriceMin(min);
    setPriceMax(max);
  };

  if (loading && products.length === 0) {
    return (
      <>
        {showDeliveryDate && (
          <div className="mb-8">
            <DeliveryDateSelector basePath={basePath} compact />
          </div>
        )}
        {showFilters && (
          <div className="mb-8 pb-6 border-b border-cream-200">
            <div className="h-10 bg-cream-200 rounded animate-pulse w-64" />
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {Array.from({ length: count }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </>
    );
  }

  if (error && products.length === 0) {
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
    <>
      {showDeliveryDate && (
        <div className="mb-8">
          <DeliveryDateSelector
            basePath={basePath}
            compact
            selectedDate={selectedDeliveryDate}
            onDateSelect={setSelectedDeliveryDate}
          />
        </div>
      )}

      {showFilters && (
        <ProductFilters
          onSortChange={handleSortChange}
          onPriceFilterChange={handlePriceFilterChange}
          currentSort={sort}
          currentPriceMin={priceMin}
          currentPriceMax={priceMax}
          productCount={totalCount}
        />
      )}

      {products.length === 0 ? (
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
            No products match your filters
          </p>
          <button
            onClick={() => {
              setPriceMin(null);
              setPriceMax(null);
              setSort('default');
            }}
            className="mt-4 text-sage-600 hover:text-sage-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 ${loading ? 'opacity-50' : ''}`}>
          {products.map((product, index) => (
            <ProductCard
              key={product.sku}
              product={product}
              basePath={basePath}
              index={index}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
      )}

      {loading && products.length > 0 && (
        <div className="fixed top-4 right-4 bg-forest-900 text-white px-4 py-2 rounded-full text-sm shadow-lg z-50">
          Updating...
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        basePath={basePath}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}

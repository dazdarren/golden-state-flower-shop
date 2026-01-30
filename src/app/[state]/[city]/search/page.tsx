'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import ProductFilters, { SortOption } from '@/components/ProductFilters';
import { Product } from '@/types/floristOne';
import { OCCASIONS, PRODUCT_TYPES, SEASONAL } from '@/data/categories';

interface SearchPageProps {
  params: {
    state: string;
    city: string;
  };
}

interface ApiProduct {
  sku: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageLarge: string;
  category?: string;
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

function SearchResultsContent({ params }: SearchPageProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const basePath = `/${params.state}/${params.city}`;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>('default');
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);

  const fetchResults = useCallback(async () => {
    if (!query || query.length < 2) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api${basePath}/search?q=${encodeURIComponent(query)}&count=24`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      if (data.success && data.data?.products) {
        let transformedProducts: Product[] = data.data.products.map((p: ApiProduct) => ({
          sku: p.sku,
          name: p.name,
          description: p.description,
          price: p.price,
          images: {
            small: p.image,
            medium: p.imageLarge,
            large: p.imageLarge,
          },
          category: p.category,
          occasions: [],
          available: true,
        }));

        // Apply client-side price filtering
        if (priceMin !== null || priceMax !== null) {
          transformedProducts = transformedProducts.filter((p) => {
            if (priceMin !== null && p.price < priceMin) return false;
            if (priceMax !== null && p.price > priceMax) return false;
            return true;
          });
        }

        // Apply client-side sorting
        if (sort === 'price-low') {
          transformedProducts.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
          transformedProducts.sort((a, b) => b.price - a.price);
        } else if (sort === 'name-az') {
          transformedProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'name-za') {
          transformedProducts.sort((a, b) => b.name.localeCompare(a.name));
        }

        setProducts(transformedProducts);
        setError(null);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Unable to search. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [basePath, query, sort, priceMin, priceMax]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const quickLinks = [
    ...OCCASIONS.slice(0, 4).map((o) => ({ href: `${basePath}/flowers/${o.slug}`, label: o.name })),
    ...PRODUCT_TYPES.slice(0, 2).map((t) => ({ href: `${basePath}/shop/${t.slug}`, label: t.name })),
  ];

  return (
    <>
      {/* Search Header */}
      <section className="bg-gradient-to-br from-cream-100 to-cream-50 py-12 lg:py-16">
        <div className="container-wide">
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-forest-800/60">
              <li>
                <Link href={basePath} className="hover:text-forest-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-forest-900 font-medium">Search</li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-semibold text-forest-900 mb-6">
            {query ? `Results for "${query}"` : 'Search Flowers'}
          </h1>

          <SearchBar basePath={basePath} variant="expanded" />

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="text-sm text-forest-800/50">Browse:</span>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm bg-white border border-cream-200
                         text-forest-800 hover:border-sage-300 hover:bg-sage-50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          {!query ? (
            <div className="text-center py-16">
              <svg
                className="w-20 h-20 mx-auto text-sage-300 mb-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h2 className="font-display text-2xl text-forest-800/70 mb-2">
                Start your search
              </h2>
              <p className="text-forest-800/50">
                Type a search term above to find flowers, plants, and arrangements
              </p>
            </div>
          ) : loading ? (
            <>
              <div className="mb-8 pb-6 border-b border-cream-200">
                <div className="h-10 bg-cream-200 rounded animate-pulse w-48" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-rose-600 mb-4">{error}</p>
              <button
                onClick={() => fetchResults()}
                className="text-sage-600 hover:text-sage-700 font-medium"
              >
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="w-20 h-20 mx-auto text-sage-300 mb-6"
                viewBox="0 0 64 64"
                fill="none"
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
              <h2 className="font-display text-2xl text-forest-800/70 mb-2">
                No results found
              </h2>
              <p className="text-forest-800/50 mb-6">
                We couldn&apos;t find any flowers matching &quot;{query}&quot;
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="text-sm text-forest-800/50">Try:</span>
                {['roses', 'birthday', 'sympathy', 'plants'].map((suggestion) => (
                  <Link
                    key={suggestion}
                    href={`${basePath}/search?q=${suggestion}`}
                    className="px-4 py-2 rounded-full text-sm bg-cream-100 text-forest-800
                             hover:bg-cream-200 transition-colors"
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <>
              <ProductFilters
                onSortChange={setSort}
                onPriceFilterChange={(min, max) => {
                  setPriceMin(min);
                  setPriceMax(max);
                }}
                currentSort={sort}
                currentPriceMin={priceMin}
                currentPriceMax={priceMax}
                productCount={products.length}
              />

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
            </>
          )}
        </div>
      </section>

      {/* Related Categories */}
      {query && products.length > 0 && (
        <section className="py-12 lg:py-16 bg-cream-50">
          <div className="container-wide">
            <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
              Continue Shopping
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {OCCASIONS.slice(0, 6).map((occasion) => (
                <Link
                  key={occasion.slug}
                  href={`${basePath}/flowers/${occasion.slug}`}
                  className="p-4 rounded-xl bg-white border border-cream-200 hover:border-sage-300 hover:shadow-soft transition-all text-center"
                >
                  <span className="text-sm font-medium text-forest-900">{occasion.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default function SearchPage({ params }: SearchPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full" />
      </div>
    }>
      <SearchResultsContent params={params} />
    </Suspense>
  );
}

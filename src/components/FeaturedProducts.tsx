'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ApiProduct {
  sku: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageLarge: string;
}

interface FeaturedProductsProps {
  basePath: string;
  occasion?: string;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'dark' | 'highlight';
  maxProducts?: number;
}

export default function FeaturedProducts({
  basePath,
  occasion = 'best-sellers',
  title = 'Featured Picks',
  subtitle = "Editor's Choice",
  variant = 'default',
  maxProducts = 4,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`/api${basePath}/products?occasion=${occasion}&count=${maxProducts}`);
        const data = await response.json();

        if (data.success && data.data?.products) {
          setProducts(data.data.products.slice(0, maxProducts));
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [basePath, occasion, maxProducts]);

  const variantStyles = {
    default: {
      container: 'bg-cream-50',
      title: 'text-forest-900',
      subtitle: 'text-sage-600',
      card: 'bg-white border border-cream-200 hover:border-sage-300 hover:shadow-soft-lg',
      price: 'text-forest-900',
      button: 'bg-forest-900 text-white hover:bg-forest-800',
    },
    dark: {
      container: 'bg-gradient-to-b from-forest-900 to-forest-800 text-cream-100',
      title: 'text-cream-100',
      subtitle: 'text-gold-400',
      card: 'bg-forest-800/50 border border-forest-700 hover:border-gold-500/50 hover:shadow-lg',
      price: 'text-gold-400',
      button: 'bg-gold-500 text-forest-900 hover:bg-gold-400',
    },
    highlight: {
      container: 'bg-gradient-to-br from-sage-100 via-sage-50 to-cream-50',
      title: 'text-forest-900',
      subtitle: 'text-sage-700',
      card: 'bg-white border border-sage-200 hover:border-sage-400 hover:shadow-soft-lg',
      price: 'text-sage-700',
      button: 'bg-sage-600 text-white hover:bg-sage-700',
    },
  };

  const styles = variantStyles[variant];

  if (loading) {
    return (
      <section className={`py-16 lg:py-20 ${styles.container}`}>
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <div className="h-4 w-24 bg-cream-200 rounded animate-pulse mb-3" />
              <div className="h-8 w-48 bg-cream-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: maxProducts }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-cream-200 rounded-2xl mb-4" />
                <div className="h-4 bg-cream-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-cream-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 lg:py-20 ${styles.container}`}>
      {/* Decorative elements for dark variant */}
      {variant === 'dark' && (
        <>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500" />
          <div className="absolute top-10 right-10 w-64 h-64 opacity-5">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1"/>
              <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
        </>
      )}

      <div className="container-wide relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            {subtitle && (
              <div className={`inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest mb-2 ${styles.subtitle}`}>
                {variant === 'dark' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
                {subtitle}
              </div>
            )}
            <h2 className={`font-display text-3xl md:text-4xl font-semibold ${styles.title}`}>
              {title}
            </h2>
          </div>

          <Link
            href={`${basePath}/flowers/${occasion}`}
            className={`group inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${styles.button}`}
          >
            <span>View All</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, index) => (
            <Link
              key={product.sku}
              href={`${basePath}/product?sku=${product.sku}`}
              className={`group rounded-2xl overflow-hidden transition-all duration-300 ${styles.card}`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                {product.imageLarge ? (
                  <img
                    src={product.imageLarge}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-sage-100 to-cream-100 flex items-center justify-center">
                    <svg className="w-16 h-16 text-sage-300" viewBox="0 0 64 64" fill="none">
                      <path d="M32 12c0 10-6 16-6 22s3 10 6 10 6-4 6-10-6-12-6-22z" fill="currentColor" opacity="0.3"/>
                      <path d="M32 16c-5 6-10 12-10 18s3 8 10 8 10-2 10-8-5-12-10-18z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/10 transition-all duration-300 flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/90 rounded-full text-sm font-medium text-forest-900
                                 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0
                                 transition-all duration-300 shadow-soft">
                    Quick View
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className={`font-display text-lg font-medium leading-snug line-clamp-2 mb-2 ${variant === 'dark' ? 'text-cream-100' : 'text-forest-900'}`}>
                  {product.name}
                </h3>
                <p className={`font-display text-xl font-semibold ${styles.price}`}>
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Trust badges for dark variant */}
        {variant === 'dark' && (
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 pt-10 border-t border-forest-700">
            <div className="flex items-center gap-3 text-cream-200/80">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">100% Satisfaction</span>
            </div>
            <div className="flex items-center gap-3 text-cream-200/80">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Same-Day Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-cream-200/80">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <span className="text-sm font-medium">Free Gift Packaging</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { Product } from '@/types/floristOne';
import WishlistButton from './WishlistButton';
import { usePrefetchOnHover } from '@/hooks/usePrefetch';
import { useCompare } from '@/context/CompareContext';

interface ProductCardProps {
  product: Product;
  basePath: string;
  index?: number;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, basePath, index = 0, onQuickView }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const productUrl = `${basePath}/product?sku=${product.sku}`;
  const { onMouseEnter, onFocus } = usePrefetchOnHover(productUrl);
  const { addProduct, removeProduct, isInCompare, canAdd } = useCompare();
  const inCompare = isInCompare(product.sku);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeProduct(product.sku);
    } else {
      addProduct({
        sku: product.sku,
        name: product.name,
        price: product.price,
        image: product.images.medium || product.images.small || '',
        description: product.description,
      });
    }
  };

  return (
    <div
      className="group product-card flex flex-col opacity-0 animate-fade-up relative"
      style={{
        animationDelay: `${index * 80}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <WishlistButton
          sku={product.sku}
          name={product.name}
          price={product.price}
          image={product.images.medium || product.images.small || ''}
          size="sm"
        />
        {/* Compare Button */}
        <button
          onClick={handleCompareToggle}
          disabled={!canAdd && !inCompare}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
            ${inCompare
              ? 'bg-sage-600 text-white'
              : 'bg-white/90 backdrop-blur-sm text-forest-800/60 hover:text-sage-600 hover:bg-white disabled:opacity-50'
            }`}
          title={inCompare ? 'Remove from compare' : canAdd ? 'Add to compare' : 'Compare list full (4 max)'}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>

      <Link
        href={productUrl}
        className="flex flex-col flex-1"
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-200 rounded-2xl">
          {product.images.medium ? (
            <img
              src={product.images.medium}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out
                       group-hover:scale-105"
              loading={index < 4 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={index < 4 ? 'high' : 'auto'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-100 to-cream-200">
              <svg
                className="w-20 h-20 text-sage-300"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M40 15c0 12-8 20-8 28s4 12 8 12 8-4 8-12-8-16-8-28z"
                  fill="currentColor"
                  opacity="0.3"
                />
                <path
                  d="M40 20c-6 8-12 14-12 20s4 10 12 10 12-4 12-10-6-12-12-20z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M28 36c4-2 8 0 12 4M52 36c-4-2-8 0-12 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M40 50v15M35 60l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && (
              <span className="px-2.5 py-1 bg-rose-500 text-white text-[10px] font-semibold uppercase tracking-wider rounded-full">
                Sale
              </span>
            )}
          </div>

          {/* Quick View Overlay */}
          <div
            className="absolute inset-0 bg-forest-900/0 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 group-hover:bg-forest-900/10
                        transition-all duration-300"
          >
            {onQuickView ? (
              <button
                onClick={handleQuickView}
                className="px-5 py-3 bg-white/95 backdrop-blur-sm rounded-full
                         text-sm font-medium text-forest-900
                         transform translate-y-4 group-hover:translate-y-0
                         transition-transform duration-300 shadow-soft
                         hover:bg-white"
              >
                Quick View
              </button>
            ) : (
              <span
                className="px-5 py-3 bg-white/95 backdrop-blur-sm rounded-full
                         text-sm font-medium text-forest-900
                         transform translate-y-4 group-hover:translate-y-0
                         transition-transform duration-300 shadow-soft"
              >
                View Details
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 sm:p-5">
          <h3 className="font-display text-lg font-medium text-forest-900 leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>

          <div className="mt-auto flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold text-forest-900">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-forest-800/40 line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>

          {!product.available && (
            <span className="mt-2 text-xs font-medium text-rose-600">
              Currently unavailable
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

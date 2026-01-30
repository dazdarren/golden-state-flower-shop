'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCompare } from '@/context/CompareContext';

interface CompareDrawerProps {
  basePath: string;
}

export default function CompareDrawer({ basePath }: CompareDrawerProps) {
  const { products, removeProduct, clearAll } = useCompare();
  const [isExpanded, setIsExpanded] = useState(false);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom">
      {/* Collapsed bar */}
      <div
        className={`bg-forest-900 text-white transition-transform duration-300 ${
          isExpanded ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="container-wide">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-between py-3"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Compare ({products.length}/4)
            </span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded drawer */}
      <div
        className={`bg-white border-t border-cream-200 shadow-lg transition-transform duration-300 ${
          isExpanded ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container-wide py-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-forest-900">
              Compare Products ({products.length}/4)
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={clearAll}
                className="text-sm text-forest-800/60 hover:text-forest-800 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 hover:bg-cream-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-forest-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Product cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.sku} className="relative bg-cream-50 rounded-xl p-3">
                <button
                  onClick={() => removeProduct(product.sku)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-cream-200 rounded-full
                           flex items-center justify-center text-forest-800/60 hover:text-rose-500
                           hover:border-rose-200 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="aspect-square bg-white rounded-lg overflow-hidden mb-2">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-sage-300" viewBox="0 0 64 64" fill="none">
                        <path d="M32 12c0 10-6 16-6 22s3 10 6 10 6-4 6-10-6-12-6-22z" fill="currentColor" opacity="0.3"/>
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-forest-900 line-clamp-2">{product.name}</p>
                <p className="text-sm font-bold text-sage-600 mt-1">${product.price.toFixed(2)}</p>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 4 - products.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-[3/4] border-2 border-dashed border-cream-300 rounded-xl
                         flex items-center justify-center text-forest-800/40"
              >
                <span className="text-sm">Add product</span>
              </div>
            ))}
          </div>

          {/* Compare button */}
          {products.length >= 2 && (
            <div className="mt-4 flex justify-center">
              <Link
                href={`${basePath}/compare?skus=${products.map((p) => p.sku).join(',')}`}
                className="px-6 py-2.5 bg-forest-900 text-white rounded-xl font-medium
                         hover:bg-forest-800 transition-colors"
              >
                Compare Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

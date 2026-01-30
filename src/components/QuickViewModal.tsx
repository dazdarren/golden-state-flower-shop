'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/floristOne';

interface QuickViewModalProps {
  product: Product | null;
  basePath: string;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export default function QuickViewModal({
  product,
  basePath,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  // Reset state when product changes
  useEffect(() => {
    setImageLoaded(false);
    setQuantity(1);
  }, [product?.sku]);

  if (!product) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleAddToCart = () => {
    onAddToCart?.(product);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm
                   flex items-center justify-center text-forest-800 hover:bg-white
                   shadow-soft transition-all hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-cream-100">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin" />
              </div>
            )}
            {product.images.large || product.images.medium ? (
              <img
                src={product.images.large || product.images.medium}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-100 to-cream-100">
                <svg className="w-24 h-24 text-sage-300" viewBox="0 0 64 64" fill="none">
                  <path d="M32 12c0 10-6 16-6 22s3 10 6 10 6-4 6-10-6-12-6-22z" fill="currentColor" opacity="0.3"/>
                  <path d="M32 16c-5 6-10 12-10 18s3 8 10 8 10-2 10-8-5-12-10-18z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            )}

            {/* Badges */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-rose-500 text-white text-sm font-semibold rounded-full">
                  Sale
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex-1">
              {/* Category */}
              {product.category && (
                <p className="text-sm text-sage-600 font-medium uppercase tracking-wider mb-2">
                  {product.category.replace(/-/g, ' ')}
                </p>
              )}

              {/* Title */}
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-3">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display text-3xl font-bold text-forest-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-forest-800/40 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-forest-800/70 leading-relaxed mb-6">
                {product.description || 'A beautiful floral arrangement perfect for any occasion.'}
              </p>

              {/* Availability */}
              <div className="flex items-center gap-2 text-sm mb-6">
                {product.available !== false ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-sage-500" />
                    <span className="text-sage-700">In Stock - Same Day Delivery Available</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-rose-700">Currently Unavailable</span>
                  </>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-forest-800/60">Quantity:</span>
                <div className="flex items-center border border-cream-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-forest-800 hover:bg-cream-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-medium text-forest-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center text-forest-800 hover:bg-cream-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.available === false}
                className="w-full py-4 bg-forest-900 text-white font-medium rounded-xl
                         hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>

              <Link
                href={`${basePath}/product?sku=${product.sku}`}
                className="block w-full py-3 text-center border border-cream-200 rounded-xl
                         text-forest-800 font-medium hover:border-sage-300 hover:bg-sage-50
                         transition-all"
                onClick={onClose}
              >
                View Full Details
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-cream-100">
              <div className="flex items-center gap-2 text-xs text-forest-800/50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Same-Day Delivery
              </div>
              <div className="flex items-center gap-2 text-xs text-forest-800/50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Freshness Guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

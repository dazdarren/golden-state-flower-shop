'use client';

import Link from 'next/link';
import { useWishlist, WishlistItem } from '@/context/WishlistContext';

function WishlistItemCard({ item, onRemove }: { item: WishlistItem; onRemove: (sku: string) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden group">
      <Link href={`/ca/san-francisco/product?sku=${item.sku}`} className="block">
        <div className="aspect-[4/5] bg-cream-100 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-sage-300" viewBox="0 0 64 64" fill="none">
                <path d="M32 12c0 10-6 16-6 22s3 10 6 10 6-4 6-10-6-12-6-22z" fill="currentColor" opacity="0.3"/>
                <path d="M32 16c-5 6-10 12-10 18s3 8 10 8 10-2 10-8-5-12-10-18z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/ca/san-francisco/product?sku=${item.sku}`}>
          <h3 className="font-display text-lg font-medium text-forest-900 line-clamp-2 hover:text-sage-700 transition-colors">
            {item.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-xl font-semibold text-forest-900">
            ${item.price.toFixed(2)}
          </span>

          <button
            onClick={() => onRemove(item.sku)}
            className="p-2 rounded-lg text-forest-800/40 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            aria-label="Remove from wishlist"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <Link
          href={`/ca/san-francisco/product?sku=${item.sku}`}
          className="mt-4 block w-full py-2.5 text-center text-sm font-medium text-white bg-forest-900 rounded-xl hover:bg-forest-800 transition-colors"
        >
          View Product
        </Link>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-cream-200 p-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-forest-800/60 mb-6 max-w-md mx-auto">
            Save your favorite flowers and arrangements to your wishlist so you can easily find them later.
          </p>
          <Link
            href="/ca/san-francisco"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Flowers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-forest-900">
              My Wishlist
            </h1>
            <p className="text-forest-800/60 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          <button
            onClick={clearWishlist}
            className="text-sm text-forest-800/60 hover:text-rose-500 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <WishlistItemCard
            key={item.sku}
            item={item}
            onRemove={removeFromWishlist}
          />
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="text-center pt-4">
        <Link
          href="/ca/san-francisco"
          className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

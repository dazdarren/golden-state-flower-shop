'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RecentlyViewedProduct {
  sku: string;
  name: string;
  price: number;
  image: string;
  viewedAt: number;
}

const STORAGE_KEY = 'recentlyViewed';
const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentlyViewedProduct[];
        // Filter out items older than 30 days
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recent = parsed.filter((p) => p.viewedAt > thirtyDaysAgo);
        setProducts(recent);
      }
    } catch (e) {
      console.error('Failed to load recently viewed:', e);
    }
  }, []);

  // Add a product to recently viewed
  const addProduct = useCallback((product: Omit<RecentlyViewedProduct, 'viewedAt'>) => {
    setProducts((prev) => {
      // Remove existing entry for this product
      const filtered = prev.filter((p) => p.sku !== product.sku);

      // Add to beginning with current timestamp
      const updated = [
        { ...product, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, MAX_ITEMS);

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recently viewed:', e);
      }

      return updated;
    });
  }, []);

  // Clear all recently viewed
  const clearAll = useCallback(() => {
    setProducts([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear recently viewed:', e);
    }
  }, []);

  return {
    products,
    addProduct,
    clearAll,
  };
}

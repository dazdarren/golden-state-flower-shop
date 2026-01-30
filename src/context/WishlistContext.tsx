'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface WishlistItem {
  sku: string;
  name: string;
  price: number;
  image: string;
  addedAt: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (sku: string) => boolean;
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (sku: string) => void;
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save wishlist:', e);
      }
    }
  }, [items, isLoaded]);

  const isInWishlist = useCallback((sku: string) => {
    return items.some((item) => item.sku === sku);
  }, [items]);

  const addToWishlist = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    setItems((prev) => {
      if (prev.some((p) => p.sku === item.sku)) {
        return prev;
      }
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  }, []);

  const removeFromWishlist = useCallback((sku: string) => {
    setItems((prev) => prev.filter((item) => item.sku !== sku));
  }, []);

  const toggleWishlist = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.sku === item.sku);
      if (exists) {
        return prev.filter((p) => p.sku !== item.sku);
      }
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        count: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

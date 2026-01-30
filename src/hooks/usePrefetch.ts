'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Prefetch routes on hover/focus for faster navigation
 */
export function usePrefetch() {
  const router = useRouter();
  const prefetchedRef = useRef<Set<string>>(new Set());

  const prefetch = useCallback(
    (href: string) => {
      if (prefetchedRef.current.has(href)) return;
      prefetchedRef.current.add(href);
      router.prefetch(href);
    },
    [router]
  );

  return { prefetch };
}

/**
 * Hook to prefetch a route on element hover
 */
export function usePrefetchOnHover(href: string) {
  const { prefetch } = usePrefetch();

  const onMouseEnter = useCallback(() => {
    prefetch(href);
  }, [href, prefetch]);

  const onFocus = useCallback(() => {
    prefetch(href);
  }, [href, prefetch]);

  return { onMouseEnter, onFocus };
}

/**
 * Prefetch routes that are visible in the viewport
 */
export function usePrefetchVisible(hrefs: string[]) {
  const { prefetch } = usePrefetch();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<Element, string>>(new Map());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const href = elementsRef.current.get(entry.target);
            if (href) {
              prefetch(href);
              observerRef.current?.unobserve(entry.target);
              elementsRef.current.delete(entry.target);
            }
          }
        });
      },
      { rootMargin: '100px' }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [prefetch]);

  const registerElement = useCallback((element: Element | null, href: string) => {
    if (!element || !observerRef.current) return;
    elementsRef.current.set(element, href);
    observerRef.current.observe(element);
  }, []);

  return { registerElement };
}

/**
 * Prefetch common routes on idle
 */
export function usePrefetchOnIdle(hrefs: string[]) {
  const { prefetch } = usePrefetch();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefetchAll = () => {
      hrefs.forEach((href) => prefetch(href));
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetchAll, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(prefetchAll, 2000);
      return () => clearTimeout(id);
    }
  }, [hrefs, prefetch]);
}

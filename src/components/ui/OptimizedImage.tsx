'use client';

import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  aspectRatio?: string;
}

/**
 * Generate a tiny blur placeholder SVG
 */
function generateBlurPlaceholder(width = 10, height = 10): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1" />
      </filter>
      <rect width="100%" height="100%" fill="#E8EBE3" filter="url(#b)" />
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg.trim())}`;
}

/**
 * OptimizedImage component with lazy loading and blur placeholder
 *
 * Features:
 * - Native lazy loading with intersection observer fallback
 * - Blur placeholder during load
 * - Smooth fade-in animation on load
 * - Error state handling
 * - Priority loading for above-the-fold images
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  sizes,
  aspectRatio,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const placeholderSrc = blurDataURL || generateBlurPlaceholder();

  const containerStyle: React.CSSProperties = {
    aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined),
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-cream-200 ${className}`}
      style={containerStyle}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg"
        />
      )}

      {/* Main image */}
      {(isInView || priority) && !hasError && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover
            transition-opacity duration-500 ease-out
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream-100">
          <svg
            className="w-12 h-12 text-sage-300"
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
        </div>
      )}

      {/* Loading shimmer overlay */}
      {!isLoaded && !hasError && (isInView || priority) && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      )}
    </div>
  );
}

export default OptimizedImage;

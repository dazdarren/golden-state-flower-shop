'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-cream-200';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * Product card skeleton for loading states
 */
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <Skeleton variant="rounded" className="aspect-[4/5] mb-4" animation="none" />
      <Skeleton variant="text" className="w-3/4 mb-2" animation="none" />
      <Skeleton variant="text" className="w-1/2" animation="none" />
    </div>
  );
}

/**
 * Text content skeleton
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-2/3' : 'w-full'}
          animation="none"
        />
      ))}
    </div>
  );
}

/**
 * Card skeleton for generic card loading
 */
export function CardSkeleton({ hasImage = true }: { hasImage?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden animate-pulse">
      {hasImage && <Skeleton variant="rectangular" className="aspect-video" animation="none" />}
      <div className="p-6 space-y-3">
        <Skeleton variant="text" className="w-2/3 h-6" animation="none" />
        <Skeleton variant="text" className="w-full" animation="none" />
        <Skeleton variant="text" className="w-4/5" animation="none" />
      </div>
    </div>
  );
}

/**
 * Form field skeleton
 */
export function FormFieldSkeleton() {
  return (
    <div className="animate-pulse">
      <Skeleton variant="text" className="w-24 h-4 mb-2" animation="none" />
      <Skeleton variant="rounded" className="w-full h-12" animation="none" />
    </div>
  );
}

export default Skeleton;

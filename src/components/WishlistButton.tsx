'use client';

import { useWishlist } from '@/context/WishlistContext';

interface WishlistButtonProps {
  sku: string;
  name: string;
  price: number;
  image: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function WishlistButton({
  sku,
  name,
  price,
  image,
  size = 'md',
  className = '',
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(sku);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ sku, name, price, image });
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center
                transition-all duration-300 ${className}
                ${isWishlisted
                  ? 'bg-rose-500 text-white shadow-soft hover:bg-rose-600'
                  : 'bg-white/90 backdrop-blur-sm text-forest-800/60 hover:text-rose-500 hover:bg-white shadow-soft'
                }`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className={`${iconSizes[size]} transition-transform ${isWishlisted ? 'scale-110' : 'hover:scale-110'}`}
        fill={isWishlisted ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={isWishlisted ? 0 : 1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

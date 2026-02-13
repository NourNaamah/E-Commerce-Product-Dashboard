'use client';

import Image from 'next/image';
import type { Product } from '@/types/product';
import {
  getStockStatus,
  getStockBadgeColor,
  getDiscountedPrice,
  formatCurrency,
  generateStarRating,
} from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({
  product,
  onProductClick,
  onAddToCart,
}: ProductCardProps) {
  const stockStatus = getStockStatus(product.stock);
  const badgeColor = getStockBadgeColor(stockStatus);
  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const stars = generateStarRating(product.rating);

  const handleCardClick = () => {
    onProductClick(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
      aria-label={`View details for ${product.title}`}
    >
      {/* Product Image */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-2.5 py-1 rounded-md text-sm font-bold shadow-md">
            -{product.discountPercentage.toFixed(2)}%
          </div>
        )}
        <div
          className={`absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${badgeColor}`}
        >
          {stockStatus}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4 space-y-2">
        {/* Category Tag */}
        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {product.category}
        </span>

        {/* Product Title */}
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {stars.map((filled, index) => (
            <svg
              key={index}
              className={`h-4 w-4 ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(discountedPrice)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={stockStatus === 'Out of Stock'}
          className="mt-auto w-full rounded-md bg-gradient-to-r from-orange to-rose px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 transition-all"
          aria-label={`Add ${product.title} to cart`}
        >
          {stockStatus === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}

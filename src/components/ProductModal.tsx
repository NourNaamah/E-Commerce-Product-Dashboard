'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';
import {
  getStockStatus,
  getStockBadgeColor,
  getDiscountedPrice,
  formatCurrency,
  generateStarRating,
} from '@/lib/utils';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?.id]);

  if (!isOpen || !product) return null;

  const stockStatus = getStockStatus(product.stock);
  const badgeColor = getStockBadgeColor(stockStatus);
  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const stars = generateStarRating(product.rating);
  const displayedReviews = product.reviews.slice(0, 3);

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white dark:bg-gray-700 p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close modal"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="grid gap-8 p-8 md:grid-cols-2">
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.images[selectedImageIndex] || product.thumbnail}
                alt={`${product.title} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
              {product.discountPercentage > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  -{product.discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${selectedImageIndex === index
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Category & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {product.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium leading-[3rem] dark:text-gray-100 ${badgeColor}`}
              >
                {stockStatus} ({product.stock} left)
              </span>
            </div>

            {/* Title */}
            <h2
              id="modal-title"
              className="text-3xl font-bold text-gray-900 dark:text-gray-100"
            >
              {product.title}
            </h2>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {stars.map((filled, index) => (
                  <svg
                    key={index}
                    className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.rating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(discountedPrice)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-200 dark:border-gray-700 py-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Brand</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {product.brand || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">SKU</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{product.sku}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{product.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dimensions</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {product.dimensions.width} × {product.dimensions.height} ×{' '}
                  {product.dimensions.depth} cm
                </p>
              </div>
            </div>

            {/* Warranty & Shipping */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Warranty</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {product.warrantyInformation}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Shipping</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {product.shippingInformation}
                  </p>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={stockStatus === 'Out of Stock'}
              className="w-full rounded-lg bg-gradient-to-r from-orange to-rose px-6 py-3 text-lg font-medium text-white shadow-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 transition-all"
            >
              {stockStatus === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Customer Reviews */}
            {displayedReviews.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Customer Reviews
                </h3>
                <div className="space-y-4">
                  {displayedReviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-gray-200 dark:border-gray-700 pl-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {review.reviewerName}
                        </p>
                        <div className="flex items-center">
                          {generateStarRating(review.rating).map(
                            (filled, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

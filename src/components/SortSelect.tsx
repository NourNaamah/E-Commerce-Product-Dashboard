'use client';

import type { SortOption, OrderOption } from '@/types/product';

interface SortSelectProps {
  onSortChange: (sortBy: SortOption, order: OrderOption) => void;
}

export function SortSelect({ onSortChange }: SortSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    switch (value) {
      case 'price-asc':
        onSortChange('price', 'asc');
        break;
      case 'price-desc':
        onSortChange('price', 'desc');
        break;
      case 'title-asc':
        onSortChange('title', 'asc');
        break;
      case 'title-desc':
        onSortChange('title', 'desc');
        break;
      case 'rating-desc':
        onSortChange('rating', 'desc');
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>
      <select
        id="sort-select"
        onChange={handleChange}
        defaultValue=""
        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
      >
        <option value="" disabled>
          Sort by
        </option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="title-asc">Title: A-Z</option>
        <option value="title-desc">Title: Z-A</option>
        <option value="rating-desc">Rating: Highest First</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

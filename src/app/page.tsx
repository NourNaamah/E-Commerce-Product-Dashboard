'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchCategories } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SortSelect } from '@/components/SortSelect';
import { Pagination } from '@/components/Pagination';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';
import { Toast } from '@/components/Toast';
import { useCart } from '@/hooks/useCart';
import type { Product, SortOption, OrderOption } from '@/types/product';

const PRODUCTS_PER_PAGE = 12;

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption | undefined>(undefined);
  const [order, setOrder] = useState<OrderOption>('asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { addToCart } = useCart();

  // Fetch products
  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: [
      'products',
      currentPage,
      searchQuery,
      selectedCategory,
      sortBy,
      order,
    ],
    queryFn: () =>
      fetchProducts({
        search: searchQuery,
        category: selectedCategory,
        sortBy,
        order,
        limit: PRODUCTS_PER_PAGE,
        skip: (currentPage - 1) * PRODUCTS_PER_PAGE,
      }),
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const totalPages = productsData
    ? Math.ceil(productsData.total / PRODUCTS_PER_PAGE)
    : 0;

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (newSortBy: SortOption, newOrder: OrderOption) => {
      setSortBy(newSortBy);
      setOrder(newOrder);
      setCurrentPage(1);
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product, 1);
      setToastMessage(`${product.title} added to cart!`);
      setShowToast(true);
    },
    [addToCart]
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container mx-auto px-4">
        {/* Filters Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="w-full">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                isLoading={categoriesLoading}
              />
              <SortSelect onSortChange={handleSortChange} />
            </div>

            {/* Results Count */}
            {productsData && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing{' '}
                <span className="font-semibold">
                  {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}
                </span>{' '}
                -{' '}
                <span className="font-semibold">
                  {Math.min(
                    currentPage * PRODUCTS_PER_PAGE,
                    productsData.total
                  )}
                </span>{' '}
                of <span className="font-semibold">{productsData.total}</span>{' '}
                products
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <ProductGridSkeleton />
        ) : productsError ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                Error loading products
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Something went wrong. Please try again later.
              </p>
            </div>
          </div>
        ) : productsData && productsData.products.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No products found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productsData?.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </main>
  );
}

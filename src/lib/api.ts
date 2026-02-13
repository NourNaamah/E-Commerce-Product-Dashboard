import type {
  Product,
  ProductsResponse,
  ProductFilters,
} from '@/types/product';

const BASE_URL = 'https://dummyjson.com';

export async function fetchProducts(
  filters: ProductFilters = {},
): Promise<ProductsResponse> {
  const {
    search,
    category,
    sortBy,
    order = 'asc',
    limit = 12,
    skip = 0,
  } = filters;

  let url = `${BASE_URL}/products`;

  // Handle search
  if (search && search.trim()) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}`;
  }
  // Handle category filter
  else if (category && category !== 'all') {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}`;
  }

  // Build query parameters
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('skip', skip.toString());

  if (sortBy) {
    params.append('sortBy', sortBy);
    params.append('order', order);
  }

  const separator = url.includes('?') ? '&' : '?';
  const finalUrl = `${url}${separator}${params.toString()}`;

  try {
    const response = await fetch(finalUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function fetchProductById(id: number): Promise<Product> {
  const url = `${BASE_URL}/products/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function fetchCategories(): Promise<string[]> {
  const url = `${BASE_URL}/products/categories`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const categories = await response.json();
    return categories.map((cat: { slug: string; name: string }) => cat.slug);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function fetchProductsByCategory(
  category: string,
  limit = 12,
  skip = 0,
): Promise<ProductsResponse> {
  const url = `${BASE_URL}/products/category/${encodeURIComponent(
    category,
  )}?limit=${limit}&skip=${skip}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch products by category: ${response.statusText}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

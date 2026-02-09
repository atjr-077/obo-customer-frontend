import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stock?: number;
  rating: number;
  reviews: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  rating?: number;
  sortBy?: 'price' | 'rating' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

export interface ProductSearchResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {
  /**
   * Get all products with optional filters
   */
  async getProducts(filters?: ProductFilters): Promise<ProductSearchResponse> {
    const response = await apiClient.get<ProductSearchResponse>(
      API_ENDPOINTS.PRODUCTS,
      filters
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch products');
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch product');
  }

  /**
   * Search products by query
   */
  async searchProducts(query: string, filters?: ProductFilters): Promise<ProductSearchResponse> {
    const searchParams = {
      q: query,
      ...filters,
    };
    
    const response = await apiClient.get<ProductSearchResponse>(
      API_ENDPOINTS.SEARCH_PRODUCTS,
      searchParams
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to search products');
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch categories');
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const params = limit ? { limit } : undefined;
    const response = await apiClient.get<Product[]>(API_ENDPOINTS.FEATURED_PRODUCTS, params);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch featured products');
  }

  /**
   * Get bestseller products
   */
  async getBestsellers(limit?: number): Promise<Product[]> {
    const params = limit ? { limit } : undefined;
    const response = await apiClient.get<Product[]>(API_ENDPOINTS.BESTSELLERS, params);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch bestsellers');
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string, filters?: Omit<ProductFilters, 'category'>): Promise<ProductSearchResponse> {
    return this.getProducts({ ...filters, category });
  }

  /**
   * Get products by brand
   */
  async getProductsByBrand(brand: string, filters?: Omit<ProductFilters, 'brand'>): Promise<ProductSearchResponse> {
    return this.getProducts({ ...filters, brand });
  }

  /**
   * Get related products (same category, different product)
   */
  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    // First get the product to know its category
    const product = await this.getProductById(productId);
    
    // Get products from same category, excluding current product
    const response = await this.getProducts({
      category: product.category,
      limit: limit + 1, // Get one extra to account for excluding current product
    });
    
    return response.products.filter(p => p.id !== productId).slice(0, limit);
  }
}

export const productService = new ProductService();

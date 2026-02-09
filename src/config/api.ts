const API_BASE_URL = 'http://localhost:3000/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  category: string;
  seller: {
    name: string;
    rating: number;
  };
  tags: string[];
  createdAt: string;
}

interface ProductResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const api = {
  getProducts: async (category?: string): Promise<ProductResponse> => {
    try {
      const url = category 
        ? `${API_BASE_URL}/customer/products?category=${category}`
        : `${API_BASE_URL}/customer/products`;
      
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
};

export type { Product, ProductResponse };
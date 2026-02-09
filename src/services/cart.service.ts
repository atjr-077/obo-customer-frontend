import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import { Product } from './product.service';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  price: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export class CartService {
  /**
   * Get user's cart
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>(API_ENDPOINTS.CART);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch cart');
  }

  /**
   * Add item to cart
   */
  async addToCart(item: AddToCartRequest): Promise<Cart> {
    const response = await apiClient.post<Cart>(API_ENDPOINTS.CART, item);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to add item to cart');
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const response = await apiClient.patch<Cart>(
      API_ENDPOINTS.CART_ITEM(itemId),
      { quantity }
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update cart item');
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId: string): Promise<Cart> {
    const response = await apiClient.delete<Cart>(API_ENDPOINTS.CART_ITEM(itemId));
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to remove item from cart');
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    const response = await apiClient.delete(API_ENDPOINTS.CART);
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(response.message || 'Failed to clear cart');
    }
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    const cart = await this.getCart();
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Check if product is in cart
   */
  async isProductInCart(productId: string, size?: string, color?: string): Promise<boolean> {
    const cart = await this.getCart();
    return cart.items.some(item => 
      item.productId === productId && 
      (!size || item.size === size) && 
      (!color || item.color === color)
    );
  }

  /**
   * Get cart item by product and variants
   */
  async getCartItem(productId: string, size: string, color: string): Promise<CartItem | null> {
    const cart = await this.getCart();
    const item = cart.items.find(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    );
    
    return item || null;
  }

  /**
   * Apply promo code to cart
   */
  async applyPromoCode(promoCode: string): Promise<Cart> {
    const response = await apiClient.post<Cart>(`${API_ENDPOINTS.CART}/promo`, { promoCode });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to apply promo code');
  }

  /**
   * Remove promo code from cart
   */
  async removePromoCode(): Promise<Cart> {
    const response = await apiClient.delete<Cart>(`${API_ENDPOINTS.CART}/promo`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to remove promo code');
  }

  /**
   * Calculate shipping cost
   */
  async calculateShipping(addressId?: string): Promise<{ shipping: number; estimatedDelivery: string }> {
    const params = addressId ? { addressId } : undefined;
    const response = await apiClient.get<{ shipping: number; estimatedDelivery: string }>(
      `${API_ENDPOINTS.CART}/shipping`,
      params
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to calculate shipping');
  }

  /**
   * Merge guest cart with user cart after login
   */
  async mergeCart(guestCartItems: AddToCartRequest[]): Promise<Cart> {
    const response = await apiClient.post<Cart>(`${API_ENDPOINTS.CART}/merge`, { items: guestCartItems });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to merge cart');
  }
}

export const cartService = new CartService();

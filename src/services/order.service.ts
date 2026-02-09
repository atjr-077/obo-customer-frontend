import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import { CartItem } from './cart.service';

export interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    image: string;
    brand: string;
  };
  quantity: number;
  size: string;
  color: string;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially-refunded';
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress?: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  timeline?: OrderTimeline[];
}

export interface OrderTimeline {
  id: string;
  status: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
  }[];
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: string;
  notes?: string;
}

export interface OrderTracking {
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  currentLocation?: string;
  estimatedDelivery: string;
  timeline: OrderTimeline[];
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class OrderService {
  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>(API_ENDPOINTS.ORDERS, orderData);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create order');
  }

  /**
   * Get user's orders with pagination
   */
  async getOrders(page: number = 1, limit: number = 10, status?: string): Promise<OrderListResponse> {
    const params: any = { page, limit };
    if (status) params.status = status;
    
    const response = await apiClient.get<OrderListResponse>(API_ENDPOINTS.ORDERS, params);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch orders');
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(API_ENDPOINTS.ORDER_BY_ID(id));
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch order');
  }

  /**
   * Track order by ID or order number
   */
  async trackOrder(id: string): Promise<OrderTracking> {
    const response = await apiClient.get<OrderTracking>(API_ENDPOINTS.TRACK_ORDER(id));
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to track order');
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const response = await apiClient.post<Order>(API_ENDPOINTS.CANCEL_ORDER(id), { reason });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to cancel order');
  }

  /**
   * Request refund for order
   */
  async requestRefund(id: string, items: string[], reason: string): Promise<Order> {
    const response = await apiClient.post<Order>(`${API_ENDPOINTS.ORDER_BY_ID(id)}/refund`, {
      items,
      reason
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to request refund');
  }

  /**
   * Get order statistics for user
   */
  async getOrderStats(): Promise<{
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
  }> {
    const response = await apiClient.get<{
      totalOrders: number;
      totalSpent: number;
      pendingOrders: number;
      deliveredOrders: number;
      cancelledOrders: number;
    }>(`${API_ENDPOINTS.ORDERS}/stats`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch order statistics');
  }

  /**
   * Reorder items from a previous order
   */
  async reorderItems(orderId: string): Promise<void> {
    const response = await apiClient.post(`${API_ENDPOINTS.ORDER_BY_ID(orderId)}/reorder`);
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(response.message || 'Failed to reorder items');
    }
  }

  /**
   * Download order invoice
   */
  async downloadInvoice(orderId: string): Promise<Blob> {
    const response = await fetch(`${apiClient['baseURL']}${API_ENDPOINTS.ORDER_BY_ID(orderId)}/invoice`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${(window as any).__clerkToken || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download invoice');
    }

    return response.blob();
  }

  /**
   * Update shipping address for order (only if not shipped)
   */
  async updateShippingAddress(orderId: string, addressId: string): Promise<Order> {
    const response = await apiClient.patch<Order>(API_ENDPOINTS.ORDER_BY_ID(orderId), {
      shippingAddressId: addressId
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update shipping address');
  }

  /**
   * Add note to order
   */
  async addOrderNote(orderId: string, note: string): Promise<Order> {
    const response = await apiClient.post<Order>(`${API_ENDPOINTS.ORDER_BY_ID(orderId)}/notes`, {
      note
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to add order note');
  }
}

export const orderService = new OrderService();

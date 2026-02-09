import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import { OrderItem } from './order.service';

export interface Return {
  id: string;
  orderId: string;
  orderNumber: string;
  userId: string;
  items: ReturnItem[];
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
  refundAmount: number;
  refundMethod: 'original-payment' | 'store-credit' | 'bank-transfer';
  refundStatus: 'pending' | 'processing' | 'completed' | 'failed';
  returnReason: string;
  returnReasonDetails?: string;
  images?: string[];
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  completedAt?: string;
}

export interface ReturnItem {
  id: string;
  orderItemId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    image: string;
    brand: string;
  };
  quantity: number;
  reason: string;
  condition: 'new' | 'used-like-new' | 'good' | 'fair' | 'poor';
  refundAmount: number;
}

export interface CreateReturnRequest {
  orderId: string;
  items: {
    orderItemId: string;
    quantity: number;
    reason: string;
    condition: 'new' | 'used-like-new' | 'good' | 'fair' | 'poor';
  }[];
  returnReason: string;
  returnReasonDetails?: string;
  images?: File[];
  notes?: string;
  refundMethod: 'original-payment' | 'store-credit' | 'bank-transfer';
}

export interface ReturnPolicy {
  eligiblePeriod: number; // days from delivery
  conditions: string[];
  nonReturnableItems: string[];
  refundMethods: string[];
  restockingFee: {
    percentage: number;
    appliesTo: string[];
  };
  shippingCost: {
    customerPays: boolean;
    amount?: number;
  };
}

export interface ReturnLabel {
  id: string;
  returnId: string;
  trackingNumber: string;
  carrier: string;
  labelUrl: string;
  qrCodeUrl: string;
  instructions: string[];
  expiresAt: string;
  createdAt: string;
}

export interface ReturnListResponse {
  returns: Return[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ReturnService {
  /**
   * Create a new return request
   */
  async createReturn(returnData: CreateReturnRequest): Promise<Return> {
    let response;
    
    if (returnData.images && returnData.images.length > 0) {
      // If there are images, use FormData
      const formData = new FormData();
      
      // Add all text fields
      Object.entries(returnData).forEach(([key, value]) => {
        if (key !== 'images' && value !== undefined) {
          if (key === 'items') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });
      
      // Add images
      returnData.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      
      response = await apiClient.upload(`${API_ENDPOINTS.RETURNS}/create`, formData);
    } else {
      // Regular JSON request
      response = await apiClient.post<Return>(API_ENDPOINTS.RETURNS, returnData);
    }
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create return request');
  }

  /**
   * Get user's returns with pagination
   */
  async getReturns(page: number = 1, limit: number = 10, status?: string): Promise<ReturnListResponse> {
    const params: any = { page, limit };
    if (status) params.status = status;
    
    const response = await apiClient.get<ReturnListResponse>(API_ENDPOINTS.RETURNS, params);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch returns');
  }

  /**
   * Get return by ID
   */
  async getReturnById(id: string): Promise<Return> {
    const response = await apiClient.get<Return>(API_ENDPOINTS.RETURN_BY_ID(id));
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch return');
  }

  /**
   * Update return request
   */
  async updateReturn(id: string, data: Partial<CreateReturnRequest>): Promise<Return> {
    const response = await apiClient.patch<Return>(API_ENDPOINTS.RETURN_BY_ID(id), data);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update return');
  }

  /**
   * Cancel return request
   */
  async cancelReturn(id: string, reason?: string): Promise<Return> {
    const response = await apiClient.post<Return>(`${API_ENDPOINTS.RETURN_BY_ID(id)}/cancel`, { reason });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to cancel return');
  }

  /**
   * Get return policy
   */
  async getReturnPolicy(): Promise<ReturnPolicy> {
    const response = await apiClient.get<ReturnPolicy>(`${API_ENDPOINTS.RETURNS}/policy`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch return policy');
  }

  /**
   * Get return label
   */
  async getReturnLabel(returnId: string): Promise<ReturnLabel> {
    const response = await apiClient.get<ReturnLabel>(`${API_ENDPOINTS.RETURN_BY_ID(returnId)}/label`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch return label');
  }

  /**
   * Download return label PDF
   */
  async downloadReturnLabel(returnId: string): Promise<Blob> {
    const response = await fetch(`${apiClient['baseURL']}${API_ENDPOINTS.RETURN_BY_ID(returnId)}/label/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${(window as any).__clerkToken || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download return label');
    }

    return response.blob();
  }

  /**
   * Track return shipment
   */
  async trackReturn(returnId: string): Promise<{
    trackingNumber: string;
    carrier: string;
    status: string;
    estimatedDelivery?: string;
    trackingHistory: Array<{
      date: string;
      status: string;
      location: string;
      description: string;
    }>;
  }> {
    const response = await apiClient.get<{
      trackingNumber: string;
      carrier: string;
      status: string;
      estimatedDelivery?: string;
      trackingHistory: Array<{
        date: string;
        status: string;
        location: string;
        description: string;
      }>;
    }>(`${API_ENDPOINTS.RETURN_BY_ID(returnId)}/track`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to track return');
  }

  /**
   * Add note to return
   */
  async addReturnNote(returnId: string, note: string): Promise<Return> {
    const response = await apiClient.post<Return>(`${API_ENDPOINTS.RETURN_BY_ID(returnId)}/notes`, {
      note
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to add return note');
  }

  /**
   * Check if order is eligible for return
   */
  async checkReturnEligibility(orderId: string): Promise<{
    isEligible: boolean;
    eligibleItems: Array<{
      orderItemId: string;
      productId: string;
      name: string;
      eligibleQuantity: number;
      returnDeadline: string;
    }>;
    nonEligibleItems: Array<{
      orderItemId: string;
      productId: string;
      name: string;
      reason: string;
    }>;
    policy: ReturnPolicy;
  }> {
    const response = await apiClient.get<{
      isEligible: boolean;
      eligibleItems: Array<{
        orderItemId: string;
        productId: string;
        name: string;
        eligibleQuantity: number;
        returnDeadline: string;
      }>;
      nonEligibleItems: Array<{
        orderItemId: string;
        productId: string;
        name: string;
        reason: string;
      }>;
      policy: ReturnPolicy;
    }>(`${API_ENDPOINTS.RETURNS}/check-eligibility`, { orderId });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to check return eligibility');
  }

  /**
   * Get return statistics for user
   */
  async getReturnStats(): Promise<{
    totalReturns: number;
    pendingReturns: number;
    approvedReturns: number;
    completedReturns: number;
    totalRefundAmount: number;
    averageProcessingTime: number; // in days
  }> {
    const response = await apiClient.get<{
      totalReturns: number;
      pendingReturns: number;
      approvedReturns: number;
      completedReturns: number;
      totalRefundAmount: number;
      averageProcessingTime: number;
    }>(`${API_ENDPOINTS.RETURNS}/stats`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch return statistics');
  }

  /**
   * Get available return reasons
   */
  async getReturnReasons(): Promise<Array<{
    id: string;
    reason: string;
    description: string;
    requiresDetails: boolean;
    requiresImages: boolean;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      reason: string;
      description: string;
      requiresDetails: boolean;
      requiresImages: boolean;
    }>>(`${API_ENDPOINTS.RETURNS}/reasons`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch return reasons');
  }
}

export const returnService = new ReturnService();

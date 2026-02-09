import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import { Product } from './product.service';

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  avatar?: File;
}

export interface Notification {
  id: string;
  type: 'order' | 'delivery' | 'promo' | 'info' | 'security';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    orderId?: string;
    productId?: string;
    [key: string]: any;
  };
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletters: boolean;
  security: boolean;
}

export class UserService {
  // Wishlist methods
  /**
   * Get user's wishlist
   */
  async getWishlist(): Promise<Wishlist> {
    const response = await apiClient.get<Wishlist>(API_ENDPOINTS.WISHLIST);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch wishlist');
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(productId: string): Promise<Wishlist> {
    const response = await apiClient.post<Wishlist>(API_ENDPOINTS.WISHLIST, {
      productId
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to add to wishlist');
  }

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(productId: string): Promise<Wishlist> {
    const response = await apiClient.delete<Wishlist>(API_ENDPOINTS.WISHLIST_ITEM(productId));
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to remove from wishlist');
  }

  /**
   * Check if product is in wishlist
   */
  async isProductInWishlist(productId: string): Promise<boolean> {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.items.some(item => item.productId === productId);
    } catch (error) {
      return false;
    }
  }

  /**
   * Move item from wishlist to cart
   */
  async moveToCart(productId: string, size: string, color: string): Promise<void> {
    const response = await apiClient.post(`${API_ENDPOINTS.WISHLIST_ITEM(productId)}/move-to-cart`, {
      size,
      color
    });
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(response.message || 'Failed to move to cart');
    }
  }

  // User profile methods
  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(API_ENDPOINTS.USER_PROFILE);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch profile');
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    let response;
    
    if (data.avatar) {
      // If there's an avatar file, use FormData
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'avatar' && value !== undefined) {
          formData.append(key, value);
        }
      });
      if (data.avatar) {
        formData.append('avatar', data.avatar);
      }
      
      response = await apiClient.upload(`${API_ENDPOINTS.USER_PROFILE}/avatar`, formData);
    } else {
      // Regular JSON update
      response = await apiClient.patch<UserProfile>(API_ENDPOINTS.USER_PROFILE, data);
    }
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update profile');
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiClient.post(`${API_ENDPOINTS.USER_PROFILE}/change-password`, {
      currentPassword,
      newPassword
    });
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(response.message || 'Failed to change password');
    }
  }

  /**
   * Delete account
   */
  async deleteAccount(password: string): Promise<void> {
    const response = await apiClient.delete(API_ENDPOINTS.USER_PROFILE, {
      body: JSON.stringify({ password })
    });
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(response.message || 'Failed to delete account');
    }
  }

  // Notification methods
  /**
   * Get user notifications
   */
  async getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = { page, limit, unreadOnly };
    const response = await apiClient.get<{
      notifications: Notification[];
      total: number;
      unreadCount: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(API_ENDPOINTS.USER_NOTIFICATIONS, params);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch notifications');
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(id: string): Promise<void> {
    const response = await apiClient.post(API_ENDPOINTS.MARK_NOTIFICATION_READ(id));
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(response.message || 'Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<void> {
    const response = await apiClient.post(`${API_ENDPOINTS.USER_NOTIFICATIONS}/mark-all-read`);
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(response.message || 'Failed to mark all notifications as read');
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string): Promise<void> {
    const response = await apiClient.delete(`${API_ENDPOINTS.USER_NOTIFICATIONS}/${id}`);
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(response.message || 'Failed to delete notification');
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get<NotificationPreferences>(`${API_ENDPOINTS.USER_PROFILE}/notification-preferences`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch notification preferences');
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await apiClient.patch<NotificationPreferences>(`${API_ENDPOINTS.USER_PROFILE}/notification-preferences`, preferences);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update notification preferences');
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    totalOrders: number;
    totalSpent: number;
    wishlistItems: number;
    reviewsCount: number;
    memberSince: string;
  }> {
    const response = await apiClient.get<{
      totalOrders: number;
      totalSpent: number;
      wishlistItems: number;
      reviewsCount: number;
      memberSince: string;
    }>(`${API_ENDPOINTS.USER_PROFILE}/stats`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch user statistics');
  }
}

export const userService = new UserService();

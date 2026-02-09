export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  SEARCH_PRODUCTS: '/products/search',
  CATEGORIES: '/products/categories',
  FEATURED_PRODUCTS: '/products/featured',
  BESTSELLERS: '/products/bestsellers',
  
  // Cart
  CART: '/cart',
  CART_ITEM: (id: string) => `/cart/items/${id}`,
  
  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  TRACK_ORDER: (id: string) => `/orders/${id}/track`,
  CANCEL_ORDER: (id: string) => `/orders/${id}/cancel`,
  
  // Wishlist
  WISHLIST: '/wishlist',
  WISHLIST_ITEM: (productId: string) => `/wishlist/${productId}`,
  
  // Addresses
  ADDRESSES: '/addresses',
  ADDRESS_BY_ID: (id: string) => `/addresses/${id}`,
  SET_DEFAULT_ADDRESS: (id: string) => `/addresses/${id}/default`,
  
  // Returns
  RETURNS: '/returns',
  RETURN_BY_ID: (id: string) => `/returns/${id}`,
  
  // User
  USER_PROFILE: '/user/profile',
  USER_NOTIFICATIONS: '/user/notifications',
  MARK_NOTIFICATION_READ: (id: string) => `/user/notifications/${id}/read`,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_TIMEOUT = 10000; // 10 seconds

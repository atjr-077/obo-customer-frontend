// Export all services and types
export * from './api.config';
export * from './api.client';
export * from './product.service';
export * from './cart.service';
export { OrderService, OrderItem, Order, OrderTimeline, CreateOrderRequest, OrderTracking, OrderListResponse } from './order.service';
export * from './user.service';
export { AddressService, Address, CreateAddressRequest, UpdateAddressRequest, AddressValidationResponse } from './address.service';
export * from './return.service';

// Export service instances
export { apiClient, setAuthToken, clearAuthToken } from './api.client';
export { productService } from './product.service';
export { cartService } from './cart.service';
export { orderService } from './order.service';
export { userService } from './user.service';
export { addressService } from './address.service';
export { returnService } from './return.service';

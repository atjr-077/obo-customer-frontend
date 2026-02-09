import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

// Import all services and types
import {
  productService,
  cartService,
  orderService,
  userService,
  addressService,
  returnService,
  setAuthToken,
  clearAuthToken,
  // Types
  Product as ApiProduct,
  CartItem as ApiCartItem,
  Cart as ApiCart,
  Order as ApiOrder,
  Address as ApiAddress,
  Wishlist,
  Notification as ApiNotification,
  Return as ApiReturn,
  UserProfile,
  CreateAddressRequest,
  UpdateAddressRequest,
} from '@/services';

// Re-export types for backward compatibility
export type Product = ApiProduct;
export type CartItem = ApiCartItem;
export type Cart = ApiCart;
export type Order = ApiOrder;
export type Address = ApiAddress;
export type Wishlist = Wishlist;
export type Notification = ApiNotification;
export type Return = ApiReturn;
export type UserProfile = UserProfile;

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
}

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

interface ShopContextType {
  // State
  cart: Cart | null;
  wishlist: Wishlist | null;
  user: User | null;
  orders: Order[];
  returns: ApiReturn[];
  notifications: ApiNotification[];
  promoCodes: PromoCode[];
  appliedPromo: PromoCode | null;
  loading: boolean;
  error: string | null;

  // Cart methods
  addToCart: (productId: string, size: string, color: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;

  // Wishlist methods
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => Promise<boolean>;

  // User methods
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => void;

  // Address methods
  addAddress: (address: CreateAddressRequest) => Promise<void>;
  updateAddress: (id: string, address: UpdateAddressRequest) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;

  // Order methods
  createOrder: (paymentMethod: string, addressId: string) => Promise<Order>;
  getOrder: (orderId: string) => Promise<Order | undefined>;
  getOrders: () => Promise<void>;

  // Return methods
  createReturnRequest: (orderId: string, items: any[], reason: string) => Promise<void>;
  getReturns: () => Promise<void>;

  // Notification methods
  markNotificationRead: (id: string) => Promise<void>;

  // Promo methods
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => Promise<void>;

  // Product methods
  getProducts: (filters?: any) => Promise<Product[]>;
  getProductById: (id: string) => Promise<Product | undefined>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, userId, getToken } = useAuth();
  const { user: clerkUser } = useUser();

  // State
  const [cart, setCart] = useState<Cart | null>(null);
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ApiReturn[]>([]);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock promo codes
  const promoCodes: PromoCode[] = [
    { code: 'WELCOME10', discount: 10, type: 'percentage' },
    { code: 'SAVE20', discount: 20, type: 'percentage' },
    { code: 'FLAT50', discount: 50, type: 'fixed' },
  ];

  // Set auth token when user signs in
  useEffect(() => {
    const setupAuth = async () => {
      if (isSignedIn && getToken) {
        try {
          const token = await getToken();
          if (token) {
            setAuthToken(token);
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
      } else {
        clearAuthToken();
      }
    };

    setupAuth();
  }, [isSignedIn, getToken]);

  // Sync Clerk authentication with ShopContext
  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && clerkUser && userId) {
        try {
          setLoading(true);
          setError(null);

          // Get user profile from API
          const userProfile = await userService.getProfile();
          
          const userData: User = {
            id: userProfile.id,
            name: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
            email: userProfile.email,
            phone: userProfile.phoneNumber,
            addresses: [], // Will be loaded separately
          };
          
          setUser(userData);

          // Load user-specific data
          await Promise.all([
            loadCart(),
            loadWishlist(),
            loadOrders(),
            loadReturns(),
            loadNotifications(),
            loadAddresses(),
          ]);

        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load user data';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      } else {
        // User is not signed in, clear all data
        setUser(null);
        setCart(null);
        setWishlist(null);
        setOrders([]);
        setReturns([]);
        setNotifications([]);
        setAppliedPromo(null);
      }
    };

    syncUser();
  }, [isSignedIn, clerkUser, userId]);

  // Load functions
  const loadCart = async () => {
    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const loadWishlist = async () => {
    try {
      const wishlistData = await userService.getWishlist();
      setWishlist(wishlistData);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const ordersData = await orderService.getOrders(1, 50);
      setOrders(ordersData.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadReturns = async () => {
    try {
      const returnsData = await returnService.getReturns(1, 50);
      setReturns(returnsData.returns);
    } catch (error) {
      console.error('Error loading returns:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationsData = await userService.getNotifications(1, 50);
      setNotifications(notificationsData.notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadAddresses = async () => {
    try {
      const addresses = await addressService.getAddresses();
      if (user) {
        setUser({ ...user, addresses });
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  // Cart methods
  const addToCart = async (productId: string, size: string, color: string, quantity: number) => {
    try {
      setLoading(true);
      await cartService.addToCart({ productId, quantity, size, color });
      await loadCart();
      toast.success('Item added to cart');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      await cartService.removeFromCart(itemId);
      await loadCart();
      toast.success('Item removed from cart');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item from cart';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      await cartService.updateCartItem(itemId, quantity);
      await loadCart();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setCart(null);
      toast.success('Cart cleared');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    if (!cart) return 0;
    
    let total = cart.total;

    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        total = total * (1 - appliedPromo.discount / 100);
      } else {
        total = Math.max(0, total - appliedPromo.discount);
      }
    }

    return total;
  };

  const getTotalItems = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Wishlist methods
  const toggleWishlist = async (productId: string) => {
    try {
      setLoading(true);
      const isInWishlist = await userService.isProductInWishlist(productId);
      
      if (isInWishlist) {
        await userService.removeFromWishlist(productId);
        toast.success('Item removed from wishlist');
      } else {
        await userService.addToWishlist(productId);
        toast.success('Item added to wishlist');
      }
      
      await loadWishlist();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update wishlist';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = async (productId: string) => {
    try {
      return await userService.isProductInWishlist(productId);
    } catch (error) {
      return false;
    }
  };

  // User methods
  const updateUser = async (data: Partial<UserProfile>) => {
    try {
      setLoading(true);
      const updatedProfile = await userService.updateProfile(data);
      setUser(prev => prev ? { ...prev, ...updatedProfile } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthToken();
    // Clerk sign out will be handled by SignOutButton component
  };

  // Address methods
  const addAddress = async (address: CreateAddressRequest) => {
    try {
      setLoading(true);
      await addressService.createAddress(address);
      await loadAddresses();
      toast.success('Address added successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add address';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id: string, address: UpdateAddressRequest) => {
    try {
      setLoading(true);
      await addressService.updateAddress(id, address);
      await loadAddresses();
      toast.success('Address updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update address';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      setLoading(true);
      await addressService.deleteAddress(id);
      await loadAddresses();
      toast.success('Address deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete address';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      setLoading(true);
      await addressService.setDefaultAddress(id);
      await loadAddresses();
      toast.success('Default address updated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set default address';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Order methods
  const createOrder = async (paymentMethod: string, addressId: string): Promise<Order> => {
    try {
      setLoading(true);
      
      // Get cart items for order
      if (!cart) throw new Error('Cart is empty');
      
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddressId: addressId,
        paymentMethod,
      };

      const order = await orderService.createOrder(orderData);
      setOrders(prev => [order, ...prev]);
      setCart(null);
      setAppliedPromo(null);
      
      toast.success('Order placed successfully!');
      return order;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (orderId: string): Promise<Order | undefined> => {
    try {
      return await orderService.getOrderById(orderId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order';
      toast.error(errorMessage);
      return undefined;
    }
  };

  const getOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getOrders(1, 50);
      setOrders(ordersData.orders);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Return methods
  const createReturnRequest = async (orderId: string, items: any[], reason: string) => {
    try {
      setLoading(true);
      await returnService.createReturn({
        orderId,
        items,
        returnReason: reason,
        refundMethod: 'original-payment',
      });
      await loadReturns();
      toast.success('Return request submitted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create return request';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReturns = async () => {
    try {
      setLoading(true);
      const returnsData = await returnService.getReturns(1, 50);
      setReturns(returnsData.returns);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch returns';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Notification methods
  const markNotificationRead = async (id: string) => {
    try {
      await userService.markNotificationRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Promo methods
  const applyPromoCode = async (code: string): Promise<boolean> => {
    try {
      setLoading(true);
      await cartService.applyPromoCode(code);
      await loadCart();
      
      const promo = promoCodes.find((p) => p.code.toLowerCase() === code.toLowerCase());
      if (promo) {
        setAppliedPromo(promo);
        toast.success('Promo code applied successfully');
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply promo code';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removePromoCode = async () => {
    try {
      setLoading(true);
      await cartService.removePromoCode();
      await loadCart();
      setAppliedPromo(null);
      toast.success('Promo code removed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove promo code';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Product methods
  const getProducts = async (filters?: any): Promise<Product[]> => {
    try {
      const response = await productService.getProducts(filters);
      return response.products;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      toast.error(errorMessage);
      throw error;
    }
  };

  const getProductById = async (id: string): Promise<Product | undefined> => {
    try {
      return await productService.getProductById(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
      toast.error(errorMessage);
      return undefined;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        // State
        cart,
        wishlist,
        user,
        orders,
        returns,
        notifications,
        promoCodes,
        appliedPromo,
        loading,
        error,

        // Methods
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        toggleWishlist,
        isInWishlist,
        updateUser,
        logout,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        createOrder,
        getOrder,
        getOrders,
        createReturnRequest,
        getReturns,
        markNotificationRead,
        applyPromoCode,
        removePromoCode,
        getProducts,
        getProductById,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

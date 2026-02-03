import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stock?: number;
  rating: number;
  reviews: number;
  brand: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  deliveryAddress: Address;
  paymentMethod: string;
  estimatedDelivery?: string;
  timeline?: OrderTimeline[];
}

export interface OrderTimeline {
  status: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  items: CartItem[];
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  date: string;
  refundAmount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'delivery' | 'promo' | 'info';
}

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  orders: Order[];
  returns: ReturnRequest[];
  notifications: Notification[];
  promoCodes: PromoCode[];
  appliedPromo: PromoCode | null;
  addToCart: (product: Product, size: string, color: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  logout: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  createOrder: (paymentMethod: string, address: Address) => Order;
  getOrder: (orderId: string) => Order | undefined;
  createReturnRequest: (orderId: string, items: CartItem[], reason: string) => void;
  markNotificationRead: (id: string) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  updateUser: (data: Partial<User>) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser } = useUser();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Mock promo codes
  const promoCodes: PromoCode[] = [
    { code: 'WELCOME10', discount: 10, type: 'percentage' },
    { code: 'SAVE20', discount: 20, type: 'percentage' },
    { code: 'FLAT50', discount: 50, type: 'fixed' },
  ];

  // Sync Clerk authentication with ShopContext
  useEffect(() => {
    if (isSignedIn && clerkUser && userId) {
      // Create or load user from Clerk data
      const userKey = `user_${userId}`;
      const savedUserData = localStorage.getItem(userKey);

      if (savedUserData) {
        // Load existing user data
        setUser(JSON.parse(savedUserData));
      } else {
        // Create new user from Clerk data
        const newUser: User = {
          id: userId,
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          phone: clerkUser.primaryPhoneNumber?.phoneNumber,
          addresses: [],
        };
        setUser(newUser);

        // Add welcome notification
        addNotification({
          title: 'Welcome to OBO HUB!',
          message: 'Start shopping for authentic products',
          type: 'info',
        });
      }
    } else {
      // User is not signed in with Clerk, clear user data
      setUser(null);
    }
  }, [isSignedIn, clerkUser, userId]);

  // Load user-specific data from localStorage
  useEffect(() => {
    if (user) {
      const userKey = `user_${user.id}`;
      const cartKey = `cart_${user.id}`;
      const wishlistKey = `wishlist_${user.id}`;
      const ordersKey = `orders_${user.id}`;
      const returnsKey = `returns_${user.id}`;
      const notificationsKey = `notifications_${user.id}`;

      const savedCart = localStorage.getItem(cartKey);
      const savedWishlist = localStorage.getItem(wishlistKey);
      const savedOrders = localStorage.getItem(ordersKey);
      const savedReturns = localStorage.getItem(returnsKey);
      const savedNotifications = localStorage.getItem(notificationsKey);

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedReturns) setReturns(JSON.parse(savedReturns));
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    } else {
      // Clear all data when logged out
      setCart([]);
      setWishlist([]);
      setOrders([]);
      setReturns([]);
      setNotifications([]);
    }
  }, [user?.id]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (user) {
      const cartKey = `cart_${user.id}`;
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, user]);

  useEffect(() => {
    if (user) {
      const wishlistKey = `wishlist_${user.id}`;
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  useEffect(() => {
    if (user) {
      const userKey = `user_${user.id}`;
      localStorage.setItem(userKey, JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const ordersKey = `orders_${user.id}`;
      localStorage.setItem(ordersKey, JSON.stringify(orders));
    }
  }, [orders, user]);

  useEffect(() => {
    if (user) {
      const returnsKey = `returns_${user.id}`;
      localStorage.setItem(returnsKey, JSON.stringify(returns));
    }
  }, [returns, user]);

  useEffect(() => {
    if (user) {
      const notificationsKey = `notifications_${user.id}`;
      localStorage.setItem(notificationsKey, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const addToCart = (product: Product, size: string, color: string, quantity: number) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
      );

      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id &&
            item.size === size &&
            item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { product, size, color, quantity }];
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  const updateCartQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
          item.size === size &&
          item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const logout = () => {
    // Data will be cleared by the user state change useEffect
    // Clerk sign out will be handled by the SignOutButton component
  };

  const getTotalPrice = () => {
    let total = cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

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
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (!user) return;

    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };

    setUser({
      ...user,
      addresses: [...user.addresses, newAddress],
    });
  };

  const updateAddress = (id: string, addressData: Partial<Address>) => {
    if (!user) return;

    setUser({
      ...user,
      addresses: user.addresses.map((addr) =>
        addr.id === id ? { ...addr, ...addressData } : addr
      ),
    });
  };

  const deleteAddress = (id: string) => {
    if (!user) return;

    setUser({
      ...user,
      addresses: user.addresses.filter((addr) => addr.id !== id),
    });
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;

    setUser({
      ...user,
      addresses: user.addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    });
  };

  const createOrder = (paymentMethod: string, address: Address): Order => {
    const orderId = `ORD${Date.now()}`;
    const trackingNumber = `TRK${Math.random().toString(36).substring(7).toUpperCase()}`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const order: Order = {
      id: orderId,
      date: new Date().toISOString(),
      items: [...cart],
      total: getTotalPrice(),
      status: 'confirmed',
      trackingNumber,
      deliveryAddress: address,
      paymentMethod,
      estimatedDelivery: deliveryDate.toISOString(),
      timeline: [
        {
          status: 'Order Placed',
          date: new Date().toISOString(),
          description: 'Your order has been placed successfully',
          completed: true,
        },
        {
          status: 'Confirmed',
          date: new Date().toISOString(),
          description: 'Your order has been confirmed',
          completed: true,
        },
        {
          status: 'Shipped',
          date: '',
          description: 'Your order has been shipped',
          completed: false,
        },
        {
          status: 'Out for Delivery',
          date: '',
          description: 'Your order is out for delivery',
          completed: false,
        },
        {
          status: 'Delivered',
          date: '',
          description: 'Your order has been delivered',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [order, ...prev]);
    clearCart();
    setAppliedPromo(null);

    addNotification({
      title: 'Order Placed Successfully!',
      message: `Order ${orderId} has been placed. Track your order for updates.`,
      type: 'order',
    });

    return order;
  };

  const getOrder = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  const createReturnRequest = (orderId: string, items: CartItem[], reason: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const returnRequest: ReturnRequest = {
      id: `RET${Date.now()}`,
      orderId,
      items,
      reason,
      status: 'pending',
      date: new Date().toISOString(),
      refundAmount: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    };

    setReturns((prev) => [returnRequest, ...prev]);

    addNotification({
      title: 'Return Request Submitted',
      message: `Your return request ${returnRequest.id} has been submitted and is under review.`,
      type: 'order',
    });
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const notification: Notification = {
      ...notif,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [notification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const applyPromoCode = (code: string): boolean => {
    const promo = promoCodes.find((p) => p.code.toLowerCase() === code.toLowerCase());
    if (promo) {
      setAppliedPromo(promo);
      return true;
    }
    return false;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        user,
        orders,
        returns,
        notifications,
        promoCodes,
        appliedPromo,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        logout,
        getTotalPrice,
        getTotalItems,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        createOrder,
        getOrder,
        createReturnRequest,
        markNotificationRead,
        applyPromoCode,
        removePromoCode,
        updateUser,
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
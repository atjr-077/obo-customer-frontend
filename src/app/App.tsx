import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ShopProvider } from '@/app/context/ShopContext';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { Home } from '@/app/pages/Home';
import { ProductListing } from '@/app/pages/ProductListing';
import { ProductDetail } from '@/app/pages/ProductDetail';
import { Cart } from '@/app/pages/Cart';
import { Wishlist } from '@/app/pages/Wishlist';
import { Checkout } from '@/app/pages/Checkout';
import { Account } from '@/app/pages/Account';
import Login from '@/app/pages/Login';
import { Orders } from '@/app/pages/Orders';
import { OrderTracking } from '@/app/pages/OrderTracking';
import { Returns } from '@/app/pages/Returns';
import { ReturnOrder } from '@/app/pages/ReturnOrder';
import { AddAddress } from '@/app/pages/AddAddress';
import { Notifications } from '@/app/pages/Notifications';

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/account" element={<Account />} />
              <Route path="/login" element={<Login />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/track-order/:orderId" element={<OrderTracking />} />
              <Route path="/order-details/:orderId" element={<OrderTracking />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/return-order/:orderId" element={<ReturnOrder />} />
              <Route path="/add-address" element={<AddAddress />} />
              <Route path="/edit-address/:addressId" element={<AddAddress />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </ShopProvider>
    </BrowserRouter>
  );
}
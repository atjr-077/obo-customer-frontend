import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useShop } from '@/app/context/ShopContext';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, getTotalPrice } = useShop();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-4">Your bag is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your bag yet.
          </p>
          <Link
            to="/products"
            className="inline-block bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition-colors"
          >
            START SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">SHOPPING BAG ({cart.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 border rounded-lg p-4">
              <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                <ImageWithFallback
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-32 h-32 object-cover rounded"
                />
              </Link>

              <div className="flex-1">
                <Link to={`/product/${item.product.id}`} className="hover:underline">
                  <h3 className="font-bold mb-1">{item.product.name}</h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">{item.product.brand}</p>
                
                <div className="text-sm mb-2">
                  <p>Size: <span className="font-medium">{item.size}</span></p>
                  <p>Color: <span className="font-medium">{item.color}</span></p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.size,
                          item.color,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    {item.product.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        ${(item.product.originalPrice * item.quantity).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  removeFromCart(item.product.id, item.size, item.color)
                }
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">ORDER SUMMARY</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-sm text-gray-600">
                  Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                </p>
              )}
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-black text-white text-center py-4 rounded font-bold hover:bg-gray-800 transition-colors mb-4"
            >
              CHECKOUT
            </Link>

            <Link
              to="/products"
              className="block w-full border border-black text-center py-4 rounded font-bold hover:bg-gray-100 transition-colors"
            >
              CONTINUE SHOPPING
            </Link>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-3">WE ACCEPT</p>
              <div className="flex gap-2">
                <div className="border rounded px-2 py-1 text-xs">VISA</div>
                <div className="border rounded px-2 py-1 text-xs">MASTERCARD</div>
                <div className="border rounded px-2 py-1 text-xs">AMEX</div>
                <div className="border rounded px-2 py-1 text-xs">PAYPAL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

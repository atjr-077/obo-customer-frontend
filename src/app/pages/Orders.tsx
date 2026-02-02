import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '@/app/context/ShopContext';
import { Package, Truck, MapPin, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export const Orders: React.FC = () => {
  const { user, orders } = useShop();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package size={64} className="mx-auto mb-4 text-gray-400" />
        <h1 className="text-2xl font-bold mb-4">Please log in to view your orders</h1>
        <Link to="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
      case 'out-for-delivery':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">MY ORDERS</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <Link
            to="/products"
            className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-bold">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium">{formatDate(order.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4 mb-4">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border">
                        <ImageWithFallback
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                        </p>
                        <p className="font-medium">${item.product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-600">
                      +{order.items.length - 2} more item(s)
                    </p>
                  )}
                </div>

                {/* Delivery Info */}
                <div className="flex items-start gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                  <MapPin size={20} className="flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium mb-1">Delivery Address</p>
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.state}, {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate(`/track-order/${order.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors"
                  >
                    <Truck size={20} />
                    Track Order
                  </button>
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => navigate(`/return-order/${order.id}`)}
                      className="flex-1 border border-black text-black py-3 rounded hover:bg-gray-100 transition-colors"
                    >
                      Return Order
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/order-details/${order.id}`)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

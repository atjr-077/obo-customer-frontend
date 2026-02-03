import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '@/app/context/ShopContext';
import { Package, Truck, MapPin, CheckCircle, Clock, ArrowLeft, Phone, Mail } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export const OrderTracking: React.FC = () => {
  const { orderId } = useParams();
  const { getOrder } = useShop();
  const navigate = useNavigate();
  
  const order = getOrder(orderId || '');

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Link to="/orders" className="text-blue-600 underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 hover:text-gray-600"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600">
            <span>Order ID: <span className="font-bold text-black">{order.id}</span></span>
            <span className="hidden sm:inline">•</span>
            <span>Placed on {formatFullDate(order.date)}</span>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-lg border p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold mb-6">Order Timeline</h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Timeline Items */}
            <div className="space-y-8">
              {order.timeline?.map((item, index) => (
                <div key={index} className="relative flex gap-4">
                  {/* Icon */}
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`}>
                    {item.completed ? (
                      <CheckCircle size={24} className="text-white" />
                    ) : (
                      <Clock size={24} className="text-gray-500" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <h3 className={`font-bold mb-1 ${item.completed ? 'text-black' : 'text-gray-400'}`}>
                      {item.status}
                    </h3>
                    <p className={`text-sm mb-1 ${item.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                      {item.description}
                    </p>
                    {item.date && (
                      <p className="text-sm text-gray-500">
                        {formatDate(item.date)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Delivery */}
          {order.estimatedDelivery && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Truck size={24} className="text-blue-600" />
                <div>
                  <p className="font-bold text-blue-900">Estimated Delivery</p>
                  <p className="text-sm text-blue-700">
                    {formatFullDate(order.estimatedDelivery)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Number */}
        {order.trackingNumber && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Tracking Information</h2>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Package size={24} />
              <div>
                <p className="text-sm text-gray-600">Tracking Number</p>
                <p className="font-bold">{order.trackingNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Items ({order.items.length})</h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b last:border-0">
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border">
                  <ImageWithFallback
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/product/${item.product.id}`}
                    className="font-medium hover:underline block mb-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-600 mb-1">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">Total</p>
              <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
          <div className="flex items-start gap-3">
            <MapPin size={24} className="flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold mb-1">{order.deliveryAddress.fullName}</p>
              <p className="text-gray-600">{order.deliveryAddress.street}</p>
              <p className="text-gray-600">
                {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
              </p>
              <p className="text-gray-600">{order.deliveryAddress.country}</p>
              <p className="text-gray-600 mt-2">Phone: {order.deliveryAddress.phone}</p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-lg border p-6">
          <h2 className="text-xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, feel free to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+1234567890"
              className="flex items-center justify-center gap-2 flex-1 bg-black text-white py-3 px-4 rounded hover:bg-gray-800"
            >
              <Phone size={20} />
              Call Support
            </a>
            <a
              href="mailto:support@obohub.com"
              className="flex items-center justify-center gap-2 flex-1 border border-black text-black py-3 px-4 rounded hover:bg-gray-100"
            >
              <Mail size={20} />
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

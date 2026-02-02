import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '@/app/context/ShopContext';
import { RotateCcw, Package, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export const Returns: React.FC = () => {
  const { user, returns, orders } = useShop();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <RotateCcw size={64} className="mx-auto mb-4 text-gray-400" />
        <h1 className="text-2xl font-bold mb-4">Please log in to view your returns</h1>
        <Link to="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  const activeReturns = returns.filter(r => r.status === 'pending' || r.status === 'approved');
  const historyReturns = returns.filter(r => r.status === 'completed' || r.status === 'rejected');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="text-yellow-600" />;
      case 'approved':
        return <CheckCircle size={20} className="text-blue-600" />;
      case 'completed':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <AlertCircle size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
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

  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const displayReturns = activeTab === 'active' ? activeReturns : historyReturns;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">RETURNS & REFUNDS</h1>
        <p className="text-gray-600">Manage your return requests and track refunds</p>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'active' ? 'border-black font-bold' : 'border-transparent'
            }`}
          >
            Active Returns ({activeReturns.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'history' ? 'border-black font-bold' : 'border-transparent'
            }`}
          >
            Return History ({historyReturns.length})
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-bold mb-1">Return Policy</p>
            <p>
              You can return items within 28 days of delivery. Items must be unused, 
              in original packaging with all tags attached. Refunds will be processed 
              within 5-7 business days after we receive your return.
            </p>
          </div>
        </div>
      </div>

      {/* Eligible Orders for Return */}
      {activeTab === 'active' && deliveredOrders.length > 0 && returns.length === 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Eligible Orders for Return</h2>
          <div className="space-y-4">
            {deliveredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-bold">{order.id}</p>
                  </div>
                  <Link
                    to={`/return-order/${order.id}`}
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 text-center"
                  >
                    Request Return
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded border">
                        <ImageWithFallback
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Returns List */}
      {displayReturns.length === 0 ? (
        <div className="text-center py-16">
          <RotateCcw size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">
            {activeTab === 'active' ? 'No active returns' : 'No return history'}
          </h2>
          <p className="text-gray-600 mb-6">
            {activeTab === 'active' 
              ? 'You have no pending or approved return requests'
              : 'Your completed and rejected returns will appear here'
            }
          </p>
          {deliveredOrders.length > 0 && (
            <Link
              to="/orders"
              className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800"
            >
              View Orders
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {displayReturns.map((returnRequest) => {
            const order = orders.find(o => o.id === returnRequest.orderId);
            return (
              <div key={returnRequest.id} className="border rounded-lg overflow-hidden">
                {/* Return Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Return ID</p>
                        <p className="font-bold">{returnRequest.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-medium">{returnRequest.orderId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Request Date</p>
                        <p className="font-medium">{formatDate(returnRequest.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(returnRequest.status)}`}>
                        {getStatusIcon(returnRequest.status)}
                        {returnRequest.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Return Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-4">
                    {returnRequest.items.map((item, idx) => (
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
                          <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Return Reason */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Return Reason:</p>
                    <p className="text-sm text-gray-600">{returnRequest.reason}</p>
                  </div>

                  {/* Refund Amount */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="font-bold">Refund Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${returnRequest.refundAmount.toFixed(2)}
                    </p>
                  </div>

                  {/* Status Info */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      {returnRequest.status === 'pending' && 
                        'Your return request is being reviewed. We will notify you once it is approved.'
                      }
                      {returnRequest.status === 'approved' && 
                        'Your return has been approved. Please ship the items back to us.'
                      }
                      {returnRequest.status === 'completed' && 
                        'Your return has been completed and refund has been processed.'
                      }
                      {returnRequest.status === 'rejected' && 
                        'Your return request has been rejected. Please contact support for more information.'
                      }
                    </p>
                  </div>

                  {/* Actions */}
                  {returnRequest.status === 'pending' && (
                    <div className="mt-4">
                      <button className="w-full border border-red-600 text-red-600 py-2 rounded hover:bg-red-50">
                        Cancel Return Request
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

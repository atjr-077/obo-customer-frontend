import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '@/app/context/ShopContext';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { toast } from 'sonner';

export const ReturnOrder: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, createReturnRequest } = useShop();
  
  const order = getOrder(orderId || '');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    'Product damaged or defective',
    'Wrong item received',
    'Size or fit issues',
    'Product not as described',
    'Changed my mind',
    'Quality not as expected',
    'Other',
  ];

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <button onClick={() => navigate(-1)} className="text-blue-600 underline">
          Go back
        </button>
      </div>
    );
  }

  const toggleItem = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const calculateRefund = () => {
    let total = 0;
    selectedItems.forEach((index) => {
      const item = order.items[index];
      total += item.product.price * item.quantity;
    });
    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.size === 0) {
      toast.error('Please select at least one item to return');
      return;
    }

    if (!reason) {
      toast.error('Please select a reason for return');
      return;
    }

    if (reason === 'Other' && !otherReason.trim()) {
      toast.error('Please provide a reason for return');
      return;
    }

    const itemsToReturn = Array.from(selectedItems).map(index => order.items[index]);
    const finalReason = reason === 'Other' ? otherReason : reason;

    createReturnRequest(order.id, itemsToReturn, finalReason);
    toast.success('Return request submitted successfully!');
    navigate('/returns');
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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 hover:text-gray-600"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Return Order</h1>
        <p className="text-gray-600 mb-8">
          Order #{order.id} • Placed on {formatDate(order.date)}
        </p>

        {/* Return Policy Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle size={24} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-900">
              <p className="font-bold mb-1">Important Information</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Returns are accepted within 28 days of delivery</li>
                <li>Items must be unused and in original packaging with tags</li>
                <li>Refunds will be processed within 5-7 business days</li>
                <li>Return shipping is free for eligible returns</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Select Items */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Select Items to Return</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  onClick={() => toggleItem(index)}
                  className={`flex gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedItems.has(index)
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(index)}
                      onChange={() => toggleItem(index)}
                      className="w-5 h-5 rounded border-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border">
                    <ImageWithFallback
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-1">{item.product.name}</p>
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
          </div>

          {/* Return Reason */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Reason for Return</h2>
            <div className="space-y-3">
              {reasons.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-5 h-5"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            {reason === 'Other' && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Please specify the reason
                </label>
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  rows={4}
                  placeholder="Tell us more about why you're returning this item..."
                  required
                />
              </div>
            )}
          </div>

          {/* Refund Summary */}
          {selectedItems.size > 0 && (
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Refund Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Items Selected:</span>
                  <span>{selectedItems.size}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${calculateRefund().toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Refund:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${calculateRefund().toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Refund will be processed to your original payment method within 5-7 business days
                after we receive your return.
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-black text-black py-4 rounded-lg font-medium hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedItems.size === 0 || !reason}
              className="flex-1 bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Return Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

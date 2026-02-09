import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Tag, CreditCard, Wallet, Building, Smartphone } from 'lucide-react';
import { useShop } from '@/app/context/ShopContext';
import { toast } from 'sonner';
import type { Address } from '@/app/context/ShopContext';

export const Checkout: React.FC = () => {
  const { cart, getTotalPrice, user, createOrder, applyPromoCode, removePromoCode, appliedPromo } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    user?.addresses.find(a => a.isDefault) || user?.addresses[0] || null
  );
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [promoCode, setPromoCode] = useState('');
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: user?.phone || '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: '',
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 4.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = () => {
    if (applyPromoCode(promoCode)) {
      toast.success('Promo code applied successfully!');
      setPromoCode('');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!selectedAddress && !formData.address) {
        toast.error('Please select or enter a shipping address');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }
      setStep(3);
    } else {
      // Process payment
      const deliveryAddress: Address = selectedAddress || {
        id: 'temp',
        fullName: `${formData.firstName} ${formData.lastName}`,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
        isDefault: false,
      };

      const order = createOrder(paymentMethod, deliveryAddress);
      toast.success('Order placed successfully!');
      navigate(`/track-order/${order.id}`);
    }
  };

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'wallet', label: 'Digital Wallet', icon: Wallet },
    { id: 'netbanking', label: 'Net Banking', icon: Building },
    { id: 'cod', label: 'Cash on Delivery', icon: null },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">CHECKOUT</h1>

      {/* Progress Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-4">
          {[
            { num: 1, label: 'Shipping' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Review' },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s.num ? 'bg-black text-white' : 'bg-gray-200'
                  }`}
                >
                  {step > s.num ? <Check size={20} /> : s.num}
                </div>
                <span className="hidden md:inline">{s.label}</span>
              </div>
              {idx < 2 && <div className="w-12 h-0.5 bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Saved Addresses */}
                {user && user.addresses.length > 0 && (
                  <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">SELECT DELIVERY ADDRESS</h2>
                    <div className="space-y-3">
                      {user.addresses.map((address) => (
                        <label
                          key={address.id}
                          className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAddress?.id === address.id
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddress?.id === address.id}
                            onChange={() => setSelectedAddress(address)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold">{address.fullName}</p>
                              {address.isDefault && (
                                <span className="bg-black text-white text-xs px-2 py-1 rounded">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{address.street}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/add-address')}
                      className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add New Address
                    </button>
                  </div>
                )}

                {/* New Address Form */}
                {(!user || user.addresses.length === 0 || !selectedAddress) && (
                  <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-6">SHIPPING ADDRESS</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="col-span-2 border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="col-span-2 border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">SELECT PAYMENT METHOD</h2>
                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      {method.icon && <method.icon size={24} />}
                      <span className="font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>

                {/* Payment Details */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Name on Card"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        required
                        className="border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        name="cardCvv"
                        placeholder="CVV"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        required
                        className="border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      name="upiId"
                      placeholder="Enter UPI ID (e.g., example@upi)"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-900">
                      <strong>Note:</strong> Cash on Delivery available for orders under $500. 
                      Additional charges of $2.99 will apply.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">SHIPPING ADDRESS</h2>
                  {selectedAddress ? (
                    <>
                      <p className="font-medium">{selectedAddress.fullName}</p>
                      <p className="text-gray-600">{selectedAddress.street}</p>
                      <p className="text-gray-600">
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                      </p>
                      <p className="text-gray-600">Phone: {selectedAddress.phone}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                      <p className="text-gray-600">{formData.address}</p>
                      <p className="text-gray-600">{formData.city}, {formData.state} {formData.zipCode}</p>
                      <p className="text-gray-600">Phone: {formData.phone}</p>
                    </>
                  )}
                </div>

                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">PAYMENT METHOD</h2>
                  <p className="font-medium">
                    {paymentMethods.find(m => m.id === paymentMethod)?.label}
                  </p>
                </div>

                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">ORDER ITEMS</h2>
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 mb-4 last:mb-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Size: {item.size}, Color: {item.color}</p>
                        <p className="text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 border border-black py-4 rounded font-bold hover:bg-gray-100 transition-colors"
                >
                  BACK
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-black text-white py-4 rounded font-bold hover:bg-gray-800 transition-colors"
              >
                {step === 3 ? 'PLACE ORDER' : 'CONTINUE'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">ORDER SUMMARY</h2>
            
            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Promo Code</label>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-900">{appliedPromo.code}</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
                  >
                    Apply
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Try: WELCOME10, SAVE20, FLAT50
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedPromo.code})</span>
                  <span>
                    -{appliedPromo.type === 'percentage' 
                      ? `${appliedPromo.discount}%` 
                      : `$${appliedPromo.discount.toFixed(2)}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {paymentMethod === 'cod' && (
                <div className="flex justify-between">
                  <span>COD Charges</span>
                  <span>$2.99</span>
                </div>
              )}
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(total + (paymentMethod === 'cod' ? 2.99 : 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
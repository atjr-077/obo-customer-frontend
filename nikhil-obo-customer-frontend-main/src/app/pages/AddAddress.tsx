import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '@/app/context/ShopContext';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export const AddAddress: React.FC = () => {
  const navigate = useNavigate();
  const { addAddress, user } = useShop();
  
  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    isDefault: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to add an address');
      navigate('/login');
      return;
    }

    if (!formData.fullName || !formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    addAddress(formData);
    toast.success('Address added successfully!');
    navigate('/account?tab=addresses');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ADD NEW ADDRESS</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-medium mb-2">
              Street Address *
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-2">
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="India">India</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-5 h-5 border-2 rounded focus:ring-2 focus:ring-black"
            />
            <label htmlFor="isDefault" className="text-sm font-medium">
              Set as default address
            </label>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-black text-black py-3 rounded-lg font-medium hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

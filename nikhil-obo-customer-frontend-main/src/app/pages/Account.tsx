import React, { useState } from 'react';
import { useShop } from '@/app/context/ShopContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Package, MapPin, CreditCard, RotateCcw, Edit2, Trash2 } from 'lucide-react';

export const Account: React.FC = () => {
  const { user, deleteAddress, setDefaultAddress } = useShop();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your account</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">MY ACCOUNT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 ${
              activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
          >
            <User size={20} />
            Profile
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="w-full text-left px-4 py-3 rounded flex items-center gap-3 hover:bg-gray-100"
          >
            <Package size={20} />
            Orders
          </button>
          <button
            onClick={() => navigate('/returns')}
            className="w-full text-left px-4 py-3 rounded flex items-center gap-3 hover:bg-gray-100"
          >
            <RotateCcw size={20} />
            Returns
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 ${
              activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
          >
            <MapPin size={20} />
            Addresses
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 ${
              activeTab === 'payment' ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
          >
            <CreditCard size={20} />
            Payment Methods
          </button>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">PROFILE INFORMATION</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={user.name}
                    readOnly
                    className="w-full border rounded px-4 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full border rounded px-4 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={user.phone || 'Not provided'}
                    readOnly
                    className="w-full border rounded px-4 py-2 bg-gray-50"
                  />
                </div>
                <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">SAVED ADDRESSES</h2>
                  <button
                    onClick={() => navigate('/add-address')}
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                  >
                    Add New Address
                  </button>
                </div>
                
                {user.addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">No saved addresses yet</p>
                    <button
                      onClick={() => navigate('/add-address')}
                      className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <p className="font-bold">{address.fullName}</p>
                            {address.isDefault && (
                              <span className="bg-black text-white text-xs px-2 py-1 rounded">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/edit-address/${address.id}`)}
                              className="p-2 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this address?')) {
                                  deleteAddress(address.id);
                                }
                              }}
                              className="p-2 hover:bg-red-50 text-red-600 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600">{address.street}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-gray-600">{address.country}</p>
                        <p className="text-gray-600 mt-2">Phone: {address.phone}</p>
                        
                        {!address.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(address.id)}
                            className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                          >
                            Set as default
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">PAYMENT METHODS</h2>
              <div className="text-center py-8">
                <CreditCard size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">No saved payment methods</p>
                <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                  Add Payment Method
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
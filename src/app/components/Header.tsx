import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, Bell } from 'lucide-react';
import { useShop } from '@/app/context/ShopContext';
import { SignOutButton } from '@clerk/clerk-react';
// FIXME: Uncomment this line when deploying to Figma/GitHub (see FIGMA_ASSETS_README.md)
 //import logoImage from 'figma:asset/355e85a53f8fd55bb85f4c9cfe98774e87cb561d.png';

export const Header: React.FC = () => {
  const { getTotalItems, user, notifications } = useShop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 px-4 text-sm">
        <p>FREE SHIPPING ON ORDERS OVER $50 | UP TO 70% OFF SALE</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            {/* FIXME: Uncomment img tag when deploying to Figma/GitHub (see FIGMA_ASSETS_README.md) */}
            { /*<img src={logoImage} alt="OBO HUB" className="h-10 md:h-12" />*/ }
            <h1 className="text-2xl font-bold">OBO HUB</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link to="/products?category=Women" className="hover:text-gray-600">
              WOMEN
            </Link>
            <Link to="/products?category=Men" className="hover:text-gray-600">
              MEN
            </Link>
            <Link to="/products?category=Shoes" className="hover:text-gray-600">
              SHOES
            </Link>
            <Link to="/products?category=Accessories" className="hover:text-gray-600">
              ACCESSORIES
            </Link>
            <Link to="/products?sale=true" className="text-red-600 hover:text-red-700">
              SALE
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <User size={24} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/account" className="block px-4 py-2 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                    Orders
                  </Link>
                  <Link to="/returns" className="block px-4 py-2 hover:bg-gray-100">
                    Returns
                  </Link>
                  <SignOutButton>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </SignOutButton>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-gray-100 rounded-full">
                <User size={24} />
              </Link>
            )}

            {user && (
              <Link to="/notifications" className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full relative">
              <Heart size={24} />
            </Link>

            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
              <ShoppingBag size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/products?category=Women"
              className="block py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              WOMEN
            </Link>
            <Link
              to="/products?category=Men"
              className="block py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              MEN
            </Link>
            <Link
              to="/products?category=Shoes"
              className="block py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              SHOES
            </Link>
            <Link
              to="/products?category=Accessories"
              className="block py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              ACCESSORIES
            </Link>
            <Link
              to="/products?sale=true"
              className="block py-2 text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              SALE
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

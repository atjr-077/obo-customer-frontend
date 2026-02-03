import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Help & Information */}
          <div>
            <h3 className="font-bold mb-4">HELP & INFORMATION</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/orders" className="hover:text-white">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-white">Returns & Refunds</Link></li>
              <li><Link to="/notifications" className="hover:text-white">Notifications</Link></li>
              <li><Link to="/account" className="hover:text-white">My Account</Link></li>
            </ul>
          </div>

          {/* About OBO HUB */}
          <div>
            <h3 className="font-bold mb-4">ABOUT OBO HUB</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link to="/press" className="hover:text-white">Press</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold mb-4">SHOP</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/products?category=Women" className="hover:text-white">Women</Link></li>
              <li><Link to="/products?category=Men" className="hover:text-white">Men</Link></li>
              <li><Link to="/products?category=Shoes" className="hover:text-white">Shoes</Link></li>
              <li><Link to="/products?category=Accessories" className="hover:text-white">Accessories</Link></li>
              <li><Link to="/products?sale=true" className="hover:text-white text-red-400">Sale</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold mb-4">CONNECT WITH US</h3>
            <p className="text-gray-400 mb-4">
              You're shopping from <span className="text-white">United States</span>
            </p>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 OBO HUB - Only Buy Original. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
              <Link to="/shipping" className="hover:text-white">Shipping Policy</Link>
              <Link to="/accessibility" className="hover:text-white">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
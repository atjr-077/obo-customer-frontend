import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useShop } from '@/app/context/ShopContext';
import { ProductCard } from '@/app/components/ProductCard';

export const Wishlist: React.FC = () => {
  const { wishlist } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Heart size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-gray-600 mb-8">
            Start adding your favorite items to your wishlist.
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
      <h1 className="text-3xl font-bold mb-8">MY WISHLIST ({wishlist.length} items)</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

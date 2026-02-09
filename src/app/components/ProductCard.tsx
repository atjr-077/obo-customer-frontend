import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '@/app/context/ShopContext';
import { useShop } from '@/app/context/ShopContext';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useShop();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg mb-3">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
            SALE
          </div>
        )}
        
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart
            size={20}
            className={inWishlist ? 'fill-red-500 text-red-500' : ''}
          />
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-gray-500">{product.brand}</p>
        <h3 className="font-medium line-clamp-2 group-hover:underline">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          {product.originalPrice ? (
            <>
              <span className="text-red-600 font-bold">₹{product.price.toFixed(2)}</span>
              <span className="text-gray-400 line-through text-sm">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-bold">₹{product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            ))}
          </div>
          <span className="text-gray-500">({product.reviews})</span>
        </div>
      </div>
    </Link>
  );
};

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Truck, RotateCcw, ShieldCheck, Star, Users, Share2 } from 'lucide-react';
import { mockProducts } from '@/app/data/products';
import { useShop } from '@/app/context/ShopContext';
import { ProductCard } from '@/app/components/ProductCard';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { toast } from 'sonner';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  
  const product = mockProducts.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'qa'>('details');

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl mb-4">Product not found</h1>
        <Link to="/products" className="text-blue-600 underline">
          Back to products
        </Link>
      </div>
    );
  }

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on OBO HUB`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const images = product.images || [product.image];
  const stock = product.stock || 10;
  const viewCount = Math.floor(Math.random() * 100) + 20;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:underline">Home</Link> / 
        <Link to={`/products?category=${product.category}`} className="hover:underline"> {product.category}</Link> / 
        <span> {product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg relative">
            <ImageWithFallback
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.originalPrice && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded font-bold">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === idx ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <Users size={16} />
            <span>{viewCount} people are viewing this product</span>
          </div>

          <div className="mb-6">
            {product.originalPrice ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
                <span className="bg-red-600 text-white px-2 py-1 text-sm font-bold rounded">
                  SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold">₹{product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Stock Availability */}
          <div className="mb-6">
            {product.inStock ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">
                  In Stock {stock > 5 ? '' : `(Only ${stock} left)`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold">SIZE</span>
              <button className="text-sm underline">Size Guide</button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border rounded py-2 text-sm ${
                    selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <span className="font-bold block mb-3">COLOR: {selectedColor}</span>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded ${
                    selectedColor === color
                      ? 'bg-black text-white border-black'
                      : 'hover:border-black'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <span className="font-bold block mb-3">QUANTITY</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 mb-6">
            <div className="flex gap-4">
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-orange-600 text-white py-4 rounded font-bold hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                BUY NOW
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className="w-14 h-14 border rounded hover:bg-gray-100 flex items-center justify-center"
              >
                <Heart
                  size={24}
                  className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}
                />
              </button>
              <button
                onClick={handleShare}
                className="w-14 h-14 border rounded hover:bg-gray-100 flex items-center justify-center"
              >
                <Share2 size={24} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-black text-white py-4 rounded font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ADD TO BAG
            </button>
          </div>

          {/* Features */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex gap-3">
              <Truck size={24} />
              <div>
                <p className="font-bold">FREE DELIVERY</p>
                <p className="text-sm text-gray-600">On orders over ₹50 • Delivery in 3-5 days</p>
              </div>
            </div>
            <div className="flex gap-3">
              <RotateCcw size={24} />
              <div>
                <p className="font-bold">FREE RETURNS</p>
                <p className="text-sm text-gray-600">28 days return policy</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck size={24} />
              <div>
                <p className="font-bold">100% AUTHENTIC</p>
                <p className="text-sm text-gray-600">Only Buy Original - Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <div className="border-b mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === 'details' ? 'border-black font-bold' : 'border-transparent'
              }`}
            >
              PRODUCT DETAILS
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === 'reviews' ? 'border-black font-bold' : 'border-transparent'
              }`}
            >
              REVIEWS ({product.reviews})
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === 'qa' ? 'border-black font-bold' : 'border-transparent'
              }`}
            >
              Q&A
            </button>
          </div>
        </div>

        {activeTab === 'details' && (
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            <div className="mt-6">
              <h3 className="font-bold mb-2">Features:</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Premium quality materials</li>
                <li>Comfortable fit for all-day wear</li>
                <li>Easy care and maintenance</li>
                <li>Available in multiple colors and sizes</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-bold">{product.rating}</div>
              <div>
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Based on {product.reviews} reviews</p>
              </div>
            </div>
            <p className="text-gray-600">Customer reviews coming soon...</p>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="space-y-6">
            <p className="text-gray-600">Have a question about this product? Ask away!</p>
            <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
              Ask a Question
            </button>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">YOU MIGHT ALSO LIKE</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
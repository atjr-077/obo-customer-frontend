import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/app/components/ProductCard';
import { mockProducts } from '@/app/data/products';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export const Home: React.FC = () => {
  const saleProducts = mockProducts.filter(p => p.originalPrice).slice(0, 4);
  const newArrivals = mockProducts.slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gray-100">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1620777888789-0ee95b57a277?w=1920"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">NEW SEASON STYLES</h1>
            <p className="text-xl md:text-2xl mb-8">Discover the latest trends</p>
            <Link
              to="/products"
              className="inline-block bg-white text-black px-8 py-4 font-bold hover:bg-gray-100 transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">SHOP BY CATEGORY</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'WOMEN', image: 'https://images.unsplash.com/photo-1620777888789-0ee95b57a277?w=600', category: 'Women' },
            { name: 'MEN', image: 'https://images.unsplash.com/photo-1543960713-7538001f7c7d?w=600', category: 'Men' },
            { name: 'SHOES', image: 'https://images.unsplash.com/photo-1622760807301-4d2351a5a942?w=600', category: 'Shoes' },
            { name: 'ACCESSORIES', image: 'https://images.unsplash.com/photo-1613896640137-bb5b31496315?w=600', category: 'Accessories' },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.category}`}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <ImageWithFallback
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sale Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">SALE - UP TO 70% OFF</h2>
            <Link to="/products?sale=true" className="underline hover:no-underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">NEW ARRIVALS</h2>
          <Link to="/products" className="underline hover:no-underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="relative h-[400px] bg-gray-900">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1543960713-7538001f7c7d?w=1920"
          alt="Banner"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">PREMIUM QUALITY</h2>
            <p className="text-xl mb-6">Curated fashion for every style</p>
            <Link
              to="/products"
              className="inline-block bg-white text-black px-8 py-4 font-bold hover:bg-gray-100 transition-colors"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-bold mb-2">FREE DELIVERY</h3>
            <p className="text-gray-600">On orders over $50</p>
          </div>
          <div>
            <div className="text-4xl mb-4">↩️</div>
            <h3 className="font-bold mb-2">EASY RETURNS</h3>
            <p className="text-gray-600">28 days return policy</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-bold mb-2">SECURE PAYMENT</h3>
            <p className="text-gray-600">Safe & encrypted checkout</p>
          </div>
        </div>
      </section>
    </div>
  );
};

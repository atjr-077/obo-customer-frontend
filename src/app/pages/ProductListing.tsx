import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/app/components/ProductCard';
import { mockProducts, categories } from '@/app/data/products';

export const ProductListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState('featured');

  const categoryParam = searchParams.get('category');
  const saleParam = searchParams.get('sale');
  const searchQuery = searchParams.get('search');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Filter by URL params
    if (categoryParam) {
      filtered = filtered.filter(p => p.category === categoryParam);
    }
    if (saleParam) {
      filtered = filtered.filter(p => p.originalPrice);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p =>
        p.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter(p =>
        p.colors.some(color => selectedColors.includes(color))
      );
    }

    // Filter by price
    filtered = filtered.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Already in order
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return filtered;
  }, [categoryParam, saleParam, searchQuery, selectedCategories, selectedSizes, selectedColors, priceRange, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const allSizes = Array.from(new Set(mockProducts.flatMap(p => p.sizes)));
  const allColors = Array.from(new Set(mockProducts.flatMap(p => p.colors)));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {categoryParam || 'All Products'}
          </h1>
          <p className="text-gray-600">
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
          >
            <SlidersHorizontal size={20} />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
          <div className="space-y-6 sticky top-24">
            {/* Categories */}
            <div>
              <button className="flex justify-between items-center w-full font-bold mb-4">
                <span>CATEGORY</span>
                <ChevronDown size={20} />
              </button>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                      className="w-4 h-4"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <button className="flex justify-between items-center w-full font-bold mb-4">
                <span>SIZE</span>
                <ChevronDown size={20} />
              </button>
              <div className="grid grid-cols-4 gap-2">
                {allSizes.slice(0, 12).map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`border rounded px-2 py-1 text-sm ${
                      selectedSizes.includes(size)
                        ? 'bg-black text-white'
                        : 'hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <button className="flex justify-between items-center w-full font-bold mb-4">
                <span>COLOR</span>
                <ChevronDown size={20} />
              </button>
              <div className="space-y-2">
                {allColors.slice(0, 10).map((color) => (
                  <label key={color} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleColor(color)}
                      className="w-4 h-4"
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <button className="flex justify-between items-center w-full font-bold mb-4">
                <span>PRICE</span>
                <ChevronDown size={20} />
              </button>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

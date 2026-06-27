import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, X, Search } from 'lucide-react';
import { useStore } from '../store';
import { categoryLabels } from '../data';
import ProductCard from './ProductCard';
import type { ProductCategory } from '../types';

export default function ProductListing() {
  const { state, dispatch, getFilteredProducts } = useStore();
  const [showFilters, setShowFilters] = useState(false);
  const filtered = getFilteredProducts();

  const categories: ('all' | ProductCategory)[] = [
    'all',
    'notion-templates',
    'canva-templates',
    'ai-prompts',
    'course-bundles',
    'design-assets',
  ];

  const sortOptions: { value: typeof state.filters.sortBy; label: string }[] = [
    { value: 'bestselling', label: 'Bestselling' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <section className="py-8 sm:py-12 bg-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500 mt-2">
            Discover premium digital templates and assets for your workflow.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={state.filters.searchQuery}
              onChange={(e) =>
                dispatch({ type: 'SET_FILTER', filters: { searchQuery: e.target.value } })
              }
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
            {state.filters.searchQuery && (
              <button
                onClick={() => dispatch({ type: 'SET_FILTER', filters: { searchQuery: '' } })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary-300 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Sort */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={state.filters.sortBy}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FILTER',
                    filters: { sortBy: e.target.value as any },
                  })
                }
                className="w-full sm:w-auto appearance-none px-4 pr-10 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <span className="text-sm text-gray-500 hidden sm:block">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block w-full lg:w-64 flex-shrink-0`}
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 sticky top-28">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Filters
                </h3>
                <button
                  onClick={() => {
                    dispatch({
                      type: 'SET_FILTER',
                      filters: { category: 'all', priceRange: [0, 5000], searchQuery: '' },
                    });
                  }}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Category
                </h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        dispatch({ type: 'SET_FILTER', filters: { category: cat } })
                      }
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        state.filters.category === cat
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {categoryLabels[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Price Range
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'All Prices', range: [0, 5000] as [number, number] },
                    { label: 'Under ₹500', range: [0, 500] as [number, number] },
                    { label: '₹500 - ₹1,000', range: [500, 1000] as [number, number] },
                    { label: '₹1,000 - ₹2,000', range: [1000, 2000] as [number, number] },
                    { label: 'Over ₹2,000', range: [2000, 5000] as [number, number] },
                  ].map(({ label, range }) => (
                    <button
                      key={label}
                      onClick={() =>
                        dispatch({ type: 'SET_FILTER', filters: { priceRange: range } })
                      }
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        state.filters.priceRange[0] === range[0] &&
                        state.filters.priceRange[1] === range[1]
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Close filters on mobile */}
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() =>
                    dispatch({
                      type: 'SET_FILTER',
                      filters: { category: 'all', priceRange: [0, 5000], searchQuery: '' },
                    })
                  }
                  className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product, i) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

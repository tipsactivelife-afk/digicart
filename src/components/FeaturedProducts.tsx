import { ArrowRight } from 'lucide-react';
import { products } from '../data';
import { useStore } from '../store';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const { dispatch } = useStore();
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
              Featured Collection
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Our Best Sellers
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg">
              Hand-picked templates and assets loved by thousands of creators and entrepreneurs.
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', page: 'products' })}
            className="group flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
            >
              <ProductCard product={product} featured />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

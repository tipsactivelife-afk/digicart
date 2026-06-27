import { ShoppingCart, Eye, Star, Download, Clock } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store';
import { categoryEmojis } from '../data';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const { state, dispatch } = useStore();
  const inCart = state.cart.some((item) => item.product.id === product.id);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div
      className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary-100/30 hover:border-primary-200/50 transition-all duration-300 hover:-translate-y-1 flex flex-col ${
        featured ? '' : ''
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {product.bestseller && (
            <span className="bg-accent-400 text-accent-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              🔥 Bestseller
            </span>
          )}
          {product.newArrival && (
            <span className="bg-primary-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              ✨ New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Limited stock */}
        {product.limitedOffer && product.stockLeft && (
          <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Clock className="w-3 h-3" />
            Only {product.stockLeft} left
          </div>
        )}

        {/* Quick Action Buttons (appear on hover) */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: 'NAVIGATE', page: 'product-detail', productId: product.id });
            }}
            className="flex-1 py-2.5 bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!inCart) {
                dispatch({ type: 'ADD_TO_CART', product });
              }
            }}
            className={`py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-lg transition-colors ${
              inCart
                ? 'bg-green-500 text-white'
                : 'bg-primary-600/95 backdrop-blur-sm text-white hover:bg-primary-700'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="p-5 flex flex-col flex-1 cursor-pointer"
        onClick={() =>
          dispatch({ type: 'NAVIGATE', page: 'product-detail', productId: product.id })
        }
      >
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs">
            {categoryEmojis[product.category]}
          </span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {product.category.replace('-', ' ')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-primary-700 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.floor(product.rating)
                    ? 'text-accent-400 fill-accent-400'
                    : 'text-gray-200 fill-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-500">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              {product.currency}{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {product.currency}{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-primary-600 font-medium">
            <Download className="w-3.5 h-3.5" />
            Instant
          </div>
        </div>
      </div>
    </div>
  );
}

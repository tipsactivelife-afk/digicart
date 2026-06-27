import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Star,
  Check,
  Download,
  ArrowLeft,
  Shield,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  FileText,
  Target,
  BookOpen,
  Package,
} from 'lucide-react';
import { useStore } from '../store';
import { reviews, products, categoryEmojis, categoryLabels } from '../data';
import ProductCard from './ProductCard';

export default function ProductDetail() {
  const { state, dispatch } = useStore();
  const [currentImage, setCurrentImage] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  const product = products.find((p) => p.id === state.selectedProductId);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.selectedProductId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const inCart = state.cart.some((item) => item.product.id === product.id);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <section className="py-8 sm:py-12 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => dispatch({ type: 'NAVIGATE', page: 'products' })}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Products
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-500">
              {categoryEmojis[product.category]} {categoryLabels[product.category]}
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-primary-600 font-medium">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group">
                <img
                  src={product.images[currentImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImage(
                          (currentImage - 1 + product.images.length) % product.images.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImage((currentImage + 1) % product.images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.bestseller && (
                    <span className="bg-accent-400 text-accent-900 text-xs font-bold px-3 py-1.5 rounded-full">
                      🔥 Bestseller
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        currentImage === i
                          ? 'border-primary-500 ring-2 ring-primary-100'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full">
                {categoryEmojis[product.category]}{' '}
                {categoryLabels[product.category]}
              </span>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Sales */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(product.rating)
                          ? 'text-accent-400 fill-accent-400'
                          : 'text-gray-200 fill-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-700 ml-1">
                    {product.rating}
                  </span>
                  <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                </div>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {product.salesCount.toLocaleString()} sold
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {product.currency}{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {product.currency}{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Save {product.currency}
                      {(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Limited Stock */}
              {product.limitedOffer && product.stockLeft && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100">
                  <Clock className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-red-700">
                    🔥 Limited time offer — Only {product.stockLeft} left at this price!
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    if (!inCart) dispatch({ type: 'ADD_TO_CART', product });
                    dispatch({ type: 'TOGGLE_CART' });
                  }}
                  className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                    inCart
                      ? 'bg-green-500 text-white shadow-green-200'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-primary-200 hover:from-primary-700 hover:to-primary-800 animate-pulse-glow'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {inCart ? 'View in Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => {
                    if (!inCart) dispatch({ type: 'ADD_TO_CART', product });
                    dispatch({ type: 'NAVIGATE', page: 'checkout' });
                  }}
                  className="flex-1 py-4 px-6 rounded-2xl font-semibold text-lg border-2 border-primary-200 text-primary-700 hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-primary-500" /> Instant Download
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary-500" /> Secure Payment
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary-500" /> Lifetime Updates
                </span>
              </div>

              {/* Product Details */}
              <div className="border-t border-gray-100 pt-6 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-500">Format</span>
                  <span className="font-medium">{product.fileFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Size</span>
                  <span className="font-medium">{product.fileSize}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Sections */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {/* What's Included */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">What's Included</h3>
              </div>
              <ul className="space-y-3">
                {product.whatsIncluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who This Is For */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Who This Is For</h3>
              </div>
              <ul className="space-y-3">
                {product.whoIsFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="text-primary-500 font-bold">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Use */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">How to Use</h3>
              </div>
              <ol className="space-y-3">
                {product.howToUse.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Reviews */}
          {productReviews.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary-500" />
                Customer Reviews
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {productReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl border border-gray-100 p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{review.userName}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= review.rating
                                    ? 'text-accent-400 fill-accent-400'
                                    : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          {review.verified && (
                            <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 ml-auto">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sticky Add to Cart Bar */}
      {isSticky && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-40 animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="hidden sm:block w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary-700">
                    {product.currency}{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      {product.currency}{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (!inCart) dispatch({ type: 'ADD_TO_CART', product });
                dispatch({ type: 'TOGGLE_CART' });
              }}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 flex-shrink-0 transition-all ${
                inCart
                  ? 'bg-green-500 text-white'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

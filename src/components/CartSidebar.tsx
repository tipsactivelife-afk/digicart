import { X, Trash2, ShoppingBag, Tag, ArrowRight, Gift } from 'lucide-react';
import { useStore } from '../store';

export default function CartSidebar() {
  const { state, dispatch, getCartTotal, getCartSavings, getDiscountedTotal } = useStore();

  if (!state.isCartOpen) return null;

  const total = getCartTotal();
  const savings = getCartSavings();
  const finalTotal = getDiscountedTotal();
  const bundleDiscount = state.cart.length >= 3 && !state.discountApplied;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => dispatch({ type: 'CLOSE_CART' })}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
            <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {state.cart.length} {state.cart.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {state.cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mb-6">
                Browse our collection of premium digital templates and assets.
              </p>
              <button
                onClick={() => {
                  dispatch({ type: 'NAVIGATE', page: 'products' });
                  dispatch({ type: 'CLOSE_CART' });
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-2xl group hover:bg-primary-50/50 transition-colors"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-100 to-primary-200">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {item.product.shortDescription}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary-700">
                          {item.product.currency}{item.product.price.toLocaleString()}
                        </span>
                        {item.product.originalPrice > item.product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {item.product.currency}{item.product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          dispatch({ type: 'REMOVE_FROM_CART', productId: item.product.id })
                        }
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bundle Discount Info */}
              {state.cart.length < 3 && (
                <div className="flex items-start gap-3 p-4 bg-accent-50 rounded-2xl border border-accent-200">
                  <Gift className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-accent-800">
                      Add {3 - state.cart.length} more {3 - state.cart.length === 1 ? 'item' : 'items'} for 20% off!
                    </p>
                    <p className="text-xs text-accent-600 mt-0.5">
                      Bundle discount applies automatically.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.cart.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4">
            {/* Discount Code */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={state.discountCode}
                  onChange={(e) =>
                    dispatch({ type: 'SET_DISCOUNT_CODE', code: e.target.value })
                  }
                  placeholder="Discount code"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
              <button
                onClick={() => dispatch({ type: 'APPLY_DISCOUNT' })}
                className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>You save</span>
                  <span>-₹{savings.toLocaleString()}</span>
                </div>
              )}
              {state.discountApplied && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon (10% off)</span>
                  <span>-₹{Math.round(total * 0.1).toLocaleString()}</span>
                </div>
              )}
              {bundleDiscount && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Bundle discount (20% off)</span>
                  <span>-₹{Math.round(total * 0.2).toLocaleString()}</span>
                </div>
              )}
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                dispatch({ type: 'NAVIGATE', page: 'checkout' });
                dispatch({ type: 'CLOSE_CART' });
              }}
              className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>🔒 SSL Secure</span>
              <span>⚡ Instant Download</span>
              <span>✓ Money-back Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

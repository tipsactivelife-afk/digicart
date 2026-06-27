import { useState } from 'react';
import {
  CreditCard,
  Shield,
  Lock,
  ArrowLeft,
  Tag,
  Check,
  Smartphone,
  Wallet,
  Globe,
} from 'lucide-react';
import { useStore } from '../store';

export default function Checkout() {
  const { state, dispatch, getCartTotal, getCartSavings, getDiscountedTotal } = useStore();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = getCartTotal();
  const savings = getCartSavings();
  const finalTotal = getDiscountedTotal();
  const bundleDiscount = state.cart.length >= 3 && !state.discountApplied;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!state.checkoutEmail || !/^\S+@\S+\.\S+$/.test(state.checkoutEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!state.checkoutName || state.checkoutName.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!validate()) return;
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      dispatch({ type: 'COMPLETE_ORDER' });
    }, 2000);
  };

  if (state.cart.length === 0) {
    return (
      <section className="py-20 bg-surface min-h-screen">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products before checking out.</p>
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', page: 'products' })}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-surface min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', page: 'products' })}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={state.checkoutEmail}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_CHECKOUT_FIELD',
                        field: 'checkoutEmail',
                        value: e.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 bg-gray-50 rounded-xl border text-sm focus:ring-2 outline-none transition-all ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                        : 'border-gray-200 focus:ring-primary-100 focus:border-primary-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Download links will be sent to this email
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={state.checkoutName}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_CHECKOUT_FIELD',
                        field: 'checkoutName',
                        value: e.target.value,
                      })
                    }
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 bg-gray-50 rounded-xl border text-sm focus:ring-2 outline-none transition-all ${
                      errors.name
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                        : 'border-gray-200 focus:ring-primary-100 focus:border-primary-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country
                  </label>
                  <select
                    value={state.checkoutCountry}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_CHECKOUT_FIELD',
                        field: 'checkoutCountry',
                        value: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none transition-all"
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Payment Method</h2>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { key: 'card' as const, icon: CreditCard, label: 'Card' },
                  { key: 'upi' as const, icon: Smartphone, label: 'UPI' },
                  { key: 'wallet' as const, icon: Wallet, label: 'Wallet' },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setPaymentMethod(key)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === key
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        paymentMethod === key ? 'text-primary-600' : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        paymentMethod === key ? 'text-primary-700' : 'text-gray-600'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Card form (demo) */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Expiry
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                  />
                  <div className="flex gap-3 mt-3">
                    {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                      <span
                        key={app}
                        className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="space-y-2">
                  {['PayPal', 'Apple Pay', 'Google Pay'].map((wallet) => (
                    <button
                      key={wallet}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-all text-left flex items-center gap-3"
                    >
                      <Globe className="w-4 h-4 text-gray-400" />
                      {wallet}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-28 space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {state.cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-sm font-bold text-primary-700">
                        {item.product.currency}{item.product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

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
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none"
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
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Product Savings</span>
                    <span>-₹{savings.toLocaleString()}</span>
                  </div>
                )}
                {state.discountApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount (10%)</span>
                    <span>-₹{Math.round(total * 0.1).toLocaleString()}</span>
                  </div>
                )}
                {bundleDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Bundle Discount (20%)</span>
                    <span>-₹{Math.round(total * 0.2).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST)</span>
                  <span>Included</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-1">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-lg rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ₹{finalTotal.toLocaleString()}
                  </>
                )}
              </button>

              {/* Trust */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Money-back Guarantee</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 text-center">
                By completing this purchase, you agree to our{' '}
                <button
                  onClick={() => dispatch({ type: 'NAVIGATE', page: 'terms' })}
                  className="text-primary-500 hover:underline"
                >
                  Terms
                </button>{' '}
                and{' '}
                <button
                  onClick={() => dispatch({ type: 'NAVIGATE', page: 'privacy' })}
                  className="text-primary-500 hover:underline"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

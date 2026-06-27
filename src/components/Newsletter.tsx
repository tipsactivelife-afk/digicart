import { useState } from 'react';
import { Send, Gift, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-primary-50 via-accent-50/30 to-primary-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Lead Magnet Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full text-sm font-medium text-accent-700 mb-6">
          <Gift className="w-4 h-4" />
          Free Notion Starter Pack included!
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Get Exclusive Deals & Free Templates
        </h2>
        <p className="text-gray-600 mt-3 max-w-lg mx-auto">
          Join 5,000+ subscribers. Get a <span className="font-semibold text-primary-700">free Notion starter pack</span> plus
          weekly deals, new product launches, and creator tips.
        </p>

        {submitted ? (
          <div className="mt-8 inline-flex items-center gap-3 px-6 py-4 bg-green-50 border border-green-200 rounded-2xl animate-bounce-in">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div className="text-left">
              <p className="font-semibold text-green-800">You're in! 🎉</p>
              <p className="text-sm text-green-600">Check your email for the free starter pack.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-3.5 bg-white rounded-xl border border-gray-200 text-sm focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all shadow-sm"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 group"
            >
              Subscribe
              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
        )}

        <p className="text-xs text-gray-400 mt-4">
          No spam, ever. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}

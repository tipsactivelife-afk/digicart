import { Cookie, Shield } from 'lucide-react';
import { useStore } from '../store';

export default function CookieConsent() {
  const { state, dispatch } = useStore();

  if (!state.showCookieConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-down">
      <div className="max-w-3xl mx-auto bg-gray-900 text-white rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-6 h-6 text-accent-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">We use cookies 🍪</p>
            <p className="text-xs text-gray-400 mt-1">
              We use essential cookies for site functionality and optional analytics cookies to
              improve your experience. Read our{' '}
              <button
                onClick={() => dispatch({ type: 'NAVIGATE', page: 'privacy' })}
                className="text-primary-400 hover:underline"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={() => dispatch({ type: 'DISMISS_COOKIE_CONSENT' })}
            className="flex-1 sm:flex-initial px-4 py-2 text-sm font-medium text-gray-400 hover:text-white border border-gray-700 rounded-xl hover:border-gray-500 transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={() => dispatch({ type: 'DISMISS_COOKIE_CONSENT' })}
            className="flex-1 sm:flex-initial px-5 py-2 text-sm font-medium bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

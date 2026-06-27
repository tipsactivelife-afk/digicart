import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import { useStore } from '../store';

export default function ThankYou() {
  const { dispatch } = useStore();

  return (
    <section className="py-20 bg-surface min-h-screen">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Success Animation */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
          <CheckCircle className="w-14 h-14 text-green-500" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 animate-fade-in-up">
          Thank You! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-2 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          Your order has been confirmed.
        </p>
        <p className="text-sm text-gray-500 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          Order #DC-{Math.random().toString(36).substr(2, 8).toUpperCase()}
        </p>

        {/* What happens next */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-left space-y-5 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <h3 className="text-lg font-bold text-gray-900">What happens next?</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Check your email</p>
                <p className="text-sm text-gray-500">
                  We've sent download links and instructions to your email address.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Download your files</p>
                <p className="text-sm text-gray-500">
                  Click the download links in the email or access them from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Download (demo) */}
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Download</h3>
          <button className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download All Files
          </button>
          <p className="text-xs text-gray-500 mt-2">Links expire in 30 days.</p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', page: 'dashboard' })}
            className="flex-1 py-3 px-6 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', page: 'products' })}
            className="flex-1 py-3 px-6 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all flex items-center justify-center gap-2 group"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

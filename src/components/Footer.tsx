import { Sparkles, Heart, Mail, ArrowUp } from 'lucide-react';
import { useStore } from '../store';

export default function Footer() {
  const { dispatch } = useStore();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">DigiCraft</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Premium digital templates & assets for creators, entrepreneurs, and small businesses.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              support@digicraft.store
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Products
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Notion Templates', cat: 'notion-templates' },
                { label: 'Canva Templates', cat: 'canva-templates' },
                { label: 'AI Prompts', cat: 'ai-prompts' },
                { label: 'Course Bundles', cat: 'course-bundles' },
                { label: 'Design Assets', cat: 'design-assets' },
              ].map(({ label, cat }) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      dispatch({ type: 'SET_FILTER', filters: { category: cat as any } });
                      dispatch({ type: 'NAVIGATE', page: 'products' });
                    }}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', page: 'about' as const },
                { label: 'Contact', page: 'contact' as const },
                { label: 'Blog', page: 'home' as const },
                { label: 'Affiliates', page: 'home' as const },
              ].map(({ label, page }) => (
                <li key={label}>
                  <button
                    onClick={() => dispatch({ type: 'NAVIGATE', page })}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Terms & Conditions', page: 'terms' as const },
                { label: 'Privacy Policy', page: 'privacy' as const },
                { label: 'Refund Policy', page: 'refund' as const },
              ].map(({ label, page }) => (
                <li key={label}>
                  <button
                    onClick={() => dispatch({ type: 'NAVIGATE', page })}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            © 2024 DigiCraft Store. Made with
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            in India.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">🇮🇳 INR (₹)</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

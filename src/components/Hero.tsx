import { ArrowRight, Download, ShieldCheck, Users, Zap } from 'lucide-react';
import { useStore } from '../store';

export default function Hero() {
  const { dispatch } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236d28d9' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100/80 rounded-full text-sm font-medium text-primary-700 animate-fade-in-up backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              <span>Trusted by 2,500+ creators & entrepreneurs</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Transform Your{' '}
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">
                Workflow
              </span>{' '}
              in 24 Hours
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              Ready-to-use Notion templates, Canva designs, AI prompt libraries & course bundles — designed to{' '}
              <span className="font-semibold text-gray-800">save you 20+ hours every week</span>.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              {[
                { icon: Download, text: 'Instant Download' },
                { icon: ShieldCheck, text: 'Money-back Guarantee' },
                { icon: Users, text: 'Lifetime Updates' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <button
                onClick={() => dispatch({ type: 'NAVIGATE', page: 'products' })}
                className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-xl shadow-primary-200 hover:shadow-primary-300 hover:-translate-y-0.5 flex items-center gap-2"
              >
                Browse Templates
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => dispatch({ type: 'NAVIGATE', page: 'products' })}
                className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-2xl border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all hover:-translate-y-0.5"
              >
                Get Free Sample
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
              <div className="flex -space-x-2">
                {['PS', 'RM', 'AG', 'VS'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white border-2 border-white"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-accent-400 text-sm">★★★★★</div>
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">4.9/5</span> from 500+ reviews
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-primary-100/50 p-6 border border-primary-100/50">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 mb-6">
                  <img
                    src="https://images.pexels.com/photos/5706032/pexels-photo-5706032.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                    alt="DigiCraft templates preview"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                      ✨ Bestseller
                    </span>
                    <span className="text-xs text-gray-400">1,250+ sales</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Ultimate Notion Life OS</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary-700">₹799</span>
                    <span className="text-sm text-gray-400 line-through">₹1,499</span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      47% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📥</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">7,500+</p>
                    <p className="text-xs text-gray-500">Downloads</p>
                  </div>
                </div>
              </div>

              {/* Floating Review Card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg">⭐</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">4.9 Rating</p>
                    <p className="text-xs text-gray-500">500+ Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

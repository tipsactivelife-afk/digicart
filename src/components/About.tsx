import { Heart, Zap, Users, Target, ArrowRight } from 'lucide-react';
import { useStore } from '../store';

export default function About() {
  const { dispatch } = useStore();

  return (
    <section className="py-12 sm:py-16 bg-surface min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-sm font-medium text-primary-700 mb-4">
            <Heart className="w-4 h-4" /> Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            We Build Tools That{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Save You Time
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            DigiCraft was born from a simple frustration — spending too much time on repetitive
            tasks instead of doing meaningful work. We create premium digital templates and tools
            that help you work smarter, not harder.
          </p>
        </div>

        {/* Image */}
        <div className="aspect-[16/7] rounded-3xl overflow-hidden mb-16 bg-gradient-to-br from-primary-100 to-accent-100">
          <img
            src="https://images.pexels.com/photos/5706032/pexels-photo-5706032.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
            alt="DigiCraft workspace"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <Target className="w-8 h-8 text-primary-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To democratize productivity by making professional-grade digital tools accessible
              to everyone — from solo entrepreneurs to growing teams. We believe great design
              and smart systems shouldn't require a huge budget.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <Zap className="w-8 h-8 text-accent-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Why DigiCraft?</h3>
            <p className="text-gray-600 leading-relaxed">
              Every template we create is battle-tested in real businesses. We don't just make
              pretty designs — we build functional systems that actually help you get more done.
              Quality over quantity, always.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: '2,500+', label: 'Happy Customers' },
            { value: '7,500+', label: 'Downloads' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '50+', label: 'Products' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-primary-700">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-8 sm:p-12 text-center text-white mb-16">
          <Users className="w-10 h-10 text-primary-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Built by Creators, for Creators</h3>
          <p className="text-primary-200 max-w-xl mx-auto mb-6 leading-relaxed">
            We're a small team of designers, developers, and productivity nerds who obsess over
            making your life easier. Every product goes through rigorous testing before it reaches
            you.
          </p>
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', page: 'products' })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors group"
          >
            Explore Our Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

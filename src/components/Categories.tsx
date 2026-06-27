import { useStore } from '../store';
import { categoryLabels, categoryEmojis } from '../data';

const categories = [
  { key: 'notion-templates', color: 'from-blue-50 to-indigo-50', border: 'border-blue-100', hover: 'hover:border-blue-300' },
  { key: 'canva-templates', color: 'from-pink-50 to-rose-50', border: 'border-pink-100', hover: 'hover:border-pink-300' },
  { key: 'ai-prompts', color: 'from-violet-50 to-purple-50', border: 'border-violet-100', hover: 'hover:border-violet-300' },
  { key: 'course-bundles', color: 'from-amber-50 to-yellow-50', border: 'border-amber-100', hover: 'hover:border-amber-300' },
  { key: 'design-assets', color: 'from-emerald-50 to-teal-50', border: 'border-emerald-100', hover: 'hover:border-emerald-300' },
];

export default function Categories() {
  const { dispatch } = useStore();

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
            Browse By Category
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
            Find What You Need
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <button
              key={cat.key}
              onClick={() => {
                dispatch({ type: 'SET_FILTER', filters: { category: cat.key as any } });
                dispatch({ type: 'NAVIGATE', page: 'products' });
              }}
              className={`group p-6 bg-gradient-to-br ${cat.color} rounded-2xl border ${cat.border} ${cat.hover} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
            >
              <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">
                {categoryEmojis[cat.key]}
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {categoryLabels[cat.key]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

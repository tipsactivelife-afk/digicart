export default function StatsBar() {
  const stats = [
    { value: '2,500+', label: 'Happy Customers', emoji: '😊' },
    { value: '7,500+', label: 'Downloads', emoji: '📥' },
    { value: '50+', label: 'Digital Products', emoji: '📦' },
    { value: '4.9/5', label: 'Average Rating', emoji: '⭐' },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ value, label, emoji }) => (
            <div key={label} className="text-center">
              <span className="text-2xl block mb-2">{emoji}</span>
              <p className="text-3xl sm:text-4xl font-bold text-white">{value}</p>
              <p className="text-sm text-primary-200 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

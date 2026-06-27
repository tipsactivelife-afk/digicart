import { Shield, Zap, RotateCcw, Headphones } from 'lucide-react';

export default function TrustBar() {
  const items = [
    { icon: Zap, title: 'Instant Download', desc: 'Get your files immediately' },
    { icon: Shield, title: 'Secure Payment', desc: 'SSL encrypted checkout' },
    { icon: RotateCcw, title: 'Money-back Guarantee', desc: 'For technical issues' },
    { icon: Headphones, title: '24/7 Support', desc: 'We\'re always here to help' },
  ];

  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

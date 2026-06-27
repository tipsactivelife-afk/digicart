import { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { useStore } from '../store';

export default function CountdownBanner() {
  const { dispatch } = useStore();
  const [time, setTime] = useState({ hours: 23, minutes: 59, seconds: 47 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="py-10 bg-gradient-to-r from-accent-400 via-accent-300 to-accent-400">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/30 rounded-full text-xs font-bold text-accent-900 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          LIMITED TIME OFFER
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-accent-900 mb-2">
          Flash Sale — Up to 50% Off Everything!
        </h2>
        <p className="text-accent-800 mb-6">Hurry, this deal expires soon.</p>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[
            { value: pad(time.hours), label: 'Hours' },
            { value: pad(time.minutes), label: 'Minutes' },
            { value: pad(time.seconds), label: 'Seconds' },
          ].map(({ value, label }, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className="bg-accent-900 text-white rounded-xl px-4 py-3 min-w-[60px]">
                <p className="text-2xl sm:text-3xl font-bold font-mono">{value}</p>
                <p className="text-[10px] text-accent-300 uppercase tracking-wider mt-0.5">
                  {label}
                </p>
              </div>
              {i < 2 && (
                <span className="text-2xl font-bold text-accent-800">:</span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => dispatch({ type: 'NAVIGATE', page: 'products' })}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent-900 text-white font-semibold rounded-xl hover:bg-accent-800 transition-colors shadow-lg"
        >
          <Clock className="w-4 h-4" />
          Shop the Sale
        </button>
      </div>
    </section>
  );
}

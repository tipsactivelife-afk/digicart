import { CheckCircle2, CircleDashed, Rocket, ShieldCheck, Mail, CreditCard, BarChart3, Database, ArrowRight } from 'lucide-react';
import { useStore } from '../store';

const launchItems = [
  {
    title: 'Payment Gateways',
    description: 'Razorpay for India + Stripe for international checkout.',
    status: 'connect-env',
    icon: CreditCard,
  },
  {
    title: 'Delivery Emails',
    description: 'Resend or Loops for instant download links and automation.',
    status: 'connect-env',
    icon: Mail,
  },
  {
    title: 'Analytics Setup',
    description: 'Plausible or GA4 for launch-day traffic and funnel tracking.',
    status: 'connect-env',
    icon: BarChart3,
  },
  {
    title: 'Database & Auth',
    description: 'Supabase schema and env template prepared for customer accounts.',
    status: 'ready',
    icon: Database,
  },
  {
    title: 'Compliance Pages',
    description: 'Terms, privacy, refund policy, cookie consent already included.',
    status: 'ready',
    icon: ShieldCheck,
  },
  {
    title: 'Pre-Launch QA',
    description: 'Mobile, checkout, delivery email, and analytics smoke tests recommended.',
    status: 'qa',
    icon: Rocket,
  },
];

export default function LaunchReadiness() {
  const { dispatch } = useStore();

  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 items-start">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 text-primary-200 text-sm font-medium border border-primary-400/20">
              <Rocket className="w-4 h-4" /> Launch Ready Mode
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight">
              Store almost ready for go-live.
            </h2>
            <p className="mt-4 text-slate-300 max-w-xl leading-relaxed">
              UI, product catalog, cart, checkout UX, legal pages, FAQ, discount logic, and launch docs are set.
              Final live integrations bas connect karni hain.
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {[
                ['Frontend', 'Ready'],
                ['SEO Base', 'Ready'],
                ['Live APIs', 'Pending Keys'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => dispatch({ type: 'NAVIGATE', page: 'contact' })}
                className="px-6 py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-100 transition-colors"
              >
                Connect Support Setup
              </button>
              <button
                onClick={() => dispatch({ type: 'NAVIGATE', page: 'products' })}
                className="px-6 py-3 rounded-xl border border-white/15 text-white font-semibold hover:bg-white/5 transition-colors inline-flex items-center gap-2"
              >
                Review Storefront
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {launchItems.map((item) => {
              const Icon = item.icon;
              const isReady = item.status === 'ready';
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-200" />
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isReady
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/20'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-400/20'
                    }`}>
                      {isReady ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CircleDashed className="w-3.5 h-3.5" />}
                      {isReady ? 'Ready' : item.status === 'qa' ? 'Do QA' : 'Connect'}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

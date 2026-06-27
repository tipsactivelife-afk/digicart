import { FileText, Shield, RotateCcw, ArrowLeft } from 'lucide-react';
import { useStore } from '../store';


interface LegalPageProps {
  type: 'terms' | 'privacy' | 'refund';
}

const content: Record<string, { title: string; icon: React.ComponentType<any>; lastUpdated: string; sections: { heading: string; body: string }[] }> = {
  terms: {
    title: 'Terms & Conditions',
    icon: FileText,
    lastUpdated: 'May 1, 2024',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: 'By accessing and using DigiCraft Store ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.',
      },
      {
        heading: '2. Digital Products',
        body: 'All products sold on DigiCraft are digital goods delivered electronically. Upon purchase, you will receive download links via email. Products include, but are not limited to, Notion templates, Canva templates, AI prompt libraries, course bundles, and design assets.',
      },
      {
        heading: '3. License & Usage Rights',
        body: 'Upon purchase, you are granted a personal, non-transferable, non-exclusive license to use the digital product. You may use the product for personal and commercial purposes within your own business. You may NOT resell, redistribute, or share the product files with others. Each license is for a single user/business unless a multi-use license is purchased.',
      },
      {
        heading: '4. Payment & Pricing',
        body: 'All prices are listed in Indian Rupees (₹) and include applicable taxes (GST). International customers may be charged in their local currency at the prevailing exchange rate. We accept payments via credit/debit cards, UPI, net banking, and digital wallets through our payment partners (Razorpay and Stripe).',
      },
      {
        heading: '5. Delivery',
        body: 'Digital products are delivered instantly via email after successful payment. Download links are valid for 30 days from the date of purchase. If you experience any issues accessing your purchase, contact support within 7 days.',
      },
      {
        heading: '6. Intellectual Property',
        body: 'All digital products, website content, logos, and branding are the intellectual property of DigiCraft. You may not copy, modify, or create derivative works of our products for redistribution purposes.',
      },
      {
        heading: '7. Limitation of Liability',
        body: 'DigiCraft shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our products. Our total liability shall not exceed the purchase price of the product.',
      },
      {
        heading: '8. Changes to Terms',
        body: 'We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of the Service after changes constitutes acceptance of the new terms.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    lastUpdated: 'May 1, 2024',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'We collect information you provide directly: email address, name, and country during checkout. We also collect usage data through analytics tools, including page views, browser type, device information, and IP address (anonymized).',
      },
      {
        heading: '2. How We Use Your Information',
        body: 'We use your information to: process and deliver your orders, send transactional emails (order confirmation, download links), send marketing communications (with your consent), improve our products and website experience, and provide customer support.',
      },
      {
        heading: '3. Data Storage & Security',
        body: 'Your data is stored securely using industry-standard encryption. We use Stripe and Razorpay for payment processing — we never store your card details on our servers. Data is hosted on secure servers with regular backups.',
      },
      {
        heading: '4. Third-Party Services',
        body: 'We use the following third-party services: Stripe/Razorpay (payment processing), Resend (email delivery), Plausible Analytics (privacy-focused analytics), and Supabase (database hosting). Each service has its own privacy policy governing data usage.',
      },
      {
        heading: '5. Cookies',
        body: 'We use essential cookies for website functionality and optional analytics cookies (with your consent). You can manage cookie preferences through our cookie consent banner. We do not use advertising cookies.',
      },
      {
        heading: '6. GDPR Compliance',
        body: 'For EU residents: You have the right to access, rectify, erase, or port your personal data. You may also object to or restrict processing. To exercise any of these rights, contact us at privacy@digicraft.store.',
      },
      {
        heading: '7. Data Retention',
        body: 'We retain your personal data for as long as your account is active or as needed to provide services. Transaction records are kept for 7 years for tax compliance. You can request data deletion at any time.',
      },
      {
        heading: '8. Contact',
        body: 'For privacy-related concerns, contact our Data Protection Officer at privacy@digicraft.store. We will respond within 30 days.',
      },
    ],
  },
  refund: {
    title: 'Refund Policy',
    icon: RotateCcw,
    lastUpdated: 'May 1, 2024',
    sections: [
      {
        heading: 'Digital Products — Refund Policy',
        body: 'Due to the nature of digital products, which can be copied and used immediately upon download, we generally do not offer refunds. This policy is clearly stated before purchase completion.',
      },
      {
        heading: 'When Refunds Are Granted',
        body: 'We will issue a full refund in the following cases: (1) You are unable to access or download the product due to a technical error on our end, (2) The product is significantly different from what was described on the product page, (3) You were charged multiple times for the same product due to a payment error. Refund requests must be made within 7 days of purchase.',
      },
      {
        heading: 'How to Request a Refund',
        body: 'Email support@digicraft.store with: your order number, the product name, the reason for your refund request, and any relevant screenshots. We aim to respond within 24 hours and process approved refunds within 5-7 business days.',
      },
      {
        heading: 'Non-Refundable Situations',
        body: 'Refunds are NOT available for: change of mind after download, inability to use the product due to lack of required software (e.g., Canva, Notion — requirements are listed on product pages), purchasing the wrong product without contacting support first, or requests made after 7 days.',
      },
      {
        heading: 'Exchanges & Store Credit',
        body: 'If you purchased the wrong product, we may offer a one-time exchange or store credit at our discretion. Contact support with your order details and the product you would like instead.',
      },
      {
        heading: 'Chargebacks',
        body: 'If you file a chargeback/dispute with your bank before contacting us, your account will be suspended and access to all purchased products will be revoked. We encourage reaching out to us directly — we are committed to resolving any issues.',
      },
    ],
  },
};

export default function LegalPage({ type }: LegalPageProps) {
  const { dispatch } = useStore();
  const page = content[type];
  const Icon = page.icon;

  return (
    <section className="py-12 sm:py-16 bg-surface min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', page: 'home' })}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-2">
            <Icon className="w-6 h-6 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
          </div>
          <p className="text-sm text-gray-400 mb-8">Last updated: {page.lastUpdated}</p>

          <div className="space-y-8">
            {page.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-lg font-bold text-gray-900 mb-3">{section.heading}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqs } from '../data';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 mt-3">
            Everything you need to know about our digital products.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl transition-all duration-300 ${
                openIndex === index
                  ? 'border-primary-200 bg-primary-50/50 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                aria-expanded={openIndex === index}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle
                    className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      openIndex === index ? 'text-primary-500' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-sm sm:text-base font-semibold transition-colors ${
                      openIndex === index ? 'text-primary-700' : 'text-gray-700'
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-primary-500' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 animate-slide-down">
                  <p className="text-sm text-gray-600 leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Plus, Minus } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "How does WoodHeat work?",
      answer: "WoodHeat connects you with local firewood sellers in your area. Simply enter your delivery address, browse available sellers, and place your order. Our sellers handle delivery and optional stacking services directly."
    },
    {
      question: "What types of firewood are available?",
      answer: "Available firewood types vary by seller and region. Each seller specifies their wood types, with many offering premium hardwoods like oak, maple, and cherry. You can view specific details when browsing sellers in your area."
    },
    {
      question: "How is delivery pricing calculated?",
      answer: "Delivery pricing includes a base fee plus a per-mile charge that varies by seller. The total delivery cost is calculated based on your distance from the seller and displayed before you place your order."
    },
    {
      question: "Do sellers offer stacking services?",
      answer: "Many sellers offer stacking services for an additional fee. This option will be clearly displayed during the ordering process if the seller provides this service."
    },
    {
      question: "How do I pay for my order?",
      answer: "We accept secure online payments through Stripe. Some sellers may also offer cash payment options upon delivery. Payment timing (at scheduling or delivery) is specified by each seller."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto mt-16">
      <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Frequently Asked Questions
      </h3>
      <dl className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-6">
            <dt>
              <button
                className="flex w-full items-start justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <span className="ml-6 flex items-center">
                  {openIndex === index ? (
                    <Minus className="h-5 w-5 text-orange-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-orange-500" />
                  )}
                </span>
              </button>
            </dt>
            {openIndex === index && (
              <dd className="mt-4 text-base text-gray-500">
                {faq.answer}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
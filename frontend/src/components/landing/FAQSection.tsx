import { JsonLd } from '@/components/seo/JsonLd'

const FAQS = [
  {
    question: 'What is RateYourProject?',
    answer:
      'RateYourProject is an AI-powered tool that evaluates the hireability of your software project. Upload your code, choose your role and seniority, and receive a detailed evaluation across 6 key dimensions: Architecture, Code Quality, Testing, Documentation, Deploy and Best Practices.',
  },
  {
    question: 'How does the hireability evaluation work?',
    answer:
      'You choose your role (Frontend, Backend, Fullstack or Infrastructure), upload your project as a .ZIP file, and our AI analyzes it across 6 dimensions. You receive a hexagonal score chart with concrete recommendations to improve your project.',
  },
  {
    question: 'What are the 6 evaluation dimensions?',
    answer:
      'The evaluation analyzes Architecture (project structure and design patterns), Code Quality (readability and consistency), Testing (coverage and test cases), Documentation (README and technical decisions), Deploy (CI/CD and production setup) and Best Practices (security, performance and accessibility).',
  },
  {
    question: 'Which roles can I get evaluated in?',
    answer:
      'RateYourProject evaluates 4 roles: Frontend, Backend, Fullstack and Infrastructure. Each role has its own criteria, adapted to what companies actually look for in that discipline.',
  },
  {
    question: 'What seniority levels are supported?',
    answer:
      '4 seniority levels are supported: Junior (0-2 years), Mid-Level (2-5 years), Senior (5-8 years) and Staff (8+ years). Each level evaluates different expectations and maturity in your technical skills.',
  },
  {
    question: 'Is RateYourProject free to use?',
    answer:
      'Yes. RateYourProject is free. Sign in with Google, upload your project and get your complete hireability evaluation at no cost.',
  },
  {
    question: 'What project files can I upload?',
    answer:
      'You can upload your project as a .ZIP file up to 100MB. Include the complete codebase, plus architecture and technical decisions in a README, so everything counts in the evaluation.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

export function FAQSection() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <section id="faq" className="relative py-24 md:py-32 bg-surface-950">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-xs text-accent font-body tracking-[0.2em] uppercase">
              FAQ
            </span>
            <h2 className="mt-4 font-display font-700 text-3xl md:text-4xl lg:text-5xl text-balance">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-muted max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about how RateYourProject evaluates your
              project and your talent.
            </p>
          </div>

          <div className="divide-y divide-surface-700/30 rounded-2xl bg-surface-900 border border-surface-700/50 overflow-hidden">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group px-6 md:px-8">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 list-none select-none marker:hidden font-display font-600 text-base md:text-lg text-white transition-colors hover:text-accent">
                  {faq.question}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-180"
                  >
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="pb-6 text-sm md:text-base text-muted-light leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
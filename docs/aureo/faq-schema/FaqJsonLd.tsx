/**
 * FaqJsonLd.tsx
 *
 * Drop-in FAQPage JSON-LD for aureobitcoin.com.
 * Server component, no client JS, no dependencies.
 *
 * Why this exists: your FAQ accordions are Radix, and the answer panels are
 * unmounted until a user clicks. That is correct for accessibility and bundle
 * size, but it means the answer text is not in the server-rendered HTML at all.
 * A crawler that does not execute JavaScript sees the questions and no answers.
 * This component puts the answers back in the response, in a format built for
 * machines, without changing anything a human sees.
 *
 * Your homepage already does this. The other 14 pages do not. That is the gap.
 *
 * Usage in an App Router page:
 *
 *   import FaqJsonLd from '@/components/FaqJsonLd'
 *
 *   export default function Page({ params }: { params: { locale: string } }) {
 *     return (
 *       <>
 *         <FaqJsonLd route={`/${params.locale}/precios`} />
 *         ...
 *       </>
 *     )
 *   }
 *
 * Keep the JSON in sync with the visible accordion. If the two ever disagree,
 * the markup is the thing search engines treat as wrong.
 */

import faqData from './aureo-faq-schema.json'

type Answer = { '@type': 'Answer'; text: string }
type Question = { '@type': 'Question'; name: string; acceptedAnswer: Answer }
type FaqSchema = {
  '@context': string
  '@type': 'FAQPage'
  inLanguage: string
  mainEntity: Question[]
}
type Entry = { locale: string; url: string; schema: FaqSchema }

const DATA = faqData as unknown as Record<string, Entry>

export default function FaqJsonLd({ route }: { route: string }) {
  const entry = DATA[route]
  if (!entry) return null

  return (
    <script
      type="application/ld+json"
      // Content is static and authored, not user input. Escape the sequence that
      // could otherwise close the script tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(entry.schema).replace(/</g, '\\u003c'),
      }}
    />
  )
}

/**
 * Routes covered by aureo-faq-schema.json:
 *
 *   /es                                  /en                            (already live)
 *   /es/comprar-bitcoin                  /en/buy-bitcoin
 *   /es/vender-bitcoin                   /en/sell-bitcoin
 *   /es/custodia-multi-institucional     /en/multi-institution-custody
 *   /es/precios                          /en/pricing
 *   /es/empresas                         /en/businesses
 *   /es/personas                         /en/individuals
 *   /es/patrimonio                       /en/patrimonio
 */

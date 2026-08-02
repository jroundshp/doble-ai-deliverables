# Aureo FAQ Schema Pack

Free, no strings. Built from your own published content on August 2, 2026.

**112 question and answer pairs across 16 pages, both languages, as ready-to-install FAQPage JSON-LD.**

---

## The problem this solves

Your FAQ sections use a Radix accordion. The answer panels are unmounted until a user clicks, so the answer text never appears in the server-rendered HTML.

We checked every page on the site. Across your 16 commercial pages there are **114 answer regions, and 114 of them are empty in the server response**. The answers are not merely unmarked. For anything that does not execute JavaScript, they are not there at all.

Verify it yourself:

```bash
curl -s https://www.aureobitcoin.com/es/personas | grep -c 'role="region"'   # 4 regions
curl -s https://www.aureobitcoin.com/es/personas | grep -c 'minutos'         # 0
```

The second number should not be zero. "Hasta 5 minutos" is the answer to your own KYC question, and it is absent from the response.

**Your homepage already gets this right.** It ships a `FAQPage` block containing all seven answers, which is why the homepage FAQ is machine-readable and the other fourteen pages are not. This pack applies the pattern you already chose, everywhere else.

## What this is worth, stated honestly

This is not about Google FAQ rich results. Google restricted those to government and health sites in August 2023, and you would most likely not get stars or dropdowns out of this.

The value is retrieval. Answer engines and the crawlers behind them (GPTBot, ClaudeBot, PerplexityBot, Bingbot) read structured data, and most of them do not run your JavaScript. Right now, when one of them fetches `/es/precios`, it gets six questions and no answers. After this change it gets six matched pairs. That is the difference between having published an answer and having published an answer a machine can quote.

## Files

| File | What it is |
|---|---|
| `aureo-faq-schema.json` | The data. 16 routes, each with a complete `FAQPage` object. |
| `FaqJsonLd.tsx` | A server component, roughly 20 lines, no dependencies. |

## Install

1. Drop both files into `components/` (or wherever the JSON is easiest to import).
2. Add one line per page:

```tsx
<FaqJsonLd route={`/${params.locale}/precios`} />
```

3. Confirm it worked:

```bash
curl -s https://www.aureobitcoin.com/es/precios | grep -c 'FAQPage'
```

Then run the two URLs through Google's Rich Results Test and Schema.org's validator.

If you would rather not add a component, the JSON is plain data. Paste any `schema` object straight into a `<script type="application/ld+json">` tag.

## Two things need your attention

1. **`¿Qué comisiones aplican?` on `/personas` and `/individuals`** is marked `_needs_answer`. Its answer is a JSX fragment containing a link, so there is no clean plain-text version to extract. Schema needs plain text. Write one sentence and drop it in.

2. **`/es` and `/en` are already live.** They are included only so you can diff them against what you already ship. No action needed.

## Where the content came from

Questions were read from the rendered button labels on each page. Answers were recovered from your client bundles, where the accordion content is defined, then matched back to their questions per page and per locale. Nothing was written, translated, paraphrased, or invented. It is your copy, moved into a second format.

Two things worth flagging from that process: the Spanish and English strings are not always in the same ternary order across components, and a couple of pages use a tuple shape (`["Q","A"]`) while the rest use `{q, a}`. If you generate this from source going forward rather than from the bundle, both stop mattering.

## Keeping it honest

Structured data must match what a user sees. If you edit an accordion answer, edit the JSON in the same commit. The durable version of this is generating both the accordion and the JSON-LD from one source of truth, which is a small refactor and worth doing at some point. This pack is the shortcut that gets the benefit today.

---

Prepared by Eagle River Base Camp / Doble AI · dobleai.com
Full audit: https://jroundshp.github.io/doble-ai-deliverables/aureo/

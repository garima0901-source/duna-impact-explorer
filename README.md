# Duna Impact Explorer

**Live:** _add the Vercel URL here after deploying_

## What this is

An independent, self-serve tool that lets a Compliance, Revenue, or
Technology lead at a fintech, bank, or platform company go from "curious
about Duna" to "I understand what this could do for us" in under two
minutes — without booking a demo call.

This is a public work-sample project built by **Garima** as part of an
application for Duna's Growth Associate role. It is **not** an official Duna
product, and Duna did not commission or review it. It exists to demonstrate
how I think about go-to-market: mirror how a real buyer evaluates a
company — a self-serve, sourced, verifiable case, not a pitch deck.

Every number, quote, and date on the page traces back to a real, cited
source with a visible "last verified" date. Nothing is invented or
placeholder.

## The three modules

1. **Impact Calculator** — visitors enter their own case-review time,
   monthly case volume, and conversion rate, and get a projection built
   entirely from Duna's own published multipliers (10.6x faster onboarding,
   4.8x analyst efficiency, 37% conversion increase). Labeled clearly as
   illustrative.
2. **Customer Proof Explorer** — a filterable (by industry) view of Duna's
   real, named, publicly reported customers, organized the way Duna
   organizes its own site.
3. **EUDI Wallet Countdown** — an independent, genuinely useful countdown to
   the EU's Digital Identity Wallet regulatory deadlines (Regulation (EU)
   2024/1183 / eIDAS 2.0), which makes Duna's "portable business identity"
   thesis a legal requirement rather than just a product pitch.

## Data sources

| Data point | Source |
|---|---|
| 10.6x faster onboarding, 4.8x analyst efficiency, 37% conversion increase | [duna.com](https://duna.com/) (homepage) |
| Moss testimonial (Ante Spittler, CEO) | [duna.com](https://duna.com/) (homepage testimonial) |
| Plaid, Bol as named customers | duna.com meta description; confirmed in press coverage below |
| CCV (Fiserv), SVEA Bank as named customers | [fintech.global, Series A coverage (Feb 5, 2026)](https://fintech.global/2026/02/06/business-identity-platform-duna-bags-e30m-funding-round/) |
| Sequra, Brand New Day Bank as named customers | [Biometric Update, seed round coverage (May 7, 2025)](https://www.biometricupdate.com/202505/business-identity-startup-duna-raises-12m) |
| Duna Foundation allocated 1/3 of shares at incorporation | [duna.com/foundation](https://duna.com/foundation) |
| Regulation (EU) 2024/1183 text and in-force date (20 May 2024) | [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1183) |
| 24 Dec 2026 / 24 Dec 2027 EUDI Wallet deadlines | [gataca.io](https://www.gataca.io/resources/blog/eIDAS2-timeline/), [eadtrust.eu](https://www.eadtrust.eu/en/blog/december-2026-deadline-eudi-wallet/) |
| EEA-EFTA one-year extension | [signicat.com](https://www.signicat.com/blog/eudi-wallets-only-one-year-to-launch) |
| Germany's 2 January 2027 national rollout ("d-you") | [ID Tech Wire](https://idtechwire.com/germany-names-eudi-wallet-d-you-and-sets-january-2027-launch/) |

All facts were independently verified on **September 15, 2026** — the date
shown as "last verified" throughout the app.

**A note on completeness:** the spec this was built from also listed Mews as
a customer, sourced to the same fintech.global article as CCV and SVEA Bank.
On verification, "Mews" appeared only in that article's search-engine meta
description, not in the article body, and no other independent source
confirmed it. Per this project's own non-negotiable ("every data point needs
a visible source"), it was left out of the live Customer Proof Explorer
rather than shipped on a weak citation.

## How the weekly data refresh works

Live client-side scraping on every page load would be fragile and would
break silently if Duna's site markup changed. Instead:

- [`scripts/refreshData.mjs`](scripts/refreshData.mjs) re-fetches
  `duna.com` and re-parses the three published multipliers. It only updates
  data if **all three** can be confidently re-parsed — if the site's markup
  has changed enough that parsing fails, it aborts loudly instead of writing
  bad data.
- [`api/refresh-data.js`](api/refresh-data.js) is a Vercel serverless
  function, triggered weekly by the cron in [`vercel.json`](vercel.json)
  (Mondays at 06:00 UTC). Since serverless functions are stateless, it
  commits any change directly to `public/data/duna-data.json` on the `main`
  branch via the GitHub Contents API — which then triggers Vercel's normal
  auto-deploy on push.
- The customer table and EUDI Wallet regulation dates are **not**
  auto-refreshed. They're editorially curated facts (press quotes, legal
  deadlines) that shouldn't be scraped automatically — adding a new
  "customer" or reinterpreting a regulation requires human judgment, not a
  regex.

To enable the live cron in your own deployment, set these environment
variables in the Vercel project:

| Variable | Purpose |
|---|---|
| `GITHUB_TOKEN` | Fine-grained PAT with `contents: write` on this repo |
| `GITHUB_REPO` | `owner/repo`, e.g. `garima0901-source/duna-impact-explorer` |
| `GITHUB_BRANCH` | Optional, defaults to `main` |
| `CRON_SECRET` | Optional, secures the endpoint against manual triggering |

To test the refresh logic locally without touching GitHub:

```bash
npm run refresh-data
```

## Tech stack

- React + Vite
- Tailwind CSS v4
- Vercel (hosting + cron)
- Zero UI component libraries — hand-built to match Duna's own clean,
  editorial visual register

## Run locally

```bash
npm install
npm run dev
```

## Contact

Built by Garima — [GitHub](https://github.com/garima0901-source) ·
[LinkedIn](https://www.linkedin.com/in/garima-1676141b4/)

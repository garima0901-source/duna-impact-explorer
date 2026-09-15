const TERMS = [
  { term: 'AMLR', definition: 'The EU Anti-Money Laundering Regulation — a single, directly applicable rulebook replacing the old country-by-country AML directives across all EU member states.' },
  { term: 'AMLA', definition: 'The Anti-Money Laundering Authority — the new EU agency that directly supervises the highest-risk financial institutions and coordinates national AML regulators.' },
  { term: 'ECCTA', definition: "The UK's Economic Crime and Corporate Transparency Act — introduces mandatory identity verification for company directors, LLP members, and PSCs registered at Companies House." },
  { term: 'PSC', definition: 'Person with Significant Control — a UK term for an individual who owns or controls a company, roughly equivalent to a UBO elsewhere.' },
  { term: 'UBO', definition: 'Ultimate Beneficial Owner — the real person who ultimately owns, controls, or benefits from a company or legal structure, regardless of whose name is on paper.' },
  { term: 'EUDI Wallet', definition: 'European Digital Identity Wallet — an EU-mandated app letting citizens and businesses store and share verified identity credentials, built to be accepted across all member states.' },
  { term: 'BOI', definition: "Beneficial Ownership Information — the ownership data the US Corporate Transparency Act required companies to report to FinCEN, now rolled back for domestic filers." },
  { term: 'KYB', definition: 'Know Your Business — the process of verifying a business customer\'s identity, ownership structure, and legitimacy before onboarding them.' },
]

export default function Glossary() {
  return (
    <section className="border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8">
        <h2 className="text-lg font-semibold text-ink">Glossary</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Plain-language definitions for the terms used across this page.
        </p>
        <dl className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {TERMS.map(({ term, definition }) => (
            <div key={term}>
              <dt className="text-sm font-semibold text-ink">{term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

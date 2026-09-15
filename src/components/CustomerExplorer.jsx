import { useMemo, useState } from 'react'
import SourceNote from './SourceNote'

const INDUSTRIES = ['All', 'Financial Technology', 'Banking', 'Platforms']

export default function CustomerExplorer({ customers }) {
  const [industry, setIndustry] = useState('All')

  const filtered = useMemo(() => {
    if (industry === 'All') return customers
    return customers.filter((c) => c.industry === industry)
  }, [customers, industry])

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-ink">Customer Proof Explorer</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          Real Duna customers, organized the way Duna organizes its own site —
          by industry. Every entry is a named, publicly reported customer with
          a source link.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map((i) => (
          <button
            key={i}
            onClick={() => setIndustry(i)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              industry === i
                ? 'border-accent bg-accent text-paper'
                : 'border-line bg-paper-raised text-ink hover:border-accent/50'
            }`}
          >
            {i}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((customer) => (
          <div
            key={customer.company}
            className="flex flex-col justify-between rounded-2xl border border-line bg-paper-raised p-6"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-ink">{customer.company}</h3>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                  {customer.industry}
                </span>
              </div>
              {customer.quote ? (
                <blockquote className="mt-3 text-[15px] leading-relaxed text-ink/80">
                  "{customer.quote}"
                  <footer className="mt-2 text-sm text-muted">
                    — {customer.attribution}
                  </footer>
                </blockquote>
              ) : (
                <p className="mt-3 text-[15px] text-muted">{customer.attribution}</p>
              )}
            </div>
            <SourceNote
              className="mt-5"
              label={customer.sourceLabel}
              href={customer.source}
              verified={customer.lastVerified}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

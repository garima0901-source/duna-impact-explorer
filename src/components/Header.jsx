const TABS = [
  { id: 'calculator', label: 'Impact Calculator' },
  { id: 'customers', label: 'Customer Proof' },
  { id: 'eudi', label: 'EUDI Countdown' },
]

export default function Header({ active, onChange }) {
  return (
    <header className="border-b border-line bg-paper-raised">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
          Independent work sample &middot; not an official Duna product
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Duna Impact Explorer
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          Go from curious to convinced in under two minutes — using Duna's own
          published results, real named customers, and the regulation that
          makes their thesis urgent. Every number is sourced and dated.
        </p>

        <nav className="mt-8 flex flex-wrap gap-1 border-b border-line">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium transition ${
                active === tab.id
                  ? 'text-ink'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {tab.label}
              {active === tab.id && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

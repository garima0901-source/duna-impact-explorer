const REPO = 'https://github.com/garima0901-source/duna-impact-explorer'

const STEPS = [
  {
    label: 'Source',
    detail: 'duna.com homepage',
    icon: (
      <path d="M8 1a7 7 0 100 14A7 7 0 008 1ZM1 8h14M8 1c1.8 1.9 2.8 4.4 2.8 7S9.8 13.1 8 15M8 1c-1.8 1.9-2.8 4.4-2.8 7S6.2 13.1 8 15" />
    ),
  },
  {
    label: 'Weekly cron',
    detail: 'Vercel Cron · Mon 06:00 UTC',
    icon: <path d="M8 4v4l2.5 2.5M15 8A7 7 0 111 8a7 7 0 0114 0Z" />,
  },
  {
    label: 'Data commit',
    detail: 'GitHub Contents API',
    icon: <path d="M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5ZM8 1v2.5M8 12.5V15M1 8h4.5M10.5 8H15" />,
  },
  {
    label: 'Redeploy',
    detail: 'Vercel auto-deploy on push',
    icon: <path d="M8 1l2 4.5 5 .7-3.6 3.5.9 5-4.3-2.3-4.3 2.3.9-5L1 6.2l5-.7L8 1Z" />,
  },
]

const LINKS = [
  { label: 'Cron schedule (vercel.json)', href: `${REPO}/blob/main/vercel.json` },
  { label: 'Refresh logic (api/refresh-data.js)', href: `${REPO}/blob/main/api/refresh-data.js` },
  { label: 'Real commit history for the data file', href: `${REPO}/commits/main/public/data/duna-data.json` },
]

export default function DataPipeline() {
  return (
    <section className="border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8">
        <h2 className="text-lg font-semibold text-ink">Data Pipeline</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          "Refreshed weekly" is a checkable claim, not an assertion — here's
          exactly what runs, and where to see it happen.
        </p>

        <div className="mt-6 rounded-2xl border border-line bg-ink p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.label} className="relative flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-400/40 bg-sky-400/10 text-sky-300">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    {step.icon}
                  </svg>
                </div>
                <div className="mt-3 text-sm font-medium text-paper">{step.label}</div>
                <div className="mt-1 text-xs leading-snug text-paper/50">{step.detail}</div>
                {i < STEPS.length - 1 && (
                  <div className="pointer-events-none absolute top-6 left-[calc(50%+28px)] hidden h-px w-[calc(100%-32px)] bg-gradient-to-r from-sky-400/50 to-sky-400/0 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
            >
              {link.label} ↗
            </a>
          ))}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Note: Vercel's own cron execution logs are private to this
          project's dashboard. The GitHub commit history above is the
          public record of what the cron job actually did — every
          automated update lands there as a real, timestamped commit.
        </p>
      </div>
    </section>
  )
}

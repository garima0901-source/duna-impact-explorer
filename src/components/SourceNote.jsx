function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function SourceNote({ label, href, verified, className = '' }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-line bg-accent-soft/60 px-3 py-2 text-xs text-accent ${className}`}
    >
      <span className="font-medium uppercase tracking-wide text-[10px] text-accent/70">
        Source
      </span>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="font-medium underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
      >
        {label}
      </a>
      {verified && (
        <>
          <span className="text-accent/40">&middot;</span>
          <span className="text-muted">Last verified {formatDate(verified)}</span>
        </>
      )}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8">
        <h2 className="text-lg font-semibold text-ink">Why this is open source</h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
          This tool is open source because Duna already builds this way — an
          open cap table, public board minutes, and a Foundation that was
          allocated a third of the company's shares at incorporation (per{' '}
          <a
            href="https://duna.com/foundation"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            duna.com/foundation
          </a>
          ). Every number on this page is sourced and dated. Nothing here is
          invented.
        </p>
        <p className="mt-6 text-sm text-muted">
          Built by Garima —{' '}
          <a
            href="https://github.com/garima0901-source"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            GitHub
          </a>
          {' · '}
          <a
            href="https://www.linkedin.com/in/garima-1676141b4/"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  )
}

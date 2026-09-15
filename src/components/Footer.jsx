export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8">
        <p className="text-sm text-muted">
          Don't trust the UI — verify the data yourself:{' '}
          <code className="inline-block break-all rounded bg-accent-soft px-1.5 py-0.5 text-[13px] text-accent">
            curl https://duna-impact-explorer.vercel.app/api/data
          </code>
        </p>
        <p className="mt-4 text-sm text-muted">
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

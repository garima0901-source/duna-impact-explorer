import { useEffect, useState } from 'react'
import SourceNote from './SourceNote'

function getRemaining(targetIso) {
  const target = new Date(`${targetIso}T00:00:00Z`).getTime()
  const now = Date.now()
  const diff = Math.max(target - now, 0)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds, past: target - now <= 0 }
}

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function EudiCountdown({ eudi }) {
  const [remaining, setRemaining] = useState(() => getRemaining(eudi.memberStateDeadline))

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(getRemaining(eudi.memberStateDeadline))
    }, 1000)
    return () => clearInterval(id)
  }, [eudi.memberStateDeadline])

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-ink">EUDI Wallet Countdown</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          Independent regulatory context: the EU Digital Identity Wallet is a
          legal mandate under {eudi.regulationName}, in force since{' '}
          {formatDate(eudi.inForceDate)}. It makes shareable, portable business
          identity a legal requirement, not just a product idea.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-ink p-8 text-center text-paper">
        <div className="text-xs font-medium uppercase tracking-wide text-paper/50">
          Member states must offer a certified EUDI Wallet by
        </div>
        <div className="mt-1 text-lg font-medium text-paper/80">
          {formatDate(eudi.memberStateDeadline)}
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3 sm:gap-6">
          <TimeUnit value={remaining.days} label="days" />
          <TimeUnit value={remaining.hours} label="hours" />
          <TimeUnit value={remaining.minutes} label="minutes" />
          <TimeUnit value={remaining.seconds} label="seconds" />
        </div>
        {remaining.past && (
          <div className="mt-4 text-sm text-paper/60">
            This deadline has passed.
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper-raised p-6">
          <div className="text-xs font-medium uppercase tracking-wide text-accent">
            Next milestone
          </div>
          <div className="mt-2 text-xl font-semibold text-ink">
            {formatDate(eudi.privateSectorDeadline)}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Regulated private-sector entities — banks and large online
            platforms — must accept the EUDI Wallet for authentication.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-paper-raised p-6">
          <div className="text-xs font-medium uppercase tracking-wide text-accent">
            Related timelines
          </div>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
            {eudi.notes.map((note) => (
              <li key={note.text}>
                {note.text}{' '}
                <a
                  href={note.source}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
                >
                  ({note.sourceLabel})
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {eudi.sources.map((s) => (
          <SourceNote key={s.url} label={s.label} href={s.url} verified={eudi.lastVerified} />
        ))}
      </div>
    </div>
  )
}

function TimeUnit({ value, label }) {
  return (
    <div>
      <div className="text-3xl font-semibold tabular-nums sm:text-4xl">
        {String(value).padStart(2, '0')}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-paper/50">
        {label}
      </div>
    </div>
  )
}

import { downloadDeadlineIcs } from '../utils/ics'

export default function AddToCalendarButton({ deadline, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => downloadDeadlineIcs(deadline)}
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-paper/80 transition hover:border-sky-400/70 hover:bg-white/10 hover:text-paper ${className}`}
    >
      <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
        <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 6.5H14" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 2V4.5M11 2V4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M8 8.5V11.5M6.5 10H9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      Add to calendar
    </button>
  )
}

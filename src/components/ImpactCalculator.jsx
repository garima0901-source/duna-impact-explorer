import { useMemo, useState } from 'react'
import SourceNote from './SourceNote'

function formatMinutes(totalMinutes) {
  if (!Number.isFinite(totalMinutes)) return '—'
  if (totalMinutes < 60) return `${totalMinutes.toFixed(1)} min`
  const hours = totalMinutes / 60
  return `${hours.toFixed(1)} hrs`
}

export default function ImpactCalculator({ stats }) {
  const [reviewTime, setReviewTime] = useState(20)
  const [casesPerMonth, setCasesPerMonth] = useState(150)
  const [conversionRate, setConversionRate] = useState(62)

  const results = useMemo(() => {
    const time = Number(reviewTime) || 0
    const cases = Number(casesPerMonth) || 0
    const conversion = Number(conversionRate) || 0

    const newReviewTime = time / stats.fasterOnboarding
    const hoursFreedPerMonth = ((time - newReviewTime) * cases) / 60
    const capacityMultiple = stats.analystEfficiency
    const projectedConversion = Math.min(conversion * stats.conversionMultiplier, 100)

    return {
      newReviewTime,
      hoursFreedPerMonth,
      capacityMultiple,
      projectedConversion,
    }
  }, [reviewTime, casesPerMonth, conversionRate, stats])

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-ink">Impact Calculator</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          Enter your own onboarding numbers to see a projection using Duna's own
          published results. This is illustrative, based on Duna's published
          average results — actual results vary by implementation.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 rounded-2xl border border-line bg-paper-raised p-6">
          <Field
            label="Average time to review one case (minutes)"
            value={reviewTime}
            onChange={setReviewTime}
            min={1}
            max={600}
          />
          <Field
            label="Cases reviewed per month"
            value={casesPerMonth}
            onChange={setCasesPerMonth}
            min={1}
            max={100000}
          />
          <Field
            label="Current onboarding conversion rate (%)"
            value={conversionRate}
            onChange={setConversionRate}
            min={0}
            max={100}
          />
        </div>

        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-line bg-ink p-6 text-paper">
          <ResultRow
            label="Projected new review time per case"
            value={formatMinutes(results.newReviewTime)}
            detail={`÷ ${stats.fasterOnboarding}x faster onboarding`}
          />
          <ResultRow
            label="Analyst hours freed up per month"
            value={
              Number.isFinite(results.hoursFreedPerMonth)
                ? `${Math.max(results.hoursFreedPerMonth, 0).toFixed(0)} hrs`
                : '—'
            }
            detail={`capacity, at ${stats.analystEfficiency}x analyst efficiency`}
          />
          <ResultRow
            label="Projected onboarding conversion rate"
            value={
              Number.isFinite(results.projectedConversion)
                ? `${results.projectedConversion.toFixed(1)}%`
                : '—'
            }
            detail={`× ${stats.conversionMultiplier}, capped at 100%`}
          />
        </div>
      </div>

      <SourceNote
        label={stats.sourceLabel}
        href={stats.source}
        verified={stats.lastVerified}
      />
    </div>
  )
}

function Field({ label, value, onChange, min, max }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
      />
    </label>
  )
}

function ResultRow({ label, value, detail }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
      <div>
        <div className="text-sm text-paper/70">{label}</div>
        <div className="text-xs text-paper/40">{detail}</div>
      </div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}

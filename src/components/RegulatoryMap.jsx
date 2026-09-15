import { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import SourceNote from './SourceNote'
import AddToCalendarButton from './AddToCalendarButton'
import { EU_27_NUMERIC_TO_CODE, UK_NUMERIC, SPOTLIGHT_CODES } from '../data/europeCountries'

const GEO_URL = '/geo/countries-50m.json'

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const GENERIC_EU_NOTE =
  'This EU member state is subject to the AMLR and the EUDI Wallet mandate EU-wide. It has not been individually profiled on this map — see the six spotlight countries for rollout-status detail.'

export default function RegulatoryMap({ regulatory }) {
  const [selected, setSelected] = useState(null) // { kind: 'spotlight' | 'uk' | 'eu-generic' | 'other', code }

  const spotlightByCode = useMemo(() => {
    const map = {}
    for (const c of regulatory.spotlightCountries) map[c.code] = c
    return map
  }, [regulatory.spotlightCountries])

  function classify(geo) {
    const numeric = Number(geo.id)
    const name = geo.properties?.name ?? null
    if (numeric === UK_NUMERIC) return { kind: 'uk', code: 'GB', name }
    const code = EU_27_NUMERIC_TO_CODE[numeric]
    if (code && SPOTLIGHT_CODES.has(code)) return { kind: 'spotlight', code, name }
    if (code) return { kind: 'eu-generic', code, name }
    return { kind: 'other', code: null, name }
  }

  function fillFor(kind, isSelected) {
    if (kind === 'uk') return isSelected ? '#d98a3d' : '#b8763a'
    if (kind === 'spotlight') return isSelected ? '#5aacdd' : '#3d8fc7'
    if (kind === 'eu-generic') return isSelected ? '#3c5064' : '#334657'
    return '#2a2a2a'
  }

  const selectedDetail = (() => {
    if (!selected) return null
    if (selected.kind === 'spotlight') return spotlightByCode[selected.code]
    if (selected.kind === 'uk') return regulatory.uk
    if (selected.kind === 'eu-generic') return { generic: true, code: selected.code, name: selected.name }
    return null
  })()

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-ink">Regulatory Map</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          Independent regulatory context: the EU Digital Identity Wallet and
          AMLR apply across all 27 member states under{' '}
          {regulatory.regulationName}, in force since{' '}
          {formatDate(regulatory.inForceDate)}. Six countries are profiled
          individually below; click any highlighted country for detail.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {regulatory.deadlines.map((d) => (
          <div
            key={d.id}
            className="flex flex-col justify-between rounded-2xl border border-line bg-ink p-5 text-paper lg:col-span-1"
          >
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-paper/50">
                {d.title}
              </div>
              <div className="mt-1 text-xl font-semibold">{formatDate(d.date)}</div>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">
                {d.description}
              </p>
            </div>
            <AddToCalendarButton
              className="mt-4 self-start"
              deadline={{
                id: d.id,
                title: d.title,
                date: d.date,
                description: d.description,
                sourceUrl: d.source,
              }}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-ink p-4 lg:col-span-2">
          <ComposableMap
            projection="geoAzimuthalEqualArea"
            projectionConfig={{ rotate: [-15, -52, 0], scale: 950 }}
            width={800}
            height={620}
            style={{ width: '100%', height: 'auto' }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const { kind, code, name } = classify(geo)
                  const isSelected = selected && selected.code === code
                  const interactive = kind !== 'other'
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => interactive && setSelected({ kind, code, name })}
                      fill={fillFor(kind, isSelected)}
                      stroke="#0d0d0d"
                      strokeWidth={0.5}
                      className={interactive ? 'map-country map-country--interactive' : 'map-country'}
                      style={{
                        outline: 'none',
                        cursor: interactive ? 'pointer' : 'default',
                        transition: 'fill 150ms ease, filter 150ms ease',
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-3 text-xs text-paper/60">
            <LegendSwatch color="#334657" label="EU-27 (AMLR + EUDI Wallet)" />
            <LegendSwatch color="#3d8fc7" label="Spotlight country (click for detail)" />
            <LegendSwatch color="#b8763a" label="United Kingdom (ECCTA)" />
            <LegendSwatch color="#2a2a2a" label="Not covered on this map" />
          </div>
        </div>

        <UsCallout us={regulatory.us} />
      </div>

      <DetailPanel detail={selectedDetail} />

      <SourceNote
        label={regulatory.sources[0].label}
        href={regulatory.sources[0].url}
        verified={regulatory.lastVerified}
      />
    </div>
  )
}

function LegendSwatch({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  )
}

function UsCallout({ us }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-line bg-ink p-5 text-paper lg:col-span-1">
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-paper/50">
          {us.headline}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-paper/70">{us.detail}</p>
      </div>
      <SourceNote
        className="mt-4 !bg-white/10 !border-white/10 !text-paper [&_a]:!text-paper [&_span]:!text-paper/60"
        label={us.sourceLabel}
        href={us.source}
        verified={us.lastVerified}
      />
    </div>
  )
}

function DetailPanel({ detail }) {
  if (!detail) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">
        Click a highlighted country on the map to see its rollout status.
      </div>
    )
  }

  if (detail.generic) {
    return (
      <div className="rounded-2xl border border-line bg-paper-raised p-6">
        <div className="text-lg font-semibold text-ink">{detail.name ?? detail.code}</div>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{GENERIC_EU_NOTE}</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in rounded-2xl border border-line bg-paper-raised p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">{detail.name}</h3>
      </div>
      <div className="mt-1 text-sm font-medium text-accent">{detail.headline}</div>
      <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{detail.detail}</p>

      {detail.stats && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat value={`${detail.stats.directorsVerifiedPct}%`} label="Directors verified" />
          <Stat value={`${detail.stats.llpMembersVerifiedPct}%`} label="LLP members verified" />
          <Stat value={`${detail.stats.pscsVerifiedPct}%`} label="PSCs verified" />
        </div>
      )}

      <SourceNote className="mt-5" label={detail.sourceLabel} href={detail.source} verified={detail.lastVerified} />
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="rounded-lg bg-accent-soft px-3 py-2 text-center">
      <div className="text-lg font-semibold text-accent">{value}</div>
      <div className="text-[11px] text-accent/70">{label}</div>
    </div>
  )
}

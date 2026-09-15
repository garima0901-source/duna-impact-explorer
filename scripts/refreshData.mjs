// Weekly refresh: re-checks Duna's three published homepage multipliers and
// updates the JSON's `stats` block if (and only if) all three can be
// confidently re-parsed. It never touches `customers` or `eudi` — those are
// editorially curated facts (press quotes, regulation dates) that should not
// be auto-scraped. If parsing fails or the page markup changed, it aborts
// loudly instead of silently corrupting or leaving stale data unflagged.

const SOURCE_URL = 'https://duna.com/'

const PATTERNS = {
  fasterOnboarding: /(\d+(?:\.\d+)?)\s*x[^.\n]{0,60}?onboarding/i,
  analystEfficiency: /(\d+(?:\.\d+)?)\s*x[^.\n]{0,60}?(analyst|productivity|efficiency)/i,
  conversionMultiplier: /(\d+(?:\.\d+)?)\s*%[^.\n]{0,60}?conversion/i,
}

export async function fetchLatestStats() {
  const res = await fetch(SOURCE_URL, {
    headers: { 'user-agent': 'duna-impact-explorer-refresh-bot/1.0' },
  })
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
  }
  const html = await res.text()
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

  const fasterMatch = text.match(PATTERNS.fasterOnboarding)
  const efficiencyMatch = text.match(PATTERNS.analystEfficiency)
  const conversionMatch = text.match(PATTERNS.conversionMultiplier)

  if (!fasterMatch || !efficiencyMatch || !conversionMatch) {
    throw new Error(
      `Could not confidently re-parse all three stats from ${SOURCE_URL}. ` +
        `Found: faster=${!!fasterMatch} efficiency=${!!efficiencyMatch} conversion=${!!conversionMatch}. ` +
        `Site markup may have changed — leaving existing data untouched.`,
    )
  }

  const fasterOnboarding = Number(fasterMatch[1])
  const analystEfficiency = Number(efficiencyMatch[1])
  const conversionPercent = Number(conversionMatch[1])

  if ([fasterOnboarding, analystEfficiency, conversionPercent].some((n) => !Number.isFinite(n) || n <= 0)) {
    throw new Error('Parsed stats were not valid positive numbers — aborting.')
  }

  return {
    fasterOnboarding,
    analystEfficiency,
    conversionMultiplier: Number((1 + conversionPercent / 100).toFixed(4)),
    source: SOURCE_URL,
    sourceLabel: 'duna.com (homepage)',
  }
}

export function diffStats(current, latest) {
  return {
    fasterOnboarding: current.fasterOnboarding !== latest.fasterOnboarding,
    analystEfficiency: current.analystEfficiency !== latest.analystEfficiency,
    conversionMultiplier: current.conversionMultiplier !== latest.conversionMultiplier,
  }
}

// Allow running standalone for local testing: `node scripts/refreshData.mjs`
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))
if (isMain) {
  const { readFile, writeFile } = await import('node:fs/promises')
  const path = await import('node:path')
  const dataPath = path.resolve(import.meta.dirname, '../public/data/duna-data.json')

  const current = JSON.parse(await readFile(dataPath, 'utf-8'))

  try {
    const latest = await fetchLatestStats()
    const changed = diffStats(current.stats, latest)
    const anyChanged = Object.values(changed).some(Boolean)

    current.stats = {
      ...latest,
      lastVerified: new Date().toISOString().slice(0, 10),
    }

    await writeFile(dataPath, JSON.stringify(current, null, 2) + '\n', 'utf-8')
    console.log(
      anyChanged
        ? `Stats changed and were updated: ${JSON.stringify(changed)}`
        : 'Stats unchanged; refreshed lastVerified date.',
    )
  } catch (err) {
    console.error('Refresh aborted:', err.message)
    process.exitCode = 1
  }
}

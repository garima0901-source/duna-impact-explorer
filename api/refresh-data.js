import { fetchLatestStats, diffStats } from '../scripts/refreshData.mjs'

// Triggered weekly by Vercel Cron (see vercel.json). Re-checks Duna's three
// published multipliers and, if they changed, commits an updated
// public/data/duna-data.json straight to the repo via the GitHub Contents
// API — Vercel functions are stateless, so this is the only way a cron job
// can durably "commit refreshed data to a JSON file" as the spec requires.
// That commit then triggers Vercel's normal auto-deploy on push.
//
// Required env vars (set in Vercel project settings):
//   GITHUB_TOKEN  - a fine-grained PAT with contents:write on the repo
//   GITHUB_REPO   - "owner/repo"
// Optional:
//   GITHUB_BRANCH - defaults to "main"
//   CRON_SECRET   - if set, requests must send `Authorization: Bearer <secret>`

const DATA_PATH = 'public/data/duna-data.json'

export default async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.authorization
    if (auth !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH = 'main' } = process.env
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({
      error: 'Missing GITHUB_TOKEN or GITHUB_REPO environment variables.',
    })
  }

  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'duna-impact-explorer-refresh-bot',
  }

  try {
    const fileRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_PATH}?ref=${GITHUB_BRANCH}`,
      { headers: ghHeaders },
    )
    if (!fileRes.ok) {
      throw new Error(`GitHub read failed: ${fileRes.status} ${await fileRes.text()}`)
    }
    const file = await fileRes.json()
    const current = JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8'))

    const latest = await fetchLatestStats()
    const changed = diffStats(current.stats, latest)
    const anyChanged = Object.values(changed).some(Boolean)
    const today = new Date().toISOString().slice(0, 10)

    current.stats = { ...latest, lastVerified: today }

    if (!anyChanged) {
      return res.status(200).json({ message: 'Stats unchanged; no commit made.', checkedAt: today })
    }

    const commitRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_PATH}`,
      {
        method: 'PUT',
        headers: ghHeaders,
        body: JSON.stringify({
          message: `chore: weekly data refresh (${today})`,
          content: Buffer.from(JSON.stringify(current, null, 2) + '\n').toString('base64'),
          sha: file.sha,
          branch: GITHUB_BRANCH,
        }),
      },
    )
    if (!commitRes.ok) {
      throw new Error(`GitHub commit failed: ${commitRes.status} ${await commitRes.text()}`)
    }

    return res.status(200).json({ message: 'Stats updated and committed.', changed, checkedAt: today })
  } catch (err) {
    console.error('Weekly refresh failed:', err)
    return res.status(500).json({ error: err.message })
  }
}

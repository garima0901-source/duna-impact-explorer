// Public, versioned mirror of the exact JSON the page itself renders from —
// so a technical visitor can verify the data independently of the UI with a
// single curl command: curl https://duna-impact-explorer.vercel.app/api/data
//
// Mirrors public/data/duna-data.json by fetching it from this same
// deployment rather than reading the filesystem directly, since Vercel's
// Node function bundler does not reliably include files under public/ in
// the function's own execution context.

export default async function handler(req, res) {
  try {
    const origin = `https://${req.headers.host}`
    const upstream = await fetch(`${origin}/data/duna-data.json`)
    if (!upstream.ok) {
      throw new Error(`Upstream fetch failed: ${upstream.status}`)
    }
    const data = await upstream.json()

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json({
      version: data.version ?? null,
      fetchedAt: new Date().toISOString(),
      data,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

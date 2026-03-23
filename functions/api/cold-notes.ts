// Cloudflare Pages Function: GET /api/cold-notes
// Returns slugs with fewer than 5 total pageviews (for Hidden Gem feature)

interface Env {
  LISTENS_DB: D1Database
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=3600", // 1 hour cache
  }

  if (!env.LISTENS_DB) {
    return new Response(JSON.stringify({ cold: [] }), { status: 503, headers })
  }

  // Return slugs that have been viewed but fewer than 5 times
  const result = await env.LISTENS_DB.prepare(
    `SELECT slug, COUNT(*) as views
     FROM pageviews
     GROUP BY slug
     HAVING views < 5
     ORDER BY RANDOM()
     LIMIT 100`,
  ).all()

  return new Response(JSON.stringify({ cold: result.results }), { headers })
}

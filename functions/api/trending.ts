// Cloudflare Pages Function: GET /api/trending
// Returns top 10 most-viewed notes from the past 7 days

interface Env {
  LISTENS_DB: D1Database
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=300", // 5 min cache
  }

  if (!env.LISTENS_DB) {
    return new Response(JSON.stringify({ trending: [] }), { status: 503, headers })
  }

  const result = await env.LISTENS_DB.prepare(
    `SELECT slug, COUNT(*) as views, COUNT(DISTINCT listener_id) as unique_views
     FROM pageviews
     WHERE created_at >= datetime('now', '-7 days')
       AND slug NOT IN ('STORY-TRAILS', 'stats', 'contribute', 'analytics', 'index', 'support', '404')
       AND slug NOT LIKE 'games%'
       AND slug NOT LIKE 'explore/%'
       AND slug NOT LIKE 'Trails/%'
       AND slug NOT LIKE 'tags/%'
     GROUP BY slug
     ORDER BY views DESC
     LIMIT 10`,
  ).all()

  return new Response(JSON.stringify({ trending: result.results }), { headers })
}

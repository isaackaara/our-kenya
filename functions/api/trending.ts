// Cloudflare Pages Function: GET /api/trending
// Returns top 10 most-viewed notes from the past 7 days

import { isBot } from "../../lib/bot"

interface Env {
  LISTENS_DB: D1Database
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=300", // 5 min cache
  }

  if (!env.LISTENS_DB) {
    return new Response(JSON.stringify({ trending: [] }), { status: 503, headers })
  }

  // This was the single largest D1 consumer: the top path on the site at roughly
  // 702 requests a day, each an aggregate over the whole pageviews table.
  // Crawlers ran it as often as readers did. They get an empty list, no query.
  if (isBot(request)) {
    return new Response(JSON.stringify({ trending: [] }), { headers })
  }

  // A Cache-Control header alone does NOT stop a Pages Function executing - it
  // only advises browsers. Use the Cache API so a repeat request inside the
  // 5 minute window is served at the edge without touching D1 at all.
  const cache = caches.default
  const cacheKey = new Request(new URL("/api/trending", request.url).toString())

  const cached = await cache.match(cacheKey)
  if (cached) return cached

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

  const response = new Response(JSON.stringify({ trending: result.results }), { headers })
  context.waitUntil(cache.put(cacheKey, response.clone()))
  return response
}

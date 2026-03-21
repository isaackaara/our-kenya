// Cloudflare Pages Function: GET /api/tts-stats
// Returns listen counts and pageview counts

interface Env {
  LISTENS_DB: D1Database
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context
  const url = new URL(context.request.url)

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  }

  if (!env.LISTENS_DB) {
    return new Response(JSON.stringify({ error: "Analytics not configured" }), {
      status: 503,
      headers: corsHeaders,
    })
  }

  const slug = url.searchParams.get("slug")
  const type = url.searchParams.get("type") // "listens", "pageviews", or null (both)

  if (slug) {
    // Stats for a single note
    const data: Record<string, any> = { slug }

    if (type !== "pageviews") {
      const listens = await env.LISTENS_DB.prepare(
        `SELECT COUNT(*) as total, COUNT(DISTINCT listener_id) as unique_users
        FROM listens WHERE slug = ?`,
      ).bind(slug).first()
      data.listens = { total: listens?.total ?? 0, unique_users: listens?.unique_users ?? 0 }
    }

    if (type !== "listens") {
      const views = await env.LISTENS_DB.prepare(
        `SELECT COUNT(*) as total, COUNT(DISTINCT listener_id) as unique_users
        FROM pageviews WHERE slug = ?`,
      ).bind(slug).first()
      data.pageviews = { total: views?.total ?? 0, unique_users: views?.unique_users ?? 0 }
    }

    return new Response(JSON.stringify(data), { headers: corsHeaders })
  }

  // Top notes
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200)

  if (type === "listens") {
    const { results } = await env.LISTENS_DB.prepare(
      `SELECT slug, COUNT(*) as total, COUNT(DISTINCT listener_id) as unique_users
      FROM listens GROUP BY slug ORDER BY total DESC LIMIT ?`,
    ).bind(limit).all()
    return new Response(JSON.stringify({ listens: results }), { headers: corsHeaders })
  }

  if (type === "pageviews") {
    const { results } = await env.LISTENS_DB.prepare(
      `SELECT slug, COUNT(*) as total, COUNT(DISTINCT listener_id) as unique_users
      FROM pageviews GROUP BY slug ORDER BY total DESC LIMIT ?`,
    ).bind(limit).all()
    return new Response(JSON.stringify({ pageviews: results }), { headers: corsHeaders })
  }

  // Both
  const [listens, pageviews] = await Promise.all([
    env.LISTENS_DB.prepare(
      `SELECT slug, COUNT(*) as total, COUNT(DISTINCT listener_id) as unique_users
      FROM listens GROUP BY slug ORDER BY total DESC LIMIT ?`,
    ).bind(limit).all(),
    env.LISTENS_DB.prepare(
      `SELECT slug, COUNT(*) as total, COUNT(DISTINCT listener_id) as unique_users
      FROM pageviews GROUP BY slug ORDER BY total DESC LIMIT ?`,
    ).bind(limit).all(),
  ])

  return new Response(
    JSON.stringify({ listens: listens.results, pageviews: pageviews.results }),
    { headers: corsHeaders },
  )
}

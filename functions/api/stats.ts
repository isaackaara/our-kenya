// Cloudflare Pages Function: GET /api/stats
// Returns aggregate analytics for the public stats dashboard

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
    return new Response(JSON.stringify({ error: "Analytics not configured" }), {
      status: 503,
      headers,
    })
  }

  const [
    pvTotals,
    liTotals,
    pvNotesCount,
    liNotesCount,
    topRead,
    topListened,
    dailyViews,
    dailyListens,
    recentListens,
  ] = await Promise.all([
    // Aggregate pageview totals
    env.LISTENS_DB.prepare(
      "SELECT COUNT(*) as total, COUNT(DISTINCT listener_id) as unique_users FROM pageviews",
    ).first(),

    // Aggregate listen totals
    env.LISTENS_DB.prepare(
      "SELECT COUNT(*) as total, COUNT(DISTINCT listener_id) as unique_users FROM listens",
    ).first(),

    // Unique notes viewed
    env.LISTENS_DB.prepare("SELECT COUNT(DISTINCT slug) as count FROM pageviews").first(),

    // Unique notes listened
    env.LISTENS_DB.prepare("SELECT COUNT(DISTINCT slug) as count FROM listens").first(),

    // Top 20 most-read notes
    env.LISTENS_DB.prepare(
      `SELECT slug, COUNT(*) as total, COUNT(DISTINCT listener_id) as unique_users
      FROM pageviews GROUP BY slug ORDER BY total DESC LIMIT 20`,
    ).all(),

    // Top 20 most-listened notes
    env.LISTENS_DB.prepare(
      `SELECT slug, COUNT(*) as total, COUNT(DISTINCT listener_id) as unique_users
      FROM listens GROUP BY slug ORDER BY total DESC LIMIT 20`,
    ).all(),

    // Daily pageviews (last 30 days)
    env.LISTENS_DB.prepare(
      `SELECT date(created_at) as date, COUNT(*) as count
      FROM pageviews WHERE created_at >= date('now', '-30 days')
      GROUP BY date(created_at) ORDER BY date`,
    ).all(),

    // Daily listens (last 30 days)
    env.LISTENS_DB.prepare(
      `SELECT date(created_at) as date, COUNT(*) as count
      FROM listens WHERE created_at >= date('now', '-30 days')
      GROUP BY date(created_at) ORDER BY date`,
    ).all(),

    // Recent listens (last 10)
    env.LISTENS_DB.prepare(
      `SELECT slug, created_at FROM listens ORDER BY created_at DESC LIMIT 10`,
    ).all(),
  ])

  const data = {
    totals: {
      pageviews: pvTotals?.total ?? 0,
      unique_readers: pvTotals?.unique_users ?? 0,
      listens: liTotals?.total ?? 0,
      unique_listeners: liTotals?.unique_users ?? 0,
      notes_viewed: pvNotesCount?.count ?? 0,
      notes_listened: liNotesCount?.count ?? 0,
    },
    top_read: topRead.results,
    top_listened: topListened.results,
    daily_views: dailyViews.results,
    daily_listens: dailyListens.results,
    recent_listens: recentListens.results,
  }

  return new Response(JSON.stringify(data), { headers })
}

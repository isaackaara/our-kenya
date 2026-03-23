// Cloudflare Pages Function: GET /api/analytics
// Returns internal KPI data (auth-protected via ANALYTICS_KEY)

interface Env {
  LISTENS_DB: D1Database
  ANALYTICS_KEY: string
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "private, max-age=60",
  }

  // Auth check
  const url = new URL(request.url)
  const key = url.searchParams.get("key") || request.headers.get("X-Analytics-Key")
  if (!env.ANALYTICS_KEY || key !== env.ANALYTICS_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers })
  }

  if (!env.LISTENS_DB) {
    return new Response(JSON.stringify({ error: "DB not configured" }), { status: 503, headers })
  }

  const [
    // Engagement KPIs
    sessionData,
    notesDiscovered,
    discoveryRate,
    listenThroughRate,
    // Content KPIs
    coldNoteCount,
    hotNotes,
    risingNotes,
    // Feature KPIs
    eventCounts,
    trailCompletions,
    dailyEvents,
    // Totals
    totals,
  ] = await Promise.all([
    // Session data: all pageviews for sessionization
    env.LISTENS_DB.prepare(
      `SELECT listener_id, created_at FROM pageviews
       WHERE created_at >= datetime('now', '-30 days')
       ORDER BY listener_id, created_at`,
    ).all(),

    // Unique notes discovered (all time)
    env.LISTENS_DB.prepare(
      "SELECT COUNT(DISTINCT slug) as count FROM pageviews",
    ).first(),

    // Discovery rate: new slugs per day (last 30 days)
    env.LISTENS_DB.prepare(
      `SELECT date(first_seen) as date, COUNT(*) as new_slugs FROM (
        SELECT slug, MIN(created_at) as first_seen FROM pageviews GROUP BY slug
      ) WHERE first_seen >= datetime('now', '-30 days')
      GROUP BY date(first_seen) ORDER BY date`,
    ).all(),

    // Listen-through rate
    env.LISTENS_DB.prepare(
      `SELECT
        (SELECT COUNT(DISTINCT slug || listener_id) FROM listens) as listen_events,
        (SELECT COUNT(DISTINCT slug || listener_id) FROM pageviews) as page_events`,
    ).first(),

    // Cold notes (0 views)
    env.LISTENS_DB.prepare(
      "SELECT COUNT(DISTINCT slug) as viewed FROM pageviews",
    ).first(),

    // Hot notes this week
    env.LISTENS_DB.prepare(
      `SELECT slug, COUNT(*) as views, COUNT(DISTINCT listener_id) as unique_views
       FROM pageviews WHERE created_at >= datetime('now', '-7 days')
       GROUP BY slug ORDER BY views DESC LIMIT 20`,
    ).all(),

    // Rising notes: biggest week-over-week increase
    env.LISTENS_DB.prepare(
      `SELECT this_week.slug,
              this_week.views as this_week_views,
              COALESCE(last_week.views, 0) as last_week_views,
              (this_week.views - COALESCE(last_week.views, 0)) as delta
       FROM (
         SELECT slug, COUNT(*) as views FROM pageviews
         WHERE created_at >= datetime('now', '-7 days') GROUP BY slug
       ) this_week
       LEFT JOIN (
         SELECT slug, COUNT(*) as views FROM pageviews
         WHERE created_at >= datetime('now', '-14 days')
           AND created_at < datetime('now', '-7 days') GROUP BY slug
       ) last_week ON this_week.slug = last_week.slug
       ORDER BY delta DESC LIMIT 20`,
    ).all(),

    // Feature event counts (last 30 days)
    env.LISTENS_DB.prepare(
      `SELECT event_type, COUNT(*) as count
       FROM events
       WHERE created_at >= datetime('now', '-30 days')
       GROUP BY event_type ORDER BY count DESC`,
    ).all(),

    // Trail completion rates
    env.LISTENS_DB.prepare(
      `SELECT
        meta as trail_id,
        event_type,
        COUNT(*) as count
       FROM events
       WHERE event_type IN ('trail_advance', 'trail_complete')
         AND created_at >= datetime('now', '-30 days')
       GROUP BY meta, event_type`,
    ).all(),

    // Daily event counts by type (last 30 days)
    env.LISTENS_DB.prepare(
      `SELECT date(created_at) as date, event_type, COUNT(*) as count
       FROM events
       WHERE created_at >= datetime('now', '-30 days')
       GROUP BY date(created_at), event_type
       ORDER BY date`,
    ).all(),

    // Aggregate totals
    env.LISTENS_DB.prepare(
      `SELECT
        (SELECT COUNT(*) FROM pageviews) as total_pageviews,
        (SELECT COUNT(DISTINCT listener_id) FROM pageviews) as unique_readers,
        (SELECT COUNT(*) FROM listens) as total_listens,
        (SELECT COUNT(DISTINCT listener_id) FROM listens) as unique_listeners`,
    ).first(),
  ])

  // Compute session metrics from raw pageview data
  const sessions = computeSessions(sessionData.results as Array<{listener_id: string; created_at: string}>)

  const data = {
    engagement: {
      pages_per_session: sessions.avgPagesPerSession,
      avg_session_duration_seconds: sessions.avgDurationSeconds,
      bounce_rate: sessions.bounceRate,
      notes_discovered: notesDiscovered?.count ?? 0,
      discovery_rate: discoveryRate.results,
      listen_through_rate: listenThroughRate
        ? ((listenThroughRate.listen_events as number) /
            Math.max(listenThroughRate.page_events as number, 1)) * 100
        : 0,
    },
    content: {
      cold_note_count: 8000 - ((coldNoteCount?.viewed as number) ?? 0),
      hot_notes: hotNotes.results,
      rising_notes: risingNotes.results,
    },
    features: {
      event_counts: eventCounts.results,
      trail_completions: trailCompletions.results,
      daily_events: dailyEvents.results,
    },
    totals,
  }

  return new Response(JSON.stringify(data), { headers })
}

function computeSessions(
  rows: Array<{ listener_id: string; created_at: string }>,
): { avgPagesPerSession: number; avgDurationSeconds: number; bounceRate: number } {
  if (!rows.length) {
    return { avgPagesPerSession: 0, avgDurationSeconds: 0, bounceRate: 0 }
  }

  const GAP_MS = 30 * 60 * 1000 // 30 minutes
  const sessions: Array<{ pages: number; durationMs: number }> = []

  let currentListener = rows[0].listener_id
  let sessionStart = new Date(rows[0].created_at).getTime()
  let sessionEnd = sessionStart
  let pageCount = 1

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const ts = new Date(row.created_at).getTime()

    if (row.listener_id !== currentListener || ts - sessionEnd > GAP_MS) {
      // End previous session
      sessions.push({ pages: pageCount, durationMs: sessionEnd - sessionStart })
      currentListener = row.listener_id
      sessionStart = ts
      sessionEnd = ts
      pageCount = 1
    } else {
      sessionEnd = ts
      pageCount++
    }
  }
  // Final session
  sessions.push({ pages: pageCount, durationMs: sessionEnd - sessionStart })

  const totalPages = sessions.reduce((s, x) => s + x.pages, 0)
  const totalDuration = sessions.reduce((s, x) => s + x.durationMs, 0)
  const bounces = sessions.filter((s) => s.pages === 1).length

  return {
    avgPagesPerSession: Math.round((totalPages / sessions.length) * 10) / 10,
    avgDurationSeconds: Math.round(totalDuration / sessions.length / 1000),
    bounceRate: Math.round((bounces / sessions.length) * 1000) / 10,
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Analytics-Key",
    },
  })
}

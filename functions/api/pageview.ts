// Cloudflare Pages Function: POST /api/pageview
// Logs page views for analytics

interface Env {
  LISTENS_DB: D1Database
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Listener-ID",
  }

  if (!env.LISTENS_DB) {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  let slug: string
  let referrerSlug: string | null = null
  try {
    const body = await request.json() as { slug: string; referrer_slug?: string }
    slug = body.slug
    referrerSlug = body.referrer_slug || null
  } catch {
    return new Response(null, { status: 400, headers: corsHeaders })
  }

  if (!slug) {
    return new Response(null, { status: 400, headers: corsHeaders })
  }

  const listenerId = request.headers.get("X-Listener-ID") || "anonymous"

  context.waitUntil(
    env.LISTENS_DB.prepare(
      "INSERT INTO pageviews (slug, listener_id, referrer_slug) VALUES (?, ?, ?)",
    )
      .bind(slug, listenerId, referrerSlug)
      .run()
      .catch(() => {}),
  )

  return new Response(null, { status: 204, headers: corsHeaders })
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Listener-ID",
    },
  })
}

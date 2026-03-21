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
  try {
    const body: { slug: string } = await request.json()
    slug = body.slug
  } catch {
    return new Response(null, { status: 400, headers: corsHeaders })
  }

  if (!slug) {
    return new Response(null, { status: 400, headers: corsHeaders })
  }

  const listenerId = request.headers.get("X-Listener-ID") || "anonymous"

  context.waitUntil(
    env.LISTENS_DB.prepare("INSERT INTO pageviews (slug, listener_id) VALUES (?, ?)")
      .bind(slug, listenerId)
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

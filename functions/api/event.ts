// Cloudflare Pages Function: POST /api/event
// Logs feature interaction events for analytics

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

  let event_type: string
  let slug: string | null = null
  let meta: string | null = null
  try {
    const body = await request.json() as { event_type: string; slug?: string; meta?: string }
    event_type = body.event_type
    slug = body.slug || null
    meta = body.meta || null
  } catch {
    return new Response(null, { status: 400, headers: corsHeaders })
  }

  if (!event_type) {
    return new Response(null, { status: 400, headers: corsHeaders })
  }

  const listenerId = request.headers.get("X-Listener-ID") || "anonymous"

  context.waitUntil(
    env.LISTENS_DB.prepare(
      "INSERT INTO events (event_type, slug, meta, listener_id) VALUES (?, ?, ?, ?)",
    )
      .bind(event_type, slug, meta, listenerId)
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

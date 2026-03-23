// Cloudflare Pages Function: GET /audio/{slug}.mp3
// Serves pre-generated audio from R2 bucket

interface Env {
  AUDIO_BUCKET: R2Bucket
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { params, env } = context

  if (!env.AUDIO_BUCKET) {
    return new Response("Audio storage not configured", { status: 503 })
  }

  // params.path is an array for [[path]] catch-all routes
  const pathParts = Array.isArray(params.path) ? params.path : [params.path]
  const key = pathParts.join("/")

  if (!key || !key.endsWith(".mp3")) {
    return new Response("Not found", { status: 404 })
  }

  const object = await env.AUDIO_BUCKET.get(key)
  if (!object) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=2592000",
      "ETag": object.httpEtag,
    },
  })
}

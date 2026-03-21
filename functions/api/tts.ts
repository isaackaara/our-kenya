// Cloudflare Pages Function: POST /api/tts
// Proxies text to OpenAI TTS API, caches at edge, returns MP3

interface Env {
  OPENAI_API_KEY: string
  LISTENS_DB: D1Database
}

interface TtsRequest {
  slug: string
  text: string
}

const RATE_LIMIT_MAX = 20 // per IP per hour
const RATE_LIMIT_WINDOW = 3600 // seconds
const CACHE_TTL = 30 * 24 * 3600 // 30 days
const MAX_CHUNK_CHARS = 4096
const TTS_MODEL = "tts-1"
const TTS_VOICE = "nova"

// Simple in-memory rate limit (resets on cold start — good enough for edge)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now() / 1000
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

// Split text at sentence boundaries, keeping chunks under MAX_CHUNK_CHARS
function splitText(text: string): string[] {
  if (text.length <= MAX_CHUNK_CHARS) return [text]

  const chunks: string[] = []
  let remaining = text

  while (remaining.length > 0) {
    if (remaining.length <= MAX_CHUNK_CHARS) {
      chunks.push(remaining)
      break
    }

    // Find last sentence boundary within limit
    const slice = remaining.slice(0, MAX_CHUNK_CHARS)
    let splitIdx = -1
    for (const sep of [". ", "! ", "? ", ".\n", "!\n", "?\n"]) {
      const idx = slice.lastIndexOf(sep)
      if (idx > splitIdx) splitIdx = idx + sep.length
    }

    // Fallback: split at last space
    if (splitIdx <= 0) {
      splitIdx = slice.lastIndexOf(" ")
    }
    // Last resort: hard split
    if (splitIdx <= 0) {
      splitIdx = MAX_CHUNK_CHARS
    }

    chunks.push(remaining.slice(0, splitIdx).trim())
    remaining = remaining.slice(splitIdx).trim()
  }

  return chunks.filter((c) => c.length > 0)
}

// Simple content hash for cache key stability
async function hashText(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hash))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Concatenate MP3 buffers (simple append works for MP3 frames)
function concatBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((sum, b) => sum + b.byteLength, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const buf of buffers) {
    result.set(new Uint8Array(buf), offset)
    offset += buf.byteLength
  }
  return result.buffer
}

async function generateTtsStream(text: string, apiKey: string): Promise<Response> {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: text,
      response_format: "mp3",
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI TTS error ${response.status}: ${err}`)
  }

  return response
}

async function generateTtsBuffer(text: string, apiKey: string): Promise<ArrayBuffer> {
  const response = await generateTtsStream(text, apiKey)
  return response.arrayBuffer()
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  // Validate API key is configured
  if (!env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "TTS not configured" }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  // Rate limiting by IP
  const ip = request.headers.get("CF-Connecting-IP") || "unknown"
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  // Parse request
  let body: TtsRequest
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  const { slug, text } = body
  if (!slug || !text || text.length < 10) {
    return new Response(JSON.stringify({ error: "Missing slug or text" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  if (text.length > 50000) {
    return new Response(JSON.stringify({ error: "Text too long (max 50,000 chars)" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  // Log listen (non-blocking)
  const listenerId = request.headers.get("X-Listener-ID") || "anonymous"
  if (env.LISTENS_DB) {
    context.waitUntil(
      env.LISTENS_DB.prepare("INSERT INTO listens (slug, listener_id) VALUES (?, ?)")
        .bind(slug, listenerId)
        .run()
        .catch(() => {}),
    )
  }

  // Check Cloudflare Cache API
  const contentHash = await hashText(text)
  const cacheUrl = new URL(request.url)
  cacheUrl.pathname = `/api/tts-cache/${slug}/${contentHash}.mp3`
  const cacheKey = new Request(cacheUrl.toString())
  const cache = caches.default

  const cachedResponse = await cache.match(cacheKey)
  if (cachedResponse) {
    return new Response(cachedResponse.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": `public, max-age=${CACHE_TTL}`,
        "X-Cache": "HIT",
      },
    })
  }

  // Generate TTS
  try {
    const chunks = splitText(text)
    const responseHeaders = {
      ...corsHeaders,
      "Content-Type": "audio/mpeg",
      "Cache-Control": `public, max-age=${CACHE_TTL}`,
      "X-Cache": "MISS",
    }

    if (chunks.length === 1) {
      // Stream single-chunk response directly — no buffering
      const ttsResponse = await generateTtsStream(chunks[0], env.OPENAI_API_KEY)

      // Tee the stream: one for the client, one for caching
      const [clientStream, cacheStream] = ttsResponse.body!.tee()
      context.waitUntil(
        new Response(cacheStream).arrayBuffer().then((buf) =>
          cache.put(cacheKey, new Response(buf, { headers: responseHeaders }))
        ),
      )

      return new Response(clientStream, { headers: responseHeaders })
    }

    // Multi-chunk: parallel TTS, buffer and concatenate
    const buffers = await Promise.all(
      chunks.map((chunk) => generateTtsBuffer(chunk, env.OPENAI_API_KEY)),
    )
    const audioBuffer = concatBuffers(buffers)

    const response = new Response(audioBuffer, { headers: responseHeaders })
    context.waitUntil(cache.put(cacheKey, response.clone()))
    return response
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "TTS generation failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
}

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

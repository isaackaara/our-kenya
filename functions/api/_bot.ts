// Shared bot detection for the analytics endpoints.
//
// Why this exists: ourkenya.com runs at roughly 96-98% crawler traffic (measured
// 2026-08-31 against Cloudflare zone analytics). Crawlers execute JavaScript, so
// every Baiduspider or HeadlessChrome visit fired /api/pageview, /api/trending and
// /api/stats exactly like a browser. On 2026-09-01 that blew the D1 free tier:
// 112M rows read from 2,000 queries, about 56,000 rows scanned per query.
//
// We deliberately do NOT block crawlers from the site. The site needs search
// indexing. We only stop them writing analytics rows and triggering aggregate
// queries, which is where the cost and the data pollution both come from.
//
// A file prefixed with _ is not routed by Cloudflare Pages, so this is a helper
// rather than an endpoint.

// Matched case-insensitively against the User-Agent. Every token here is a
// self-identified bot, not a heuristic on a real browser string.
const BOT_TOKENS = [
  // Named crawlers seen in ourkenya's own traffic, 2026-08-31
  "baiduspider",
  "mj12bot",
  "amazonbot",
  "sogou",
  "headlesschrome",
  // Search and SEO
  "googlebot",
  "bingbot",
  "yandex",
  "duckduckbot",
  "slurp",
  "ahrefsbot",
  "semrushbot",
  "dotbot",
  "petalbot",
  "applebot",
  "seznambot",
  "bytespider",
  // AI and LLM crawlers
  "gptbot",
  "claudebot",
  "claude-web",
  "anthropic-ai",
  "perplexitybot",
  "ccbot",
  "google-extended",
  "cohere-ai",
  "diffbot",
  "omgili",
  "facebookbot",
  "meta-externalagent",
  // Generic self-identifiers
  "bot",
  "crawler",
  "spider",
  "crawling",
  "scrapy",
  "python-requests",
  "curl/",
  "wget",
  "http-client",
  "phantomjs",
  "puppeteer",
  "playwright",
  "lighthouse",
  "pingdom",
  "uptimerobot",
]

/**
 * True when the request looks automated and should not be counted or served
 * an aggregate query.
 *
 * Conservative by design: a missing User-Agent counts as a bot (real browsers
 * always send one), but we never try to infer "bot" from a plausible browser
 * string. A determined scraper spoofing Chrome will get through, and that is
 * an accepted trade - the goal is removing the 96% that self-identifies, not
 * winning an arms race.
 */
export function isBot(request: Request): boolean {
  const ua = request.headers.get("User-Agent")
  if (!ua) return true
  const lower = ua.toLowerCase()
  return BOT_TOKENS.some((token) => lower.includes(token))
}

let _prevSlug: string | null = null

document.addEventListener("nav", () => {
  const slug = window.location.pathname.replace(/^\/|\/$/g, "")
  if (!slug) return

  // Reuse the same anonymous listener ID as the audio player
  const key = "ok-listener-id"
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }

  // Track visited slugs in localStorage for ExploreProgress
  try {
    const visited = JSON.parse(localStorage.getItem("ok-visited-slugs") || "[]") as string[]
    if (!visited.includes(slug)) {
      visited.push(slug)
      localStorage.setItem("ok-visited-slugs", JSON.stringify(visited))
    }
  } catch { /* ignore */ }

  const referrerSlug = _prevSlug
  _prevSlug = slug

  // Fire-and-forget — don't block anything
  fetch("/api/pageview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Listener-ID": id,
    },
    body: JSON.stringify({ slug, referrer_slug: referrerSlug }),
  }).catch(() => {})
})

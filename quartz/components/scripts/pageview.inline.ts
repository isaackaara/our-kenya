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

  // Fire-and-forget — don't block anything
  fetch("/api/pageview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Listener-ID": id,
    },
    body: JSON.stringify({ slug }),
  }).catch(() => {})
})

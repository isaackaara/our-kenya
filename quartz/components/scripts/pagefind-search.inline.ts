declare global {
  interface Window {
    PagefindUI: any
  }
}

function setupPagefindSearch() {
  const trigger = document.getElementById("pagefind-trigger")
  const container = document.getElementById("pagefind-container")
  const closeBtn = document.getElementById("pagefind-close")
  if (!trigger || !container || !closeBtn) return

  let loaded = (trigger as any).__pagefindLoaded ?? false

  function closeSearch() {
    container!.style.display = "none"
    container!.style.pointerEvents = "none"
    container!.setAttribute("aria-hidden", "true")
  }

  trigger.onclick = async function () {
    container!.style.display = ""
    container!.style.pointerEvents = "auto"
    container!.removeAttribute("aria-hidden")
    if (!loaded) {
      loaded = true
      ;(trigger as any).__pagefindLoaded = true
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "/pagefind/pagefind-ui.css"
      document.head.appendChild(link)
      const script = document.createElement("script")
      script.src = "/pagefind/pagefind-ui.js"
      script.onload = function () {
        new window.PagefindUI({ element: "#pagefind-search", showSubResults: true })
        setTimeout(function () {
          const input = document.querySelector<HTMLInputElement>("#pagefind-search input")
          if (input) input.focus()
          const searchEl = document.getElementById("pagefind-search")
          if (searchEl) {
            const observer = new MutationObserver(function () {
              const existing = searchEl.querySelector(".ok-search-empty")
              const message = searchEl.querySelector(".pagefind-ui__message")
              const results = searchEl.querySelectorAll(".pagefind-ui__result")
              const searchInput = searchEl.querySelector<HTMLInputElement>("input")
              const hasQuery = searchInput && searchInput.value.trim() !== ""
              if (message && results.length === 0 && hasQuery) {
                if (!existing) {
                  const div = document.createElement("div")
                  div.className = "ok-search-empty"
                  div.innerHTML =
                    "<p>We don\u2019t have anything on this yet.</p><p>ourkenya.com is a living archive. If this story matters, help us tell it.</p><a href=\"/contribute\" class=\"ok-btn ok-btn-primary\">Suggest this topic \u2192</a>"
                  searchEl.appendChild(div)
                }
              } else {
                if (existing) existing.remove()
              }
            })
            observer.observe(searchEl, { childList: true, subtree: true })
          }
        }, 100)
      }
      document.head.appendChild(script)
    } else {
      setTimeout(function () {
        const input = document.querySelector<HTMLInputElement>("#pagefind-search input")
        if (input) input.focus()
      }, 100)
    }
  }

  closeBtn.onclick = closeSearch

  container.onclick = function (e) {
    if (e.target === container) closeSearch()
  }

  document.addEventListener("keydown", function handler(e) {
    if (e.key === "Escape") {
      closeSearch()
      document.removeEventListener("keydown", handler)
    }
  })

  // Track search result clicks
  container.addEventListener("click", function (e) {
    const link = (e.target as HTMLElement).closest("a.pagefind-ui__result-link") as HTMLAnchorElement | null
    if (!link) return
    const searchInput = document.querySelector<HTMLInputElement>("#pagefind-search input")
    const query = searchInput?.value?.trim() || ""
    const id = localStorage.getItem("ok-listener-id") || "anonymous"
    fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Listener-ID": id },
      body: JSON.stringify({ event_type: "search", slug: link.pathname.replace(/^\/|\/$/g, ""), meta: query }),
    }).catch(() => {})
  })

  // Focus trap: keep Tab cycling within the modal when open
  container.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return
    const focusable = container!.querySelectorAll<HTMLElement>(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  })
}

document.addEventListener("nav", setupPagefindSearch)
setupPagefindSearch()

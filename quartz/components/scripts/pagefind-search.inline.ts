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
  }

  trigger.onclick = async function () {
    container!.style.display = ""
    container!.style.pointerEvents = "auto"
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
}

document.addEventListener("nav", setupPagefindSearch)
setupPagefindSearch()

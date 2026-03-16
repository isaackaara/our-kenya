function initTrailHub() {
  const searchInput = document.getElementById("trail-search") as HTMLInputElement | null
  const categoryTabs = document.querySelectorAll<HTMLElement>(".trail-category-tab")
  const trailCards = document.querySelectorAll<HTMLElement>(".trail-card")
  const trailCount = document.getElementById("trail-count")
  const randomBtn = document.getElementById("random-trail-btn")

  if (!searchInput || !trailCount || categoryTabs.length === 0) return

  let activeCategory = "All"
  let searchQuery = ""

  function updateDisplay() {
    let visibleCount = 0
    trailCards.forEach((card) => {
      const category = card.getAttribute("data-category") || ""
      const name = card.getAttribute("data-name") || ""
      const description = card.getAttribute("data-description") || ""
      const categoryMatch = activeCategory === "All" || category === activeCategory
      const searchMatch =
        searchQuery === "" ||
        name.includes(searchQuery) ||
        description.includes(searchQuery)
      if (categoryMatch && searchMatch) {
        card.style.display = ""
        visibleCount++
      } else {
        card.style.display = "none"
      }
    })
    trailCount.textContent = "Showing " + visibleCount + " of " + trailCards.length + " trails"
  }

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")
      activeCategory = tab.getAttribute("data-category") || "All"
      updateDisplay()
    })
  })

  searchInput.addEventListener("input", (e) => {
    searchQuery = (e.target as HTMLInputElement).value.toLowerCase()
    updateDisplay()
  })

  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const visible: HTMLElement[] = []
      trailCards.forEach((card) => {
        if (card.style.display !== "none") visible.push(card)
      })
      if (visible.length > 0) {
        const pick = visible[Math.floor(Math.random() * visible.length)] as HTMLAnchorElement
        if (pick.href) window.location.href = pick.href
      }
    })
  }
}

document.addEventListener("nav", initTrailHub)
initTrailHub()
setTimeout(initTrailHub, 150)
setTimeout(initTrailHub, 400)

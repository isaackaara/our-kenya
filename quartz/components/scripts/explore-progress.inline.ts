function initExploreProgress() {
  if (!window.location.pathname.startsWith("/explore/")) return

  const tree = document.querySelector(".ok-explore-tree") as HTMLElement | null
  if (!tree) return

  const topic = tree.getAttribute("data-root")
  if (!topic) return

  // Remove any existing progress bar (SPA nav re-run)
  const existing = document.querySelector(".ok-explore-progress")
  if (existing) existing.remove()

  // Read visited slugs from localStorage
  let visited: string[] = []
  try {
    visited = JSON.parse(localStorage.getItem("ok-visited-slugs") || "[]")
  } catch {
    visited = []
  }

  // Count visited slugs that match this topic
  // Match slugs that contain the topic name (case-insensitive)
  const topicLower = topic.toLowerCase().replace(/\s+/g, "-")
  const topicWords = topic.toLowerCase().replace(/-/g, " ")
  const visitedCount = visited.filter((slug) => {
    const slugLower = slug.toLowerCase()
    return (
      slugLower.startsWith(topicLower + "/") ||
      slugLower.startsWith(topicLower) ||
      slugLower.includes("/" + topicLower + "/") ||
      slugLower.includes("/" + topicLower) ||
      slugLower.includes(topicWords.replace(/\s+/g, "-")) ||
      slugLower.includes(topicWords.replace(/\s+/g, "%20"))
    )
  }).length

  // Wait briefly for the explore tree to render its links, then count total
  const renderProgress = () => {
    const links = tree.querySelectorAll("a")
    const totalCount = links.length

    if (totalCount === 0) return

    const explored = Math.min(visitedCount, totalCount)
    const pct = totalCount > 0 ? ((explored / totalCount) * 100).toFixed(1) : "0"

    const progressEl = document.createElement("div")
    progressEl.className = "ok-explore-progress"
    progressEl.setAttribute("role", "status")
    progressEl.setAttribute("aria-label", `You have explored ${explored} of ${totalCount} ${topic} notes`)

    progressEl.innerHTML = `
      <div class="ok-explore-progress-label">
        You've explored <strong>${explored}</strong> of <strong>${totalCount}</strong> ${topic} notes
      </div>
      <div class="ok-explore-progress-bar" role="progressbar"
           aria-valuenow="${explored}" aria-valuemin="0" aria-valuemax="${totalCount}">
        <div class="ok-explore-progress-fill" style="width: ${pct}%"></div>
      </div>
    `

    tree.parentNode?.insertBefore(progressEl, tree)
  }

  // The explore tree renders asynchronously; poll briefly for links to appear
  let attempts = 0
  const poll = setInterval(() => {
    attempts++
    const links = tree.querySelectorAll("a")
    if (links.length > 0 || attempts > 20) {
      clearInterval(poll)
      renderProgress()
    }
  }, 200)
}

document.addEventListener("nav", () => {
  initExploreProgress()
})

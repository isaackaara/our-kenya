// explore-tree.inline.ts
// Renders a filtered accordion tree for a specific content root

document.addEventListener("nav", async () => {
  const container = document.querySelector<HTMLElement>(".ok-explore-tree")
  if (!container) return

  const rawRoot = container.dataset.root || ""
  // Convert folder name to slug prefix: "Coast History" -> "coast-history"
  const slugPrefix = rawRoot.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

  // fetchData is the global Quartz content index promise
  const data = await fetchData

  // Filter entries whose slug starts with the prefix
  const entries = Object.entries(data).filter(([slug]) =>
    slug.startsWith(slugPrefix + "/") || slug === slugPrefix
  )

  if (entries.length === 0) {
    container.innerHTML = "<p>No content found for this theme.</p>"
    return
  }

  // Build a simple nested structure
  // Group by immediate subfolder
  const groups: Record<string, { slug: string; title: string }[]> = {}
  const topLevel: { slug: string; title: string }[] = []

  for (const [slug, details] of entries) {
    const relative = slug.slice(slugPrefix.length + 1) // remove prefix + "/"
    const parts = relative.split("/")
    if (parts.length === 1) {
      topLevel.push({ slug, title: (details as any).title || parts[0] })
    } else {
      const subfolder = parts[0]
      if (!groups[subfolder]) groups[subfolder] = []
      groups[subfolder].push({ slug, title: (details as any).title || parts[parts.length - 1] })
    }
  }

  // Render HTML
  let html = `<div class="ok-tree">`

  // Top level notes first
  for (const note of topLevel.sort((a, b) => a.title.localeCompare(b.title))) {
    html += `<a class="ok-tree-note" href="/${note.slug}">${note.title}</a>`
  }

  // Subfolders as collapsible sections
  const sortedGroups = Object.keys(groups).sort()
  for (const folder of sortedGroups) {
    const notes = groups[folder].sort((a, b) => a.title.localeCompare(b.title))
    const displayName = folder.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    html += `
      <details class="ok-tree-folder">
        <summary class="ok-tree-folder-name">${displayName} <span class="ok-tree-count">${notes.length}</span></summary>
        <div class="ok-tree-children">
          ${notes.map((n) => `<a class="ok-tree-note" href="/${n.slug}">${n.title}</a>`).join("")}
        </div>
      </details>`
  }

  html += `</div>`
  container.innerHTML = html
})

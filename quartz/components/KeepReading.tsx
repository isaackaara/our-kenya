import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/keep-reading.scss"
import { resolveRelative, simplifySlug } from "../util/path"
import { classNames } from "../util/lang"

export default (() => {
  const KeepReading: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {
    const slug = simplifySlug(fileData.slug!)
    const fullSlug = fileData.slug!

    // Don't show on homepage, STORY-TRAILS, explore/*, tags/*, or folder index pages
    if (
      slug === "index" ||
      slug === "STORY-TRAILS" ||
      fullSlug.startsWith("explore/") ||
      fullSlug.startsWith("tags/") ||
      fullSlug.startsWith("Trails/")
    ) {
      return null
    }

    // Skip folder index pages (slug matches a folder name with no further path)
    const isFolder = allFiles.some(
      (f) => f.slug && f.slug !== fullSlug && f.slug.startsWith(fullSlug + "/"),
    )
    if (isFolder) return null

    const currentLinks = new Set(fileData.links ?? [])
    if (currentLinks.size === 0) return null

    // Determine current note's folder (topic)
    const currentFolder = fullSlug.includes("/") ? fullSlug.split("/")[0] : ""

    // Score every other note by co-citation (shared outgoing links)
    type Candidate = {
      slug: string
      title: string
      folder: string
      score: number
    }

    const candidates: Candidate[] = []

    for (const file of allFiles) {
      const otherSlug = simplifySlug(file.slug!)
      if (otherSlug === slug) continue
      if (!file.links || file.links.length === 0) continue
      if (!file.frontmatter?.title) continue

      // Skip special pages
      if (
        file.slug!.startsWith("explore/") ||
        file.slug!.startsWith("tags/") ||
        file.slug!.startsWith("Trails/") ||
        otherSlug === "index" ||
        otherSlug === "STORY-TRAILS" ||
        otherSlug === "stats"
      ) {
        continue
      }

      let overlap = 0
      for (const link of file.links) {
        if (currentLinks.has(link)) overlap++
      }

      if (overlap > 0) {
        const folder = file.slug!.includes("/") ? file.slug!.split("/")[0] : ""
        candidates.push({
          slug: file.slug!,
          title: file.frontmatter.title,
          folder,
          score: overlap,
        })
      }
    }

    // Sort by overlap score descending
    candidates.sort((a, b) => b.score - a.score)

    // Pick 2 same-topic, 1 different-topic
    const sameTopic = candidates.filter((c) => c.folder === currentFolder)
    const diffTopic = candidates.filter((c) => c.folder !== currentFolder)

    const picks: { slug: string; title: string; wild: boolean }[] = []

    // 2 from same topic
    for (const c of sameTopic) {
      if (picks.length >= 2) break
      picks.push({ slug: c.slug, title: c.title, wild: false })
    }

    // 1 wild card from different topic
    for (const c of diffTopic) {
      if (picks.length >= 3) break
      picks.push({ slug: c.slug, title: c.title, wild: true })
    }

    // Fill remaining slots from whatever is available
    if (picks.length < 3) {
      const pickedSlugs = new Set(picks.map((p) => p.slug))
      for (const c of candidates) {
        if (picks.length >= 3) break
        if (pickedSlugs.has(c.slug)) continue
        picks.push({ slug: c.slug, title: c.title, wild: c.folder !== currentFolder })
        pickedSlugs.add(c.slug)
      }
    }

    // If still not enough, fill with random notes from allFiles
    if (picks.length < 3) {
      const pickedSlugs = new Set(picks.map((p) => p.slug))
      const pool = allFiles.filter((f) => {
        const s = simplifySlug(f.slug!)
        return (
          s !== slug &&
          !pickedSlugs.has(f.slug!) &&
          f.frontmatter?.title &&
          !f.slug!.startsWith("explore/") &&
          !f.slug!.startsWith("tags/") &&
          !f.slug!.startsWith("Trails/") &&
          s !== "index" &&
          s !== "STORY-TRAILS" &&
          s !== "stats"
        )
      })

      // Deterministic pseudo-random based on slug to avoid different results per build
      let hash = 0
      for (let i = 0; i < fullSlug.length; i++) {
        hash = (hash * 31 + fullSlug.charCodeAt(i)) | 0
      }

      while (picks.length < 3 && pool.length > 0) {
        const idx = Math.abs(hash) % pool.length
        const file = pool[idx]
        const folder = file.slug!.includes("/") ? file.slug!.split("/")[0] : ""
        picks.push({
          slug: file.slug!,
          title: file.frontmatter!.title,
          wild: folder !== currentFolder,
        })
        pool.splice(idx, 1)
        hash = (hash * 31 + 7) | 0
      }
    }

    if (picks.length === 0) return null

    return (
      <div class={classNames(displayClass, "keep-reading")}>
        <h3>Keep Reading</h3>
        <div class="keep-reading-cards">
          {picks.map((pick) => (
            <a href={resolveRelative(fileData.slug!, pick.slug)} class="keep-reading-card internal">
              <span class="keep-reading-label">{pick.wild ? "Something different" : "Related"}</span>
              <span class="keep-reading-title">{pick.title}</span>
            </a>
          ))}
        </div>
      </div>
    )
  }

  KeepReading.css = style
  KeepReading.afterDOMLoaded = `
  document.addEventListener("click", function(e) {
    var card = e.target.closest(".keep-reading-card")
    if (!card) return
    var id = localStorage.getItem("ok-listener-id") || "anonymous"
    var href = card.getAttribute("href") || ""
    var slug = href.replace(/^\\/|\\/$/, "")
    fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Listener-ID": id },
      body: JSON.stringify({ event_type: "keep_reading_click", slug: slug })
    }).catch(function() {})
  })
  `
  return KeepReading
}) satisfies QuartzComponentConstructor

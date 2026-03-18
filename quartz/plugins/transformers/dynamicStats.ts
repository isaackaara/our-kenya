import { QuartzTransformerPlugin } from "../types"
import fs from "fs"
import path from "path"

// Cached stats computed once per build
let cachedStats: Record<string, string> | null = null

function computeStats(contentDir: string): Record<string, string> {
  const mdFiles: string[] = []
  let totalWikilinks = 0

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.name.endsWith(".md")) {
        mdFiles.push(fullPath)
      }
    }
  }

  walk(contentDir)

  // Count wikilinks across all files
  const wikilinkPattern = /\[\[([^\]]+)\]\]/g
  for (const file of mdFiles) {
    const content = fs.readFileSync(file, "utf-8")
    const matches = content.match(wikilinkPattern)
    if (matches) {
      totalWikilinks += matches.length
    }
  }

  // Count trails
  const trailsDir = path.join(contentDir, "Trails")
  let trailCount = 0
  if (fs.existsSync(trailsDir)) {
    trailCount = fs.readdirSync(trailsDir).filter((f) => f.endsWith(".md")).length
  }

  const fmt = (n: number) => n.toLocaleString("en-US")

  return {
    NOTE_COUNT: fmt(mdFiles.length),
    CONNECTION_COUNT: fmt(totalWikilinks),
    TRAIL_COUNT: fmt(trailCount),
  }
}

export const DynamicStats: QuartzTransformerPlugin = () => ({
  name: "DynamicStats",
  textTransform(ctx, src) {
    if (!src.includes("{{")) return src

    if (!cachedStats) {
      const contentDir = path.resolve(ctx.argv.directory)
      cachedStats = computeStats(contentDir)
    }

    return src.replace(/\{\{(\w+)\}\}/g, (match, token) => {
      return cachedStats![token] ?? match
    })
  },
})

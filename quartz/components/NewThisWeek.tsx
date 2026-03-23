import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/new-this-week.scss"
import { resolveRelative } from "../util/path"

function relativeDate(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "today"
  if (diffDays === 1) return "yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return "1 week ago"
  return `${Math.floor(diffDays / 7)} weeks ago`
}

export default (() => {
  const NewThisWeek: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    if (fileData.slug !== "index") return null

    const now = new Date()
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const recentNotes = allFiles
      .filter((f) => {
        if (!f.dates?.created) return false
        if (!f.slug || f.slug === "index") return false
        return f.dates.created >= fourteenDaysAgo
      })
      .sort((a, b) => b.dates!.created.getTime() - a.dates!.created.getTime())
      .slice(0, 5)

    if (recentNotes.length === 0) return null

    return (
      <div class="new-this-week">
        <h2>New This Week</h2>
        <ul>
          {recentNotes.map((note) => {
            const title = note.frontmatter?.title ?? note.slug!
            const created = note.dates!.created
            return (
              <li>
                <a href={resolveRelative(fileData.slug!, note.slug!)} class="internal">
                  {title}
                </a>
                <span class="ntw-date">{relativeDate(created, now)}</span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  NewThisWeek.css = style
  return NewThisWeek
}) satisfies QuartzComponentConstructor

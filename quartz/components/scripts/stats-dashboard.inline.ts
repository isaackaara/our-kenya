document.addEventListener("nav", () => {
  const container = document.getElementById("ok-stats-dashboard")
  if (!container) return

  // ── Helpers ─────────────────────────────────────────────────
  const slugToTitle = (slug: string): string => {
    const last = slug.split("/").pop() || slug
    return last
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/%20/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  const fmtNum = (n: number): string => n.toLocaleString()

  const fmtDate = (d: string): string => {
    const date = new Date(d + "T00:00:00Z")
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }

  // ── Loading state ───────────────────────────────────────────
  container.innerHTML = `<div class="ok-stats-loading">Loading stats...</div>`

  // ── Fetch and render ────────────────────────────────────────
  fetch("/api/stats")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load stats")
      return res.json()
    })
    .then((data: any) => {
      const t = data.totals
      const hasData = t.pageviews > 0 || t.listens > 0

      if (!hasData) {
        container.innerHTML = `<div class="ok-stats-empty">Stats will appear here once people start reading. Check back soon.</div>`
        return
      }

      let html = ""

      // ── Totals cards ──────────────────────────────────────
      html += `<div class="ok-stats-totals">`
      html += card("Total Reads", fmtNum(t.pageviews), "Pages viewed across the archive")
      html += card("Unique Readers", fmtNum(t.unique_readers), "Distinct visitors")
      html += card("Total Listens", fmtNum(t.listens), "Articles played via audio")
      html += card("Unique Listeners", fmtNum(t.unique_listeners), "People who used Listen")
      html += card("Notes Explored", fmtNum(t.notes_viewed), `Out of 7,759 total notes`)
      html += card("Notes Listened", fmtNum(t.notes_listened), "Unique articles heard")
      html += `</div>`

      // ── Daily trend chart ─────────────────────────────────
      if (data.daily_views?.length > 1) {
        html += `<div class="ok-stats-section">`
        html += `<h2>Daily Reads</h2>`
        html += `<p class="ok-stats-subtitle">Last 30 days</p>`
        html += barChart(data.daily_views)
        html += `</div>`
      }

      if (data.daily_listens?.length > 1) {
        html += `<div class="ok-stats-section">`
        html += `<h2>Daily Listens</h2>`
        html += `<p class="ok-stats-subtitle">Last 30 days</p>`
        html += barChart(data.daily_listens)
        html += `</div>`
      }

      // ── Most read ─────────────────────────────────────────
      if (data.top_read?.length > 0) {
        html += `<div class="ok-stats-section">`
        html += `<h2>Most Read</h2>`
        html += `<p class="ok-stats-subtitle">Top articles by page views</p>`
        html += leaderboard(data.top_read)
        html += `</div>`
      }

      // ── Most listened ─────────────────────────────────────
      if (data.top_listened?.length > 0) {
        html += `<div class="ok-stats-section">`
        html += `<h2>Most Listened</h2>`
        html += `<p class="ok-stats-subtitle">Top articles by audio plays</p>`
        html += leaderboard(data.top_listened)
        html += `</div>`
      }

      // ── Recent listens ────────────────────────────────────
      if (data.recent_listens?.length > 0) {
        html += `<div class="ok-stats-section">`
        html += `<h2>Recently Listened</h2>`
        html += `<p class="ok-stats-subtitle">Latest audio plays across the site</p>`
        html += recentList(data.recent_listens)
        html += `</div>`
      }

      container.innerHTML = html
    })
    .catch(() => {
      container.innerHTML = `<div class="ok-stats-empty">Stats are temporarily unavailable. Please try again later.</div>`
    })

  // ── Component builders ──────────────────────────────────────

  function card(label: string, value: string, subtitle: string): string {
    return `
      <div class="ok-stats-card">
        <div class="ok-stats-value">${value}</div>
        <div class="ok-stats-label">${label}</div>
        <div class="ok-stats-card-sub">${subtitle}</div>
      </div>`
  }

  function leaderboard(items: { slug: string; total: number; unique_users: number }[]): string {
    let html = `<div class="ok-stats-table"><table><thead><tr>
      <th class="ok-stats-rank">#</th>
      <th>Article</th>
      <th class="ok-stats-num">Views</th>
      <th class="ok-stats-num">Users</th>
    </tr></thead><tbody>`

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const title = slugToTitle(item.slug)
      html += `<tr>
        <td class="ok-stats-rank">${i + 1}</td>
        <td><a href="/${item.slug}">${title}</a></td>
        <td class="ok-stats-num">${fmtNum(item.total)}</td>
        <td class="ok-stats-num">${fmtNum(item.unique_users)}</td>
      </tr>`
    }

    html += `</tbody></table></div>`
    return html
  }

  function barChart(days: { date: string; count: number }[]): string {
    const max = Math.max(...days.map((d) => d.count), 1)
    const barCount = days.length

    let html = `<div class="ok-stats-chart">`
    html += `<div class="ok-stats-bars">`

    for (const day of days) {
      const pct = (day.count / max) * 100
      const label = fmtDate(day.date)
      // Show date labels on first, last, and every ~7th bar
      const showLabel = day === days[0] || day === days[days.length - 1] ||
        days.indexOf(day) % Math.max(Math.floor(barCount / 4), 1) === 0

      html += `<div class="ok-stats-bar-col" title="${label}: ${fmtNum(day.count)}">
        <div class="ok-stats-bar" style="height:${Math.max(pct, 2)}%"></div>
        <span class="ok-stats-bar-label">${showLabel ? label : ""}</span>
      </div>`
    }

    html += `</div></div>`
    return html
  }

  function recentList(items: { slug: string; created_at: string }[]): string {
    let html = `<div class="ok-stats-recent">`
    for (const item of items) {
      const title = slugToTitle(item.slug)
      const time = new Date(item.created_at + "Z")
      const ago = timeAgo(time)
      html += `<div class="ok-stats-recent-item">
        <a href="/${item.slug}">${title}</a>
        <span class="ok-stats-ago">${ago}</span>
      </div>`
    }
    html += `</div>`
    return html
  }

  function timeAgo(date: Date): string {
    const now = Date.now()
    const diff = now - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days === 1) return "yesterday"
    return `${days}d ago`
  }
})

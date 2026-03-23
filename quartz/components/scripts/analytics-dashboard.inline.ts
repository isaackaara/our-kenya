document.addEventListener("nav", () => {
  const container = document.getElementById("ok-analytics-dashboard")
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

  const fmtNum = (n: number): string =>
    n != null ? n.toLocaleString() : "0"

  const fmtDuration = (seconds: number): string => {
    if (seconds == null || seconds <= 0) return "0s"
    const m = Math.floor(seconds / 60)
    const s = Math.round(seconds % 60)
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  const fmtDate = (d: string): string => {
    const date = new Date(d + "T00:00:00Z")
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }

  const fmtPct = (n: number): string =>
    n != null ? n.toFixed(1) + "%" : "0%"

  const bounceColor = (rate: number): string => {
    if (rate < 40) return "#22c55e"
    if (rate <= 60) return "#eab308"
    return "#ef4444"
  }

  const LS_KEY = "ok-analytics-key"

  // ── Auth check ──────────────────────────────────────────────
  const storedKey = localStorage.getItem(LS_KEY)
  if (storedKey) {
    fetchAndRender(storedKey)
  } else {
    showAuthForm()
  }

  // ── Auth form ───────────────────────────────────────────────
  function showAuthForm(errorMsg?: string) {
    let html = `<div class="ok-analytics-auth">`
    if (errorMsg) {
      html += `<div class="ok-analytics-error">${errorMsg}</div>`
    }
    html += `
      <h2>Analytics Dashboard</h2>
      <p>Enter your analytics key to continue.</p>
      <form class="ok-analytics-form">
        <input type="password" class="ok-analytics-key-input"
               placeholder="Analytics key" autocomplete="off"
               aria-label="Analytics key" />
        <button type="submit" class="ok-analytics-submit">Unlock</button>
      </form>
    </div>`
    container.innerHTML = html

    const form = container.querySelector(".ok-analytics-form") as HTMLFormElement
    const input = container.querySelector(".ok-analytics-key-input") as HTMLInputElement
    input.focus()

    form.addEventListener("submit", (e) => {
      e.preventDefault()
      const key = input.value.trim()
      if (!key) return
      localStorage.setItem(LS_KEY, key)
      fetchAndRender(key)
    })
  }

  // ── Fetch data ──────────────────────────────────────────────
  function fetchAndRender(key: string) {
    container.innerHTML = `<div class="ok-analytics-loading">Loading analytics...</div>`

    fetch(`/api/analytics?key=${encodeURIComponent(key)}`)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem(LS_KEY)
          showAuthForm("Invalid key. Please try again.")
          throw new Error("auth")
        }
        if (!res.ok) throw new Error("Failed to load analytics")
        return res.json()
      })
      .then((data: any) => {
        renderDashboard(data)
      })
      .catch((err) => {
        if (err.message === "auth") return
        container.innerHTML = `<div class="ok-analytics-empty">Analytics are temporarily unavailable. Please try again later.</div>`
      })
  }

  // ── Render dashboard ────────────────────────────────────────
  function renderDashboard(data: any) {
    const eng = data.engagement || {}
    const content = data.content || {}
    const features = data.features || {}
    const totals = data.totals || {}

    let html = ""

    // ── Totals overview ─────────────────────────────────────
    html += `<div class="ok-analytics-section">`
    html += `<h2>Overview</h2>`
    html += `<div class="ok-analytics-cards">`
    html += metricCard("Total Pageviews", fmtNum(totals.total_pageviews))
    html += metricCard("Unique Readers", fmtNum(totals.unique_readers))
    html += metricCard("Total Listens", fmtNum(totals.total_listens))
    html += metricCard("Unique Listeners", fmtNum(totals.unique_listeners))
    html += `</div></div>`

    // ── Engagement KPIs ─────────────────────────────────────
    html += `<div class="ok-analytics-section">`
    html += `<h2>Engagement</h2>`
    html += `<div class="ok-analytics-cards">`
    html += metricCard("Pages / Session", eng.pages_per_session != null ? eng.pages_per_session.toFixed(1) : "-")
    html += metricCard("Avg Session", fmtDuration(eng.avg_session_duration_seconds))
    html += metricCard(
      "Bounce Rate",
      fmtPct(eng.bounce_rate),
      undefined,
      eng.bounce_rate != null ? bounceColor(eng.bounce_rate) : undefined,
    )
    html += metricCard(
      "Notes Discovered",
      `${fmtNum(eng.notes_discovered)} / 8,000`,
      eng.notes_discovered != null
        ? miniProgressBar((eng.notes_discovered / 8000) * 100)
        : undefined,
    )
    html += metricCard("Listen-Through Rate", fmtPct(eng.listen_through_rate))
    // Discovery rate: show today's count if available
    if (eng.discovery_rate && eng.discovery_rate.length > 0) {
      const latest = eng.discovery_rate[eng.discovery_rate.length - 1]
      html += metricCard("New Slugs Today", fmtNum(latest.new_slugs))
    }
    html += `</div>`

    // Discovery rate trend chart
    if (eng.discovery_rate && eng.discovery_rate.length > 1) {
      html += `<h3>Discovery Rate (Daily New Slugs)</h3>`
      html += barChart(
        eng.discovery_rate.map((d: any) => ({ date: d.date, count: d.new_slugs })),
      )
    }
    html += `</div>`

    // ── Content KPIs ────────────────────────────────────────
    html += `<div class="ok-analytics-section">`
    html += `<h2>Content</h2>`
    html += `<div class="ok-analytics-cards">`
    html += metricCard(
      "Cold Notes",
      fmtNum(content.cold_note_count),
      content.cold_note_count != null
        ? `${((content.cold_note_count / 8000) * 100).toFixed(0)}% of archive`
        : undefined,
    )
    html += `</div>`

    // Hot notes table
    if (content.hot_notes && content.hot_notes.length > 0) {
      html += `<h3>Hot Notes</h3>`
      html += `<div class="ok-analytics-table"><table>`
      html += `<thead><tr>
        <th class="ok-analytics-rank">#</th>
        <th>Article</th>
        <th class="ok-analytics-num">Views</th>
        <th class="ok-analytics-num">Unique</th>
      </tr></thead><tbody>`
      content.hot_notes.forEach((note: any, i: number) => {
        const title = slugToTitle(note.slug)
        html += `<tr>
          <td class="ok-analytics-rank">${i + 1}</td>
          <td><a href="/${note.slug}">${title}</a></td>
          <td class="ok-analytics-num">${fmtNum(note.views)}</td>
          <td class="ok-analytics-num">${fmtNum(note.unique_views)}</td>
        </tr>`
      })
      html += `</tbody></table></div>`
    }

    // Rising notes table
    if (content.rising_notes && content.rising_notes.length > 0) {
      html += `<h3>Rising Notes</h3>`
      html += `<div class="ok-analytics-table"><table>`
      html += `<thead><tr>
        <th>Article</th>
        <th class="ok-analytics-num">This Week</th>
        <th class="ok-analytics-num">Last Week</th>
        <th class="ok-analytics-num">Delta</th>
      </tr></thead><tbody>`
      content.rising_notes.forEach((note: any) => {
        const title = slugToTitle(note.slug)
        const delta = note.delta > 0 ? `+${fmtNum(note.delta)}` : fmtNum(note.delta)
        html += `<tr>
          <td><a href="/${note.slug}">${title}</a></td>
          <td class="ok-analytics-num">${fmtNum(note.this_week_views)}</td>
          <td class="ok-analytics-num">${fmtNum(note.last_week_views)}</td>
          <td class="ok-analytics-num ok-analytics-delta-up">${delta}</td>
        </tr>`
      })
      html += `</tbody></table></div>`
    }
    html += `</div>`

    // ── Feature KPIs ────────────────────────────────────────
    html += `<div class="ok-analytics-section">`
    html += `<h2>Features</h2>`

    // Event counts bar list
    if (features.event_counts && features.event_counts.length > 0) {
      html += `<h3>Event Counts</h3>`
      const maxCount = Math.max(...features.event_counts.map((e: any) => e.count), 1)
      html += `<div class="ok-analytics-event-list">`
      features.event_counts.forEach((evt: any) => {
        const pct = (evt.count / maxCount) * 100
        const label = evt.event_type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
        html += `<div class="ok-analytics-event-row">
          <span class="ok-analytics-event-label">${label}</span>
          <div class="ok-analytics-event-bar-track">
            <div class="ok-analytics-event-bar-fill" style="width: ${pct}%"></div>
          </div>
          <span class="ok-analytics-event-count">${fmtNum(evt.count)}</span>
        </div>`
      })
      html += `</div>`
    }

    // Trail completions table
    if (features.trail_completions && features.trail_completions.length > 0) {
      html += `<h3>Trail Completions</h3>`
      html += `<div class="ok-analytics-table"><table>`
      html += `<thead><tr>
        <th>Trail</th>
        <th class="ok-analytics-num">Event</th>
        <th class="ok-analytics-num">Count</th>
      </tr></thead><tbody>`
      features.trail_completions.forEach((tc: any) => {
        const trailName = slugToTitle(tc.trail_id || "")
        const eventLabel = (tc.event_type || "").replace(/_/g, " ")
        html += `<tr>
          <td>${trailName}</td>
          <td class="ok-analytics-num">${eventLabel}</td>
          <td class="ok-analytics-num">${fmtNum(tc.count)}</td>
        </tr>`
      })
      html += `</tbody></table></div>`
    }

    // Daily feature events chart
    if (features.daily_events && features.daily_events.length > 0) {
      html += `<h3>Daily Feature Events</h3>`
      // Group by date, sum counts
      const byDate = new Map<string, number>()
      features.daily_events.forEach((de: any) => {
        byDate.set(de.date, (byDate.get(de.date) || 0) + de.count)
      })
      const dailyData = Array.from(byDate.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }))

      if (dailyData.length > 1) {
        html += barChart(dailyData)
      }
    }
    html += `</div>`

    // ── Logout button ───────────────────────────────────────
    html += `<div class="ok-analytics-footer">
      <button class="ok-analytics-logout" aria-label="Lock dashboard">Lock Dashboard</button>
    </div>`

    container.innerHTML = html

    // Bind logout
    const logoutBtn = container.querySelector(".ok-analytics-logout")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(LS_KEY)
        showAuthForm()
      })
    }
  }

  // ── Component builders ──────────────────────────────────────

  function metricCard(label: string, value: string, extra?: string, valueColor?: string): string {
    const colorStyle = valueColor ? ` style="color:${valueColor}"` : ""
    return `
      <div class="ok-analytics-card">
        <div class="ok-analytics-card-value"${colorStyle}>${value}</div>
        <div class="ok-analytics-card-label">${label}</div>
        ${extra ? `<div class="ok-analytics-card-extra">${extra}</div>` : ""}
      </div>`
  }

  function miniProgressBar(pct: number): string {
    return `<div class="ok-analytics-mini-bar">
      <div class="ok-analytics-mini-fill" style="width:${Math.min(pct, 100).toFixed(1)}%"></div>
    </div>`
  }

  function barChart(days: { date: string; count: number }[]): string {
    const max = Math.max(...days.map((d) => d.count), 1)
    const barCount = days.length

    let html = `<div class="ok-analytics-chart"><div class="ok-analytics-bars">`

    for (let i = 0; i < days.length; i++) {
      const day = days[i]
      const pct = (day.count / max) * 100
      const label = fmtDate(day.date)
      const showLabel =
        i === 0 ||
        i === days.length - 1 ||
        i % Math.max(Math.floor(barCount / 4), 1) === 0

      html += `<div class="ok-analytics-bar-col" title="${label}: ${fmtNum(day.count)}">
        <div class="ok-analytics-bar" style="height:${Math.max(pct, 2)}%"></div>
        <span class="ok-analytics-bar-label">${showLabel ? label : ""}</span>
      </div>`
    }

    html += `</div></div>`
    return html
  }
})

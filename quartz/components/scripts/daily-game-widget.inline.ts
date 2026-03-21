(function () {
  var STORAGE_KEY = "ok-games"
  var CSS_ID = "ok-daily-game-widget-style"

  function getState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
    } catch {
      return {}
    }
  }

  function todayKey() {
    var d = new Date()
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    )
  }

  function injectStyles() {
    if (document.getElementById(CSS_ID)) return
    var style = document.createElement("style")
    style.id = CSS_ID
    style.textContent = [
      "#ok-daily-game-widget {",
      "  border: 1px solid var(--lightgray);",
      "  border-radius: 8px;",
      "  background: var(--light);",
      "  padding: 0.8rem 1rem;",
      "  margin: 1rem 0;",
      "  max-width: 100%;",
      "}",
      "#ok-daily-game-widget a {",
      "  text-decoration: none;",
      "  color: inherit;",
      "  display: block;",
      "}",
      ".ok-dgw-label {",
      "  font-size: 0.72rem;",
      "  font-weight: 600;",
      "  color: var(--gray);",
      "  text-transform: uppercase;",
      "  letter-spacing: 0.08em;",
      "  margin-bottom: 0.4rem;",
      "}",
      ".ok-dgw-row {",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: space-between;",
      "  gap: 0.5rem;",
      "}",
      ".ok-dgw-games {",
      "  display: flex;",
      "  gap: 0.6rem;",
      "  font-size: 0.85rem;",
      "}",
      ".ok-dgw-game {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 0.3rem;",
      "}",
      ".ok-dgw-done {",
      "  color: var(--secondary);",
      "  font-weight: 600;",
      "}",
      ".ok-dgw-pending {",
      "  color: var(--gray);",
      "}",
      ".ok-dgw-streak {",
      "  font-size: 0.82rem;",
      "  font-weight: 700;",
      "  color: var(--secondary);",
      "}",
    ].join("\n")
    document.head.appendChild(style)
  }

  function render() {
    var wrap = document.getElementById("ok-daily-game-widget")
    if (!wrap) return
    wrap.innerHTML = ""

    injectStyles()

    var state = getState()
    var today = todayKey()

    var triviaState = state.trivia || {}
    var timelineState = state.timeline || {}
    var triviaToday = triviaState.today && triviaState.today.date === today
    var timelineToday = timelineState.today && timelineState.today.date === today
    var maxStreak = Math.max(triviaState.streak || 0, timelineState.streak || 0)

    var link = document.createElement("a")
    link.href = "/games"

    var label = document.createElement("div")
    label.className = "ok-dgw-label"
    label.textContent = "Today's Challenge"

    var row = document.createElement("div")
    row.className = "ok-dgw-row"

    var games = document.createElement("div")
    games.className = "ok-dgw-games"

    var triviaEl = document.createElement("span")
    triviaEl.className = "ok-dgw-game " + (triviaToday ? "ok-dgw-done" : "ok-dgw-pending")
    triviaEl.textContent = (triviaToday ? "\u2713 " : "\u25CB ") + "Trivia"
    if (triviaToday && triviaState.today.score !== undefined) {
      triviaEl.textContent += " " + triviaState.today.score + "/5"
    }

    var timelineEl = document.createElement("span")
    timelineEl.className = "ok-dgw-game " + (timelineToday ? "ok-dgw-done" : "ok-dgw-pending")
    timelineEl.textContent = (timelineToday ? "\u2713 " : "\u25CB ") + "Timeline"
    if (timelineToday && timelineState.today.score !== undefined) {
      timelineEl.textContent += " " + timelineState.today.score + "/5"
    }

    games.appendChild(triviaEl)
    games.appendChild(timelineEl)
    row.appendChild(games)

    if (maxStreak > 0) {
      var streak = document.createElement("span")
      streak.className = "ok-dgw-streak"
      streak.textContent = maxStreak + " day streak"
      row.appendChild(streak)
    }

    link.appendChild(label)
    link.appendChild(row)
    wrap.appendChild(link)
  }

  function init() {
    if (!document.getElementById("ok-daily-game-widget")) return
    render()
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
  document.addEventListener("nav", init)
})()

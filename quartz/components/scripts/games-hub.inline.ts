(function () {
  var STORAGE_KEY = "ok-games"

  function getState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
    } catch {
      return {}
    }
  }

  function todayKey() {
    var d = new Date()
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0")
  }

  function render() {
    var hub = document.getElementById("ok-games-hub")
    if (!hub) return
    hub.innerHTML = ""

    var state = getState()
    var today = todayKey()

    // Streak calculation
    var triviaState = state.trivia || {}
    var timelineState = state.timeline || {}
    var triviaStreak = triviaState.streak || 0
    var timelineStreak = timelineState.streak || 0
    var maxStreak = Math.max(triviaStreak, timelineStreak)

    // Header
    var header = document.createElement("div")
    header.className = "ok-games-header"

    if (maxStreak > 0) {
      var streakEl = document.createElement("div")
      streakEl.className = "ok-games-streak"
      streakEl.innerHTML = '<span class="ok-games-streak-fire">' + maxStreak + '</span><span class="ok-games-streak-label">day streak</span>'
      header.appendChild(streakEl)
    }

    var discoveredCount = (state.notesDiscovered || []).length
    if (discoveredCount > 0) {
      var disc = document.createElement("div")
      disc.className = "ok-games-discovered"
      disc.textContent = discoveredCount + " notes discovered through games"
      header.appendChild(disc)
    }

    hub.appendChild(header)

    // Game cards
    var games = [
      {
        id: "trivia",
        title: "Kenya Today",
        desc: "5 daily trivia questions about Kenya's history",
        url: "/games/daily-trivia",
        state: triviaState,
      },
      {
        id: "timeline",
        title: "Timeline",
        desc: "Put 5 events in chronological order",
        url: "/games/timeline",
        state: timelineState,
      },
    ]

    var grid = document.createElement("div")
    grid.className = "ok-games-grid"

    for (var i = 0; i < games.length; i++) {
      var game = games[i]
      var card = document.createElement("a")
      card.href = game.url
      card.className = "ok-games-card"

      var title = document.createElement("div")
      title.className = "ok-games-card-title"
      title.textContent = game.title

      var desc = document.createElement("div")
      desc.className = "ok-games-card-desc"
      desc.textContent = game.desc

      var status = document.createElement("div")
      status.className = "ok-games-card-status"

      var gs = game.state
      var todayData = gs.today && gs.today.date === today ? gs.today : null

      if (todayData) {
        status.textContent = "Completed"
        if (todayData.score !== undefined) {
          status.textContent += " · " + todayData.score + "/5"
        }
        status.classList.add("ok-games-card-done")
      } else {
        status.textContent = "Play today's challenge"
        status.classList.add("ok-games-card-ready")
      }

      var streak = document.createElement("div")
      streak.className = "ok-games-card-streak"
      if ((gs.streak || 0) > 0) {
        streak.textContent = gs.streak + " day streak"
      }

      card.appendChild(title)
      card.appendChild(desc)
      card.appendChild(status)
      card.appendChild(streak)
      grid.appendChild(card)
    }

    hub.appendChild(grid)

    // Coming soon teaser
    var teaser = document.createElement("div")
    teaser.className = "ok-games-teaser"
    teaser.textContent = "More games coming soon: Connections, Who Am I?, and more."
    hub.appendChild(teaser)
  }

  function init() {
    if (!document.getElementById("ok-games-hub")) return
    render()
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
  document.addEventListener("nav", init)
})()

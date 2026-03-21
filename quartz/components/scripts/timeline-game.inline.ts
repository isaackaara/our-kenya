(function () {
  var STORAGE_KEY = "ok-games"
  var cachedData: any = null

  function getState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
    } catch {
      return {}
    }
  }

  function saveState(state: any) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
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

  function dayOfYear() {
    var now = new Date()
    var start = new Date(now.getFullYear(), 0, 0)
    var diff = now.getTime() - start.getTime()
    return Math.floor(diff / 86400000) - 1
  }

  function dayNumber() {
    var start = new Date(2026, 0, 1)
    var now = new Date()
    now.setHours(0, 0, 0, 0)
    return Math.floor((now.getTime() - start.getTime()) / 86400000) + 1
  }

  // Seeded shuffle for consistent daily ordering
  function seededShuffle(arr: any[], seed: number) {
    var a = arr.slice()
    var s = seed
    for (var i = a.length - 1; i > 0; i--) {
      s = ((s * 1664525 + 1013904223) & 0x7fffffff)
      var j = s % (i + 1)
      var tmp = a[i]
      a[i] = a[j]
      a[j] = tmp
    }
    return a
  }

  function render(data: any) {
    var wrap = document.getElementById("ok-timeline-game")
    if (!wrap) return
    wrap.innerHTML = ""

    var today = todayKey()
    var state = getState()
    if (!state.timeline) state.timeline = {}
    var tState = state.timeline

    // Check if completed today
    var todayData = tState.today && tState.today.date === today ? tState.today : null

    // Mode tabs
    var tabs = document.createElement("div")
    tabs.className = "ok-timeline-tabs"

    var dailyTab = document.createElement("button")
    dailyTab.className = "ok-timeline-tab ok-timeline-tab-active"
    dailyTab.textContent = "Daily"
    dailyTab.setAttribute("aria-label", "Daily challenge")

    var freeTab = document.createElement("button")
    freeTab.className = "ok-timeline-tab"
    freeTab.textContent = "Free Play"
    freeTab.setAttribute("aria-label", "Free play mode")

    tabs.appendChild(dailyTab)
    tabs.appendChild(freeTab)
    wrap.appendChild(tabs)

    var gameArea = document.createElement("div")
    gameArea.className = "ok-timeline-area"
    wrap.appendChild(gameArea)

    var mode = "daily"

    dailyTab.addEventListener("click", function () {
      mode = "daily"
      dailyTab.classList.add("ok-timeline-tab-active")
      freeTab.classList.remove("ok-timeline-tab-active")
      renderGame(gameArea, data, mode, state)
    })

    freeTab.addEventListener("click", function () {
      mode = "free"
      freeTab.classList.add("ok-timeline-tab-active")
      dailyTab.classList.remove("ok-timeline-tab-active")
      renderGame(gameArea, data, mode, state)
    })

    renderGame(gameArea, data, mode, state)
  }

  function renderGame(area: HTMLElement, data: any, mode: string, state: any) {
    area.innerHTML = ""
    var today = todayKey()
    var tState = state.timeline || {}

    if (mode === "daily") {
      var todayData = tState.today && tState.today.date === today ? tState.today : null

      if (todayData) {
        renderDailyResult(area, data, todayData, tState)
        return
      }

      var doy = dayOfYear()
      var dayIdx = ((doy % data.daily.length) + data.daily.length) % data.daily.length
      var events = data.daily[dayIdx]

      // Day label
      var dayLabel = document.createElement("div")
      dayLabel.className = "ok-timeline-day"
      dayLabel.textContent = "Timeline \u{1F1F0}\u{1F1EA} Day " + dayNumber()
      area.appendChild(dayLabel)

      renderSortUI(area, events, function (order: any[]) {
        finishDaily(order, events, data, area)
      })
    } else {
      // Free play - random set
      var fpIdx = Math.floor(Math.random() * data.freeplay.length)
      var events = data.freeplay[fpIdx]

      var label = document.createElement("div")
      label.className = "ok-timeline-day"
      label.textContent = "Free Play"
      area.appendChild(label)

      renderSortUI(area, events, function (order: any[]) {
        renderFreeResult(area, order, events)
      })
    }
  }

  function renderSortUI(area: HTMLElement, events: any[], onSubmit: (order: any[]) => void) {
    var instruction = document.createElement("div")
    instruction.className = "ok-timeline-instruction"
    instruction.textContent = "Tap to select, then tap where to place. Arrange from earliest to latest."
    area.appendChild(instruction)

    // Shuffled order for the player
    var seed = dayOfYear() * 3137 + events.length
    var shuffled = seededShuffle(events, seed)
    var order = shuffled.slice()
    var selectedIdx: number | null = null

    var list = document.createElement("div")
    list.className = "ok-timeline-list"
    area.appendChild(list)

    function renderList() {
      list.innerHTML = ""
      for (var i = 0; i < order.length; i++) {
        ;(function (idx) {
          var item = document.createElement("div")
          item.className = "ok-timeline-item"
          if (idx === selectedIdx) {
            item.classList.add("ok-timeline-item-selected")
          }
          item.setAttribute("role", "button")
          item.setAttribute("tabindex", "0")
          item.setAttribute("aria-label", "Event: " + order[idx].title)

          var num = document.createElement("span")
          num.className = "ok-timeline-num"
          num.textContent = String(idx + 1)

          var title = document.createElement("span")
          title.className = "ok-timeline-title"
          title.textContent = order[idx].title

          item.appendChild(num)
          item.appendChild(title)

          item.addEventListener("click", function () {
            if (selectedIdx === null) {
              selectedIdx = idx
            } else if (selectedIdx === idx) {
              selectedIdx = null
            } else {
              // Move selected to this position
              var moved = order.splice(selectedIdx as number, 1)[0]
              order.splice(idx, 0, moved)
              selectedIdx = null
            }
            renderList()
          })

          item.addEventListener("keydown", function (e: KeyboardEvent) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              item.click()
            }
          })

          list.appendChild(item)
        })(i)
      }
    }

    renderList()

    var submitBtn = document.createElement("button")
    submitBtn.className = "ok-timeline-submit"
    submitBtn.textContent = "Check Order"
    submitBtn.setAttribute("aria-label", "Submit your answer")
    submitBtn.addEventListener("click", function () {
      onSubmit(order)
    })
    area.appendChild(submitBtn)
  }

  function finishDaily(order: any[], correctEvents: any[], data: any, area: HTMLElement) {
    var today = todayKey()
    var state = getState()
    if (!state.timeline) state.timeline = {}

    // Score: count correctly positioned events
    var sorted = correctEvents.slice().sort(function (a: any, b: any) {
      return a.year - b.year
    })
    var score = 0
    for (var i = 0; i < order.length; i++) {
      if (order[i].slug === sorted[i].slug) score++
    }

    state.timeline.today = { date: today, score: score }
    state.timeline.totalPlayed = (state.timeline.totalPlayed || 0) + 1

    // Update streak
    var yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    var yKey =
      yesterday.getFullYear() +
      "-" +
      String(yesterday.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(yesterday.getDate()).padStart(2, "0")

    if (state.timeline.lastPlayDate === yKey) {
      state.timeline.streak = (state.timeline.streak || 0) + 1
    } else if (state.timeline.lastPlayDate !== today) {
      state.timeline.streak = 1
    }
    state.timeline.lastPlayDate = today
    state.timeline.bestStreak = Math.max(state.timeline.bestStreak || 0, state.timeline.streak)

    // Track in history
    if (!state.history) state.history = {}
    if (!state.history[today]) state.history[today] = []
    if (state.history[today].indexOf("timeline") === -1) {
      state.history[today].push("timeline")
    }

    // Track discovered notes
    for (var n = 0; n < order.length; n++) {
      if (!state.notesDiscovered) state.notesDiscovered = []
      if (state.notesDiscovered.indexOf(order[n].slug) === -1) {
        state.notesDiscovered.push(order[n].slug)
      }
    }

    saveState(state)
    renderDailyResult(area, data, state.timeline.today, state.timeline)
  }

  function renderDailyResult(area: HTMLElement, data: any, todayData: any, tState: any) {
    area.innerHTML = ""

    var doy = dayOfYear()
    var dayIdx = ((doy % data.daily.length) + data.daily.length) % data.daily.length
    var events = data.daily[dayIdx]
    var sorted = events.slice().sort(function (a: any, b: any) {
      return a.year - b.year
    })
    var score = todayData.score

    // Day label
    var dayLabel = document.createElement("div")
    dayLabel.className = "ok-timeline-day"
    dayLabel.textContent = "Timeline \u{1F1F0}\u{1F1EA} Day " + dayNumber()
    area.appendChild(dayLabel)

    // Score
    var scoreEl = document.createElement("div")
    scoreEl.className = "ok-timeline-score"
    scoreEl.textContent = score + " / " + sorted.length + " correct"
    area.appendChild(scoreEl)

    // Correct order
    var list = document.createElement("div")
    list.className = "ok-timeline-results"

    for (var i = 0; i < sorted.length; i++) {
      var item = document.createElement("div")
      item.className = "ok-timeline-result-item"

      var year = document.createElement("span")
      year.className = "ok-timeline-result-year"
      year.textContent = String(sorted[i].year)

      var title = document.createElement("a")
      title.className = "ok-timeline-result-title"
      title.href = "/" + sorted[i].slug
      title.textContent = sorted[i].title

      item.appendChild(year)
      item.appendChild(title)
      list.appendChild(item)
    }
    area.appendChild(list)

    // Streak info
    if ((tState.streak || 0) > 0) {
      var streakEl = document.createElement("div")
      streakEl.className = "ok-timeline-streak"
      streakEl.textContent = tState.streak + " day streak"
      area.appendChild(streakEl)
    }

    // Share button
    var shareBtn = document.createElement("button")
    shareBtn.className = "ok-timeline-share"
    shareBtn.textContent = "Share results"
    shareBtn.setAttribute("aria-label", "Copy results to clipboard")
    shareBtn.addEventListener("click", function () {
      var emojis = ""
      for (var e = 0; e < sorted.length; e++) {
        emojis += e < score ? "\u{1F7E9}" : "\u{1F7E5}"
      }
      var text =
        "Timeline \u{1F1F0}\u{1F1EA} Day " +
        dayNumber() +
        "\n" +
        emojis +
        "\n" +
        score +
        "/" +
        sorted.length
      if ((tState.streak || 0) > 1) {
        text += " \u00B7 Streak: " + tState.streak
      }
      text += "\nourkenya.com/games"

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          shareBtn.textContent = "Copied!"
          setTimeout(function () {
            shareBtn.textContent = "Share results"
          }, 2000)
        })
      }
    })
    area.appendChild(shareBtn)
  }

  function renderFreeResult(area: HTMLElement, order: any[], events: any[]) {
    area.innerHTML = ""

    var sorted = events.slice().sort(function (a: any, b: any) {
      return a.year - b.year
    })
    var score = 0
    for (var i = 0; i < order.length; i++) {
      if (order[i].slug === sorted[i].slug) score++
    }

    var scoreEl = document.createElement("div")
    scoreEl.className = "ok-timeline-score"
    scoreEl.textContent = score + " / " + sorted.length + " correct"
    area.appendChild(scoreEl)

    var list = document.createElement("div")
    list.className = "ok-timeline-results"

    for (var i = 0; i < sorted.length; i++) {
      var item = document.createElement("div")
      item.className = "ok-timeline-result-item"

      var year = document.createElement("span")
      year.className = "ok-timeline-result-year"
      year.textContent = String(sorted[i].year)

      var title = document.createElement("a")
      title.className = "ok-timeline-result-title"
      title.href = "/" + sorted[i].slug
      title.textContent = sorted[i].title

      item.appendChild(year)
      item.appendChild(title)
      list.appendChild(item)
    }
    area.appendChild(list)

    // Play again button
    var again = document.createElement("button")
    again.className = "ok-timeline-submit"
    again.textContent = "Play Again"
    again.addEventListener("click", function () {
      if (cachedData) render(cachedData)
    })
    area.appendChild(again)
  }

  function init() {
    var wrap = document.getElementById("ok-timeline-game")
    if (!wrap) return

    if (cachedData) {
      render(cachedData)
      return
    }

    wrap.innerHTML = '<div class="ok-games-loading">Loading timeline...</div>'

    fetch("/static/games/timeline.json")
      .then(function (r) {
        return r.json()
      })
      .then(function (data) {
        cachedData = data
        render(data)
      })
      .catch(function (err) {
        console.warn("TimelineGame: failed to load", err)
        wrap.innerHTML = '<div class="ok-games-loading">Could not load timeline. Try refreshing.</div>'
      })
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
  document.addEventListener("nav", init)
})()

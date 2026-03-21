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
    // Days since 2026-01-01
    var start = new Date(2026, 0, 1)
    var now = new Date()
    now.setHours(0, 0, 0, 0)
    return Math.floor((now.getTime() - start.getTime()) / 86400000) + 1
  }

  function addNoteDiscovered(slug: string) {
    var state = getState()
    if (!state.notesDiscovered) state.notesDiscovered = []
    if (state.notesDiscovered.indexOf(slug) === -1) {
      state.notesDiscovered.push(slug)
    }
    saveState(state)
  }

  function render(data: any) {
    var wrap = document.getElementById("ok-daily-trivia")
    if (!wrap) return
    wrap.innerHTML = ""

    var today = todayKey()
    var doy = dayOfYear()
    var dayIdx = ((doy % data.length) + data.length) % data.length
    var questions = data[dayIdx]

    if (!questions || questions.length === 0) {
      wrap.textContent = "No trivia available today. Check back tomorrow!"
      return
    }

    var state = getState()
    if (!state.trivia) state.trivia = {}
    var triviaState = state.trivia

    // Check if already played today
    var todayData = triviaState.today && triviaState.today.date === today ? triviaState.today : null
    var answers: number[] = todayData ? todayData.answers : []
    var currentQ = answers.length
    var revealed = todayData !== null

    // Day number display
    var dayLabel = document.createElement("div")
    dayLabel.className = "ok-trivia-day"
    dayLabel.textContent = "Kenya Today \u{1F1F0}\u{1F1EA} Day " + dayNumber()
    wrap.appendChild(dayLabel)

    // Streak display
    if ((triviaState.streak || 0) > 0) {
      var streakEl = document.createElement("div")
      streakEl.className = "ok-trivia-streak"
      streakEl.textContent = triviaState.streak + " day streak"
      wrap.appendChild(streakEl)
    }

    // Progress dots
    var dots = document.createElement("div")
    dots.className = "ok-trivia-progress"
    for (var d = 0; d < questions.length; d++) {
      var dot = document.createElement("span")
      dot.className = "ok-trivia-dot"
      if (d < answers.length) {
        dot.classList.add(answers[d] === questions[d].answer ? "ok-trivia-dot-correct" : "ok-trivia-dot-wrong")
      } else if (d === currentQ && !revealed) {
        dot.classList.add("ok-trivia-dot-current")
      }
      dots.appendChild(dot)
    }
    wrap.appendChild(dots)

    if (revealed) {
      // Show results
      renderResults(wrap, questions, answers, triviaState)
      return
    }

    // Show current question
    var q = questions[currentQ]
    var qEl = document.createElement("div")
    qEl.className = "ok-trivia-question"
    qEl.textContent = (currentQ + 1) + ". " + q.q
    wrap.appendChild(qEl)

    var optionsEl = document.createElement("div")
    optionsEl.className = "ok-trivia-options"

    for (var oi = 0; oi < q.options.length; oi++) {
      ;(function (idx) {
        var btn = document.createElement("button")
        btn.className = "ok-trivia-option"
        btn.textContent = q.options[idx]
        btn.setAttribute("aria-label", "Answer: " + q.options[idx])
        btn.addEventListener("click", function () {
          handleAnswer(idx, q, wrap, data)
        })
        optionsEl.appendChild(btn)
      })(oi)
    }

    wrap.appendChild(optionsEl)
  }

  function handleAnswer(chosen: number, q: any, wrap: HTMLElement, data: any) {
    var today = todayKey()
    var state = getState()
    if (!state.trivia) state.trivia = {}

    var todayData = state.trivia.today && state.trivia.today.date === today ? state.trivia.today : null
    var answers: number[] = todayData ? todayData.answers.slice() : []
    answers.push(chosen)

    // Track note discovery
    addNoteDiscovered(q.slug)

    // Show brief feedback
    var doy = dayOfYear()
    var dayIdx = ((doy % data.length) + data.length) % data.length
    var questions = data[dayIdx]

    state.trivia.today = { date: today, answers: answers }

    // If all answered, finalize
    if (answers.length >= questions.length) {
      var score = 0
      for (var i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].answer) score++
      }
      state.trivia.today.score = score
      state.trivia.totalPlayed = (state.trivia.totalPlayed || 0) + 1

      // Update streak
      var yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      var yKey =
        yesterday.getFullYear() +
        "-" +
        String(yesterday.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(yesterday.getDate()).padStart(2, "0")

      if (state.trivia.lastPlayDate === yKey) {
        state.trivia.streak = (state.trivia.streak || 0) + 1
      } else if (state.trivia.lastPlayDate !== today) {
        state.trivia.streak = 1
      }
      state.trivia.lastPlayDate = today
      state.trivia.bestStreak = Math.max(state.trivia.bestStreak || 0, state.trivia.streak)

      // Track in history
      if (!state.history) state.history = {}
      if (!state.history[today]) state.history[today] = []
      if (state.history[today].indexOf("trivia") === -1) {
        state.history[today].push("trivia")
      }
    }

    saveState(state)
    render(data)
  }

  function renderResults(wrap: HTMLElement, questions: any[], answers: number[], triviaState: any) {
    var score = 0
    for (var i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].answer) score++
    }

    // Score display
    var scoreEl = document.createElement("div")
    scoreEl.className = "ok-trivia-score"
    scoreEl.textContent = score + " / " + questions.length
    wrap.appendChild(scoreEl)

    // Emoji grid
    var emojis = ""
    for (var e = 0; e < questions.length; e++) {
      if (answers[e] === questions[e].answer) {
        emojis += "\u{1F7E9}" // green
      } else {
        emojis += "\u{1F7E5}" // red
      }
    }

    var emojiEl = document.createElement("div")
    emojiEl.className = "ok-trivia-emojis"
    emojiEl.textContent = emojis
    wrap.appendChild(emojiEl)

    // Review answers
    var review = document.createElement("div")
    review.className = "ok-trivia-review"

    for (var r = 0; r < questions.length; r++) {
      var q = questions[r]
      var item = document.createElement("div")
      item.className = "ok-trivia-review-item"

      var correct = answers[r] === q.answer

      var marker = document.createElement("span")
      marker.className = correct ? "ok-trivia-review-correct" : "ok-trivia-review-wrong"
      marker.textContent = correct ? "\u2713" : "\u2717"

      var text = document.createElement("span")
      text.className = "ok-trivia-review-text"
      text.textContent = q.title

      var link = document.createElement("a")
      link.href = "/" + q.slug
      link.className = "ok-trivia-review-link"
      link.textContent = "Read more \u2192"

      item.appendChild(marker)
      item.appendChild(text)
      item.appendChild(link)
      review.appendChild(item)
    }

    wrap.appendChild(review)

    // Share button
    var shareBtn = document.createElement("button")
    shareBtn.className = "ok-trivia-share"
    shareBtn.textContent = "Share results"
    shareBtn.setAttribute("aria-label", "Copy results to clipboard")
    shareBtn.addEventListener("click", function () {
      var shareText =
        "Kenya Today \u{1F1F0}\u{1F1EA} Day " +
        dayNumber() +
        "\n" +
        emojis +
        "\n" +
        score +
        "/" +
        questions.length
      if ((triviaState.streak || 0) > 1) {
        shareText += " \u00B7 Streak: " + triviaState.streak
      }
      shareText += "\nourkenya.com/games"

      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(function () {
          shareBtn.textContent = "Copied!"
          setTimeout(function () {
            shareBtn.textContent = "Share results"
          }, 2000)
        })
      }
    })
    wrap.appendChild(shareBtn)
  }

  function init() {
    var wrap = document.getElementById("ok-daily-trivia")
    if (!wrap) return

    if (cachedData) {
      render(cachedData)
      return
    }

    wrap.innerHTML = '<div class="ok-games-loading">Loading today\'s trivia...</div>'

    fetch("/static/games/daily-trivia.json")
      .then(function (r) {
        return r.json()
      })
      .then(function (data) {
        cachedData = data
        render(data)
      })
      .catch(function (err) {
        console.warn("DailyTrivia: failed to load", err)
        wrap.innerHTML = '<div class="ok-games-loading">Could not load trivia. Try refreshing.</div>'
      })
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
  document.addEventListener("nav", init)
})()

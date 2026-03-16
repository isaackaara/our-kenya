(function() {
  var FILTER_CSS_ID = "ok-mood-filter-style";
  var cachedScores = null;

  var FILTERS = [
    { id: "all",         label: "All",          emoji: "",   test: function(s) { return true; } },
    { id: "intense",     label: "Intense",      emoji: "🔥", test: function(s) { return s && s.e >= 8; } },
    { id: "surprising",  label: "Surprising",   emoji: "✨", test: function(s) { return s && s.w >= 7; } },
    { id: "balanced",    label: "Balanced",     emoji: "⚖️", test: function(s) { return !s || (s.e >= 5 && s.e <= 7 && s.w >= 5 && s.w <= 7); } },
    { id: "informative", label: "Informative",  emoji: "📖", test: function(s) { return s && s.e <= 4; } }
  ];

  function injectStyles() {
    if (document.getElementById(FILTER_CSS_ID)) return;
    var style = document.createElement("style");
    style.id = FILTER_CSS_ID;
    style.textContent = [
      ".ok-mood-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.25rem; }",
      ".ok-mood-pill {",
      "  padding: 0.4rem 0.9rem; font-size: 0.8rem; font-weight: 500;",
      "  background: var(--light); color: var(--darkgray);",
      "  border: 1px solid var(--lightgray); border-radius: 20px;",
      "  cursor: pointer; white-space: nowrap; min-height: 32px;",
      "  transition: all 0.15s; font-family: inherit;",
      "  display: inline-flex; align-items: center; gap: 4px;",
      "}",
      ".ok-mood-pill:hover { border-color: var(--secondary); color: var(--secondary); }",
      ".ok-mood-pill.active {",
      "  background: #1b3d2f; color: #f5f0e8; border-color: #1b3d2f;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function getTrailKey(card) {
    var href = card.getAttribute("href") || "";
    return href.replace(/^\//, "");
  }

  function applyFilter(filterId, scores) {
    var filter = FILTERS.find(function(f) { return f.id === filterId; });
    if (!filter) filter = FILTERS[0];

    var cards = document.querySelectorAll(".trail-card");
    cards.forEach(function(card) {
      var key = getTrailKey(card);
      var score = scores ? (scores[key] || null) : null;
      var passes = filter.test(score);
      card.style.display = passes ? "" : "none";
    });

    var countEl = document.getElementById("trail-count");
    if (countEl) {
      var visible = document.querySelectorAll('.trail-card:not([style*="display: none"])').length;
      var total = document.querySelectorAll(".trail-card").length;
      countEl.textContent = "Showing " + visible + " of " + total + " trails";
    }
  }

  function injectFilterBar(scores) {
    if (document.querySelector(".ok-mood-filters")) return;

    var grid = document.getElementById("trail-grid");
    if (!grid) return;

    var bar = document.createElement("div");
    bar.className = "ok-mood-filters";

    FILTERS.forEach(function(f) {
      var pill = document.createElement("button");
      pill.className = "ok-mood-pill" + (f.id === "all" ? " active" : "");
      pill.dataset.filter = f.id;
      pill.textContent = (f.emoji ? f.emoji + " " : "") + f.label;
      bar.appendChild(pill);
    });

    var parent = grid.parentNode;
    parent.insertBefore(bar, grid);

    bar.addEventListener("click", function(e) {
      var pill = e.target.closest(".ok-mood-pill");
      if (!pill) return;
      bar.querySelectorAll(".ok-mood-pill").forEach(function(p) { p.classList.remove("active"); });
      pill.classList.add("active");
      applyFilter(pill.dataset.filter, scores);
    });
  }

  function init() {
    var slug = window.location.pathname.replace(/^\//, "").replace(/\/$/, "");
    if (slug !== "STORY-TRAILS") return;

    var grid = document.getElementById("trail-grid");
    if (!grid) return;

    injectStyles();

    if (cachedScores) {
      injectFilterBar(cachedScores);
      return;
    }

    fetch("/static/trail-scores.json")
      .then(function(r) { return r.json(); })
      .then(function(data) {
        cachedScores = data;
        injectFilterBar(data);
      })
      .catch(function(err) {
        console.warn("TrailMoodFilter: failed to load trail-scores", err);
        injectFilterBar(null);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("nav", init);
})();
(function() {
  var CSS_ID = "ok-daily-note-style";
  var cachedScores = null;

  function injectStyles() {
    if (document.getElementById(CSS_ID)) return;
    var style = document.createElement("style");
    style.id = CSS_ID;
    style.textContent = [
      "#ok-daily-note {",
      "  border: 1px solid var(--lightgray);",
      "  border-radius: 8px;",
      "  background: var(--light);",
      "  padding: 1rem 1.25rem;",
      "  margin: 1.5rem 0;",
      "  max-width: 100%;",
      "}",
      "#ok-daily-note .ok-dn-label {",
      "  font-size: 0.75rem;",
      "  font-weight: 600;",
      "  color: var(--gray);",
      "  text-transform: uppercase;",
      "  letter-spacing: 0.08em;",
      "  margin-bottom: 0.5rem;",
      "}",
      "#ok-daily-note .ok-dn-title {",
      "  font-size: 1.05rem;",
      "  font-weight: 700;",
      "  color: var(--secondary);",
      "  text-decoration: none;",
      "  display: block;",
      "  margin-bottom: 0.5rem;",
      "}",
      "#ok-daily-note .ok-dn-title:hover { text-decoration: underline; }",
      "#ok-daily-note .ok-dn-scores {",
      "  font-size: 0.82rem;",
      "  color: var(--darkgray);",
      "  margin-top: 0.6rem;",
      "  letter-spacing: 0.5px;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function seededPick(arr, seed) {
    var s = seed;
    s = ((s * 1664525 + 1013904223) & 0x7fffffff);
    return arr[s % arr.length];
  }

  function slugToTitle(slug) {
    var parts = slug.split("/");
    var name = parts[parts.length - 1] || parts[0];
    return name.replace(/-/g, " ").replace(/%20/g, " ");
  }

  function renderStars(score) {
    var filled = Math.round(score);
    var out = "";
    for (var i = 1; i <= 10; i++) {
      out += i <= filled ? "★" : "☆";
    }
    return out;
  }

  function render(scores) {
    var wrap = document.getElementById("ok-daily-note");
    if (!wrap) return;
    if (wrap.querySelector(".ok-dn-label")) return;

    var highWonder = Object.keys(scores).filter(function(k) { return scores[k].w >= 8; });
    if (!highWonder.length) return;

    var today = new Date();
    var seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    var slug = seededPick(highWonder, seed);
    var score = scores[slug];
    var title = slugToTitle(slug);
    var url = "/" + slug;

    var label = document.createElement("div");
    label.className = "ok-dn-label";
    label.textContent = "Today in Kenya's history";

    var link = document.createElement("a");
    link.className = "ok-dn-title";
    link.href = url;
    link.textContent = title;

    var scoreRow = document.createElement("div");
    scoreRow.className = "ok-dn-scores";
    scoreRow.textContent = "Wonder " + renderStars(score.w) + "  Emotion " + renderStars(score.e);

    wrap.appendChild(label);
    wrap.appendChild(link);
    wrap.appendChild(scoreRow);
  }

  function init() {
    var wrap = document.getElementById("ok-daily-note");
    if (!wrap) return;

    injectStyles();

    if (cachedScores) {
      render(cachedScores);
      return;
    }

    fetch("/static/scores.json")
      .then(function(r) { return r.json(); })
      .then(function(data) {
        cachedScores = data;
        render(data);
      })
      .catch(function(err) { console.warn("DailyNote: failed to load scores", err); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("nav", init);
})();
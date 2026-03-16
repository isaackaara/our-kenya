(function() {
  var ARC_CSS_ID = "ok-trail-arc-style";
  var cachedTrailScores = null;

  function injectStyles() {
    if (document.getElementById(ARC_CSS_ID)) return;
    var style = document.createElement("style");
    style.id = ARC_CSS_ID;
    style.textContent = [
      ".ok-trail-arc { margin-top: 6px; display: flex; flex-direction: column; gap: 3px; }",
      ".ok-arc-row { display: flex; align-items: center; gap: 6px; }",
      ".ok-arc-label { font-size: 10px; color: var(--gray); width: 46px; flex-shrink: 0;",
      "  font-family: Inter, system-ui, sans-serif; text-transform: uppercase; letter-spacing: 0.05em;",
      "  white-space: nowrap; overflow: hidden; }",
      ".ok-arc-bar { flex: 1; height: 4px; background: var(--lightgray); border-radius: 2px; overflow: hidden; }",
      ".ok-arc-fill { height: 100%; border-radius: 2px; transition: width 0.3s ease; }",
      ".ok-arc-emotion { background: linear-gradient(to right, #c2603a, #8b1a1a); }",
      ".ok-arc-wonder { background: linear-gradient(to right, #3a5a7a, #5a2a7a); }",
      ".ok-arc-hint { font-size: 9px; color: var(--gray); margin-top: 4px; line-height: 1.4; font-style: italic; }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function slugFromHref(href) {
    var path = href.replace(/^\//, "").replace(/\/$/, "");
    return "Trails/" + path.split("/").slice(1).join("/");
  }

  function renderArcs(scores) {
    var cards = document.querySelectorAll(".trail-card");
    cards.forEach(function(card) {
      if (card.querySelector(".ok-trail-arc")) return;
      var href = card.getAttribute("href") || "";
      var trailKey = href.replace(/^\//, "");
      var score = scores[trailKey] || scores["Trails/" + trailKey.replace(/^Trails\//, "")];
      if (!score) return;

      var emotionPct = Math.round((score.e / 10) * 100);
      var wonderPct = Math.round((score.w / 10) * 100);

      var arc = document.createElement("div");
      arc.className = "ok-trail-arc";
      arc.innerHTML = [
        '<div class="ok-arc-row">',
        '  <span class="ok-arc-label">Feel</span>',
        '  <div class="ok-arc-bar"><div class="ok-arc-fill ok-arc-emotion" style="width:' + emotionPct + '%"></div></div>',
        '</div>',
        '<div class="ok-arc-row">',
        '  <span class="ok-arc-label">Wonder</span>',
        '  <div class="ok-arc-bar"><div class="ok-arc-fill ok-arc-wonder" style="width:' + wonderPct + '%"></div></div>',
        '</div>',
        '<div class="ok-arc-hint">Feel = emotional intensity. Wonder = how much this rewrites what you thought you knew.</div>'
      ].join("");

      var desc = card.querySelector(".trail-card-description");
      if (desc) {
        desc.parentNode.insertBefore(arc, desc.nextSibling);
      } else {
        card.appendChild(arc);
      }
    });
  }

  function init() {
    var cards = document.querySelectorAll(".trail-card");
    if (!cards.length) return;

    injectStyles();

    if (cachedTrailScores) {
      renderArcs(cachedTrailScores);
      return;
    }

    fetch("/static/trail-scores.json")
      .then(function(r) { return r.json(); })
      .then(function(data) {
        cachedTrailScores = data;
        renderArcs(data);
      })
      .catch(function(err) { console.warn("TrailScores: failed to load trail-scores", err); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("nav", init);
})();
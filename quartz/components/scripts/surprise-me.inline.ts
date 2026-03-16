(function() {
  var BUTTON_TEXTS = [
    "Surprise me",
    "Take me somewhere unexpected",
    "Show me something I don't know"
  ];

  var currentPick = null;

  function pickRandom(scores) {
    var keys = Object.keys(scores).filter(function(k) { return scores[k].w >= 8; });
    if (!keys.length) return null;
    return keys[Math.floor(Math.random() * keys.length)];
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

  function isMobile() {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }

  function injectStyles() {
    if (document.getElementById("ok-surprise-style")) return;
    var style = document.createElement("style");
    style.id = "ok-surprise-style";
    style.textContent = [
      "#ok-surprise-wrap { position: relative; margin: 1.5rem 0; }",
      "#ok-surprise-btn {",
      "  display: flex; align-items: center; justify-content: space-between;",
      "  width: 100%; padding: 14px 24px; background: #1b3d2f; color: #f5f0e8;",
      "  border: none; border-radius: 8px; cursor: pointer; font-size: 1.1rem;",
      "  font-family: inherit; transition: opacity 0.15s ease;",
      "}",
      "#ok-surprise-btn:hover { opacity: 0.9; }",
      "#ok-surprise-btn-main { font-weight: 700; }",
      "#ok-surprise-count { font-size: 0.8rem; opacity: 0.8; }",
      "#ok-surprise-preview {",
      "  position: absolute; bottom: calc(100% + 8px); left: 0; right: 0;",
      "  background: var(--light, #fff); border: 1px solid #1b3d2f;",
      "  border-radius: 6px; padding: 10px 14px; font-size: 0.9rem;",
      "  box-shadow: 0 4px 16px rgba(0,0,0,0.12); pointer-events: none;",
      "  opacity: 0; transition: opacity 0.15s ease; z-index: 20;",
      "}",
      "#ok-surprise-preview.visible { opacity: 1; }",
      "#ok-surprise-preview-title { font-weight: 600; color: var(--dark, #1a1a1a); margin-bottom: 4px; }",
      "#ok-surprise-preview-stars { font-size: 0.85rem; color: #1b3d2f; letter-spacing: 1px; }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function buildButton(scores) {
    var wrap = document.getElementById("ok-surprise-wrap");
    if (!wrap || wrap.querySelector("#ok-surprise-btn")) return;

    var highWonder = Object.keys(scores).filter(function(k) { return scores[k].w >= 8; });
    var count = highWonder.length;

    var btn = document.createElement("button");
    btn.id = "ok-surprise-btn";
    btn.setAttribute("aria-label", "Navigate to a random high-wonder note");

    var mainSpan = document.createElement("span");
    mainSpan.id = "ok-surprise-btn-main";
    mainSpan.textContent = "✦ " + BUTTON_TEXTS[0];

    var countSpan = document.createElement("span");
    countSpan.id = "ok-surprise-count";
    countSpan.textContent = "from " + count + " discoveries";

    btn.appendChild(mainSpan);
    btn.appendChild(countSpan);

    var preview = document.createElement("div");
    preview.id = "ok-surprise-preview";
    preview.setAttribute("aria-hidden", "true");

    var previewTitle = document.createElement("div");
    previewTitle.id = "ok-surprise-preview-title";

    var previewStars = document.createElement("div");
    previewStars.id = "ok-surprise-preview-stars";

    preview.appendChild(previewTitle);
    preview.appendChild(previewStars);

    wrap.appendChild(preview);
    wrap.appendChild(btn);

    var textIdx = 0;

    function refreshPick() {
      currentPick = pickRandom(scores);
      if (!currentPick) return;
      textIdx = (textIdx + 1) % BUTTON_TEXTS.length;
      mainSpan.textContent = "✦ " + BUTTON_TEXTS[textIdx];
      previewTitle.textContent = slugToTitle(currentPick);
      previewStars.textContent = "Wonder: " + renderStars(scores[currentPick].w);
    }

    refreshPick();

    if (!isMobile()) {
      btn.addEventListener("mouseenter", function() {
        refreshPick();
        preview.classList.add("visible");
      });
      btn.addEventListener("mouseleave", function() {
        preview.classList.remove("visible");
      });
    }

    btn.addEventListener("click", function() {
      if (!currentPick) { refreshPick(); }
      if (currentPick) {
        window.location.href = "/" + currentPick;
      }
    });
  }

  var cachedScores = null;

  function init() {
    var wrap = document.getElementById("ok-surprise-wrap");
    if (!wrap) return;

    injectStyles();

    if (cachedScores) {
      buildButton(cachedScores);
      return;
    }

    fetch("/static/scores.json")
      .then(function(r) { return r.json(); })
      .then(function(data) {
        cachedScores = data;
        buildButton(data);
      })
      .catch(function(err) { console.warn("SurpriseMe: failed to load scores", err); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("nav", init);
})();
(function() {
  function trackEvent(eventType, slug) {
    var id = localStorage.getItem("ok-listener-id") || "anonymous";
    fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Listener-ID": id },
      body: JSON.stringify({ event_type: eventType, slug: slug })
    }).catch(function() {});
  }

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
      "  width: 100%; padding: 14px 24px; background: var(--dark, #1a1a1a); color: var(--light, #f5f0e8);",
      "  border: none; border-radius: 8px; cursor: pointer; font-size: 1.1rem;",
      "  font-family: inherit; transition: opacity 0.15s ease;",
      "}",
      "#ok-surprise-btn:hover { opacity: 0.9; }",
      "#ok-surprise-btn-main { font-weight: 700; }",
      "#ok-surprise-count { font-size: 0.8rem; opacity: 0.8; }",
      "#ok-surprise-preview {",
      "  position: absolute; bottom: calc(100% + 8px); left: 0; right: 0;",
      "  background: var(--light, #fff); border: 1px solid var(--lightgray, #ccc);",
      "  border-radius: 6px; padding: 10px 14px; font-size: 0.9rem;",
      "  box-shadow: 0 4px 16px rgba(0,0,0,0.12); pointer-events: none;",
      "  opacity: 0; transition: opacity 0.15s ease; z-index: 20;",
      "  margin-bottom: 8px;",
      "}",
      "#ok-surprise-preview.visible { opacity: 1; }",
      "#ok-surprise-preview-title { font-weight: 600; color: var(--dark, #1a1a1a); margin-bottom: 4px; }",
      "#ok-surprise-preview-stars { font-size: 0.85rem; color: var(--gray, #666); letter-spacing: 1px; }"
    ].join("\n");
    document.head.appendChild(style);
  }

  var cachedScores = null;
  var fetchInFlight = null;

  function ensureScores() {
    if (cachedScores) return Promise.resolve(cachedScores);
    if (fetchInFlight) return fetchInFlight;
    fetchInFlight = fetch("/static/scores.json")
      .then(function(r) { return r.json(); })
      .then(function(data) {
        cachedScores = data;
        fetchInFlight = null;
        return data;
      })
      .catch(function(err) {
        fetchInFlight = null;
        console.warn("SurpriseMe: failed to load scores", err);
        return null;
      });
    return fetchInFlight;
  }

  function activateButton(scores, btn, mainSpan, countSpan, preview, previewTitle, previewStars) {
    var highWonder = Object.keys(scores).filter(function(k) { return scores[k].w >= 8; });
    countSpan.textContent = "from " + highWonder.length + " discoveries";

    var textIdx = 0;

    function refreshPick() {
      currentPick = pickRandom(scores);
      if (!currentPick) return;
      textIdx = (textIdx + 1) % BUTTON_TEXTS.length;
      mainSpan.textContent = BUTTON_TEXTS[textIdx];
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
  }

  function buildButton() {
    var wrap = document.getElementById("ok-surprise-wrap");
    if (!wrap || wrap.querySelector("#ok-surprise-btn")) return;

    var btn = document.createElement("button");
    btn.id = "ok-surprise-btn";
    btn.setAttribute("aria-label", "Navigate to a random high-wonder note");

    var mainSpan = document.createElement("span");
    mainSpan.id = "ok-surprise-btn-main";
    mainSpan.textContent = BUTTON_TEXTS[0];

    var countSpan = document.createElement("span");
    countSpan.id = "ok-surprise-count";
    countSpan.textContent = "";

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

    var activated = false;

    btn.addEventListener("click", function() {
      if (!activated) {
        // First click: fetch scores, then navigate
        ensureScores().then(function(scores) {
          if (!scores) return;
          activated = true;
          activateButton(scores, btn, mainSpan, countSpan, preview, previewTitle, previewStars);
          if (currentPick) {
            trackEvent("surprise_click", currentPick);
            window.location.href = "/" + currentPick;
          }
        });
        return;
      }
      // Subsequent clicks: data already loaded
      if (!currentPick) {
        currentPick = pickRandom(cachedScores);
      }
      if (currentPick) {
        trackEvent("surprise_click", currentPick);
        window.location.href = "/" + currentPick;
      }
    });

    // If scores were already cached from a previous page, activate immediately
    if (cachedScores) {
      activated = true;
      activateButton(cachedScores, btn, mainSpan, countSpan, preview, previewTitle, previewStars);
    }
  }

  function init() {
    var wrap = document.getElementById("ok-surprise-wrap");
    if (!wrap) return;

    injectStyles();
    buildButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("nav", init);
})();
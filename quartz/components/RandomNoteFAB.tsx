import { QuartzComponent, QuartzComponentConstructor } from "./types"

const RandomNoteFAB: QuartzComponent = () => {
  return <></>
}

RandomNoteFAB.afterDOMLoaded = `
(function() {
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
        console.warn("RandomNoteFAB: failed to load scores", err);
        return null;
      });
    return fetchInFlight;
  }

  function injectStyles() {
    if (document.getElementById("ok-random-fab-style")) return;
    var style = document.createElement("style");
    style.id = "ok-random-fab-style";
    style.textContent = [
      "@keyframes ok-fab-pulse {",
      "  0% { box-shadow: 0 2px 8px rgba(0,0,0,0.18); }",
      "  50% { box-shadow: 0 2px 8px rgba(0,0,0,0.18), 0 0 0 6px rgba(0,0,0,0.08); }",
      "  100% { box-shadow: 0 2px 8px rgba(0,0,0,0.18); }",
      "}",
      "#ok-random-fab {",
      "  position: fixed;",
      "  bottom: 4.5rem;",
      "  right: 1.5rem;",
      "  z-index: 901;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  padding: 0.5rem 1rem;",
      "  background: var(--dark, #1a1a1a);",
      "  color: var(--light, #f5f0e8);",
      "  border: none;",
      "  border-radius: 20px;",
      "  cursor: pointer;",
      "  font-size: 0.85rem;",
      "  font-weight: 600;",
      "  font-family: inherit;",
      "  letter-spacing: 0.01em;",
      "  white-space: nowrap;",
      "  line-height: 1;",
      "  box-shadow: 0 2px 8px rgba(0,0,0,0.18);",
      "  opacity: 0.82;",
      "  transition: opacity 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;",
      "  animation: ok-fab-pulse 2s ease-in-out 3;",
      "}",
      "#ok-random-fab:hover {",
      "  opacity: 1;",
      "  box-shadow: 0 4px 14px rgba(0,0,0,0.22);",
      "  transform: translateY(-1px);",
      "}",
      "#ok-random-fab:active {",
      "  transform: scale(0.95);",
      "}",
      "@media (max-width: 800px) {",
      "  #ok-random-fab {",
      "    bottom: 8rem;",
      "    right: 1rem;",
      "  }",
      "}",
      "@media (prefers-reduced-motion: reduce) {",
      "  #ok-random-fab {",
      "    animation: none;",
      "  }",
      "}"
    ].join("\\n");
    document.head.appendChild(style);
  }

  function setupFAB() {
    if (document.getElementById("ok-random-fab")) return;

    injectStyles();

    var btn = document.createElement("button");
    btn.id = "ok-random-fab";
    btn.setAttribute("aria-label", "Read a random note");
    btn.textContent = "Surprise me";

    btn.addEventListener("click", function() {
      ensureScores().then(function(scores) {
        if (!scores) return;
        var keys = Object.keys(scores).filter(function(k) {
          return scores[k].w >= 7;
        });
        if (!keys.length) return;
        var slug = keys[Math.floor(Math.random() * keys.length)];

        // Track event
        try {
          var listenerId = localStorage.getItem("ok-listener-id");
          if (listenerId) {
            fetch("/api/event", {
              method: "POST",
              headers: { "Content-Type": "application/json", "X-Listener-ID": listenerId },
              body: JSON.stringify({ event_type: "random_fab", slug: slug })
            }).catch(function() {});
          }
        } catch(e) {}

        window.location.href = "/" + slug;
      });
    });

    document.body.appendChild(btn);
  }

  function onNav() {
    if (!document.getElementById("ok-random-fab")) {
      setupFAB();
    }
  }

  setupFAB();
  document.addEventListener("nav", onNav);
  window.addCleanup && window.addCleanup(function() {
    document.removeEventListener("nav", onNav);
  });
})();
`

export default (() => RandomNoteFAB) satisfies QuartzComponentConstructor

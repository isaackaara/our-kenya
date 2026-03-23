(function () {
  var cachedScores: Record<string, any> | null = null;
  var cachedCold: any[] | null = null;
  var scoresFetch: Promise<Record<string, any> | null> | null = null;
  var coldFetch: Promise<any[] | null> | null = null;

  function getListenerId(): string {
    var id = localStorage.getItem("listener-id");
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
      localStorage.setItem("listener-id", id);
    }
    return id;
  }

  function slugToTitle(slug: string): string {
    var parts = slug.split("/");
    var name = parts[parts.length - 1] || parts[0];
    return decodeURIComponent(name).replace(/-/g, " ").replace(/%20/g, " ");
  }

  function renderStars(score: number): string {
    var filled = Math.round(score);
    var out = "";
    for (var i = 1; i <= 10; i++) {
      out += i <= filled ? "\u2605" : "\u2606";
    }
    return out;
  }

  function hashString(str: string): number {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      hash = ((hash << 5) - hash + ch) | 0;
    }
    return Math.abs(hash);
  }

  function fetchScores(): Promise<Record<string, any> | null> {
    if (cachedScores) return Promise.resolve(cachedScores);
    if (scoresFetch) return scoresFetch;
    scoresFetch = fetch("/static/scores.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (data: any) {
        cachedScores = data;
        scoresFetch = null;
        return cachedScores;
      })
      .catch(function (err) {
        scoresFetch = null;
        console.warn("HiddenGem: failed to load scores", err);
        return null;
      });
    return scoresFetch;
  }

  function fetchCold(): Promise<any[] | null> {
    if (cachedCold) return Promise.resolve(cachedCold);
    if (coldFetch) return coldFetch;
    coldFetch = fetch("/api/cold-notes")
      .then(function (r) {
        return r.json();
      })
      .then(function (data: any) {
        cachedCold = data.cold || [];
        coldFetch = null;
        return cachedCold;
      })
      .catch(function (err) {
        coldFetch = null;
        console.warn("HiddenGem: failed to load cold notes", err);
        return null;
      });
    return coldFetch;
  }

  function trackClick(slug: string) {
    var listenerId = getListenerId();
    fetch("/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Listener-ID": listenerId,
      },
      body: JSON.stringify({ event_type: "hidden_gem_click", slug: slug }),
    }).catch(function () {});
  }

  function render(cold: any[], scores: Record<string, any>) {
    var container = document.getElementById("ok-hidden-gem");
    if (!container) return;

    // Avoid re-rendering
    if (container.querySelector(".ok-gem-card")) return;

    // Find cold notes with wonder >= 8
    var coldSlugs: string[] = [];
    for (var i = 0; i < cold.length; i++) {
      var slug = cold[i].slug;
      if (scores[slug] && scores[slug].w >= 8) {
        coldSlugs.push(slug);
      }
    }

    if (!coldSlugs.length) return;

    // Deterministic daily pick using date string as seed
    var daySeed = new Date().toDateString();
    var idx = hashString(daySeed) % coldSlugs.length;
    var picked = coldSlugs[idx];
    var score = scores[picked];
    var title = slugToTitle(picked);

    var card = document.createElement("div");
    card.className = "ok-gem-card";

    var label = document.createElement("div");
    label.className = "ok-gem-label";
    label.textContent = "\uD83D\uDC8E Hidden Gem";

    var subtitle = document.createElement("div");
    subtitle.className = "ok-gem-subtitle";
    subtitle.textContent = "Read by fewer than 5 people";

    var link = document.createElement("a");
    link.className = "ok-gem-title";
    link.href = "/" + picked;
    link.textContent = title;
    link.addEventListener("click", function () {
      trackClick(picked);
    });

    var wonder = document.createElement("div");
    wonder.className = "ok-gem-wonder";
    wonder.textContent = "Wonder " + renderStars(score.w);

    card.appendChild(label);
    card.appendChild(subtitle);
    card.appendChild(link);
    card.appendChild(wonder);
    container.appendChild(card);
  }

  function init() {
    var container = document.getElementById("ok-hidden-gem");
    if (!container) return;

    Promise.all([fetchCold(), fetchScores()]).then(function (results) {
      var cold = results[0];
      var scores = results[1];
      if (!cold || !scores) return;
      render(cold, scores);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("nav", init);
})();

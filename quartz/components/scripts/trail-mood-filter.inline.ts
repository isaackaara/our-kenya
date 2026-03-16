(function() {
  var FILTER_CSS_ID = "ok-mood-filter-style";
  var SCROLL_KEY = "trailHubScrollY";
  var FILTER_KEY = "trailHubFilter";

  function textOf(card: Element): string {
    var el = card as HTMLElement
    return ((el.dataset.name || "") + " " + (el.dataset.description || "")).toLowerCase()
  }

  var FILTERS = [
    {
      id: "all",
      label: "All",
      test: function(_s: any, _card: Element) { return true; }
    },
    {
      id: "heavy",
      label: "Heavy",
      test: function(_s: any, card: Element) {
        var t = textOf(card)
        return /massacre|mau mau|detainee|detention camp|emergency|oathing|goldenberg|leasing|phantom contract|home guard|systematic land|nyayo era|siaya hiv|murang.a massacre|dedan kimathi|colonial encounter|when kenya burned|the land question|sounds of the mau mau|wagalla|shifta|corruption|tribalism and the state|the nyayo|pirate|the kisumu|assassination|killed the star|jaramogi.*ghost|coup that almost|five campaigns|raila|the schoolmaster who became|luo and the kikuyu.*political|pastoralism under pressure|dadaab/.test(t)
      }
    },
    {
      id: "eyeopening",
      label: "Eye-opening",
      test: function(_s: any, card: Element) {
        var t = textOf(card)
        return /constitution of 2010|second liberation|multiparty|independent school|githunguri|fm radio changed|sheng speaks|facing mount kenya|swahili.*thousand years|luo christianity|gikuyu and mumbi|grace ogot|the first voice|community conservancy|the education journey|foreign policy|state house.*what happens|succession politics|kirinyaga.*coffee|religion and cosmology|the dholuo|luo funerary|marriage and family|nyanza.*forgotten|the fishing economy|omena|the beadwork economy|presbyterian kenya|the coastal land|the tana river|isukuti|a thousand years of coastal|from the nile|from cattle camp/.test(t)
      }
    },
    {
      id: "feelgood",
      label: "Feel-good",
      test: function(_s: any, card: Element) {
        var t = textOf(card)
        return /sauti sol|four voices.*one sound|sol generation|benga|gospel takeover|the taarab queens|gengetone|the running phenomenon|the great migration|flamingo|david sheldrick|born free|joy and george adamson|wangari maathai|trees and freedom|black rhino recovery|lupita ny|mount kenya.*sacred|hell.s gate.*wildlife|lake turkana.*jade|maasai.*brand|the rhino ark|the amboseli story|maasai in tourism|maasai women.*builders|beadwork and song|cattle culture|the drum that built|a thousand years of coastal sound|tsavo.*lions|the song that crossed|the nyatiti player|the independence songbook|harry thuku.*first protest|the great migration|grevy.s zebra|the white rhino|wildlife.*coexist/.test(t)
      }
    },
    {
      id: "surprising",
      label: "Surprising",
      test: function(_s: any, card: Element) {
        var t = textOf(card)
        return /alego.*obama|barack obama sr|if mboya had lived|the coup that almost|the drum that built a nation|jaramogi.s ghost|the vice presidents who never were|piracy killed the star|the handshake|the nyatiti player and the president|the son.s burden|the reluctant father|1969.*year kenya changed|the economist who saved|tom mboya.*man who should|the mount kenya mafia|rusinga island|the oathing|the gikuyu and mumbi movement|the murang.a massacre.*banana/.test(t)
      }
    },
  ]

  function injectStyles() {
    if (document.getElementById(FILTER_CSS_ID)) return;
    var style = document.createElement("style");
    style.id = FILTER_CSS_ID;
    style.textContent = [
      ".ok-mood-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.25rem; }",
      ".ok-mood-pill {",
      "  padding: 0.4rem 0.9rem; font-size: 0.8rem; font-weight: 500;",
      "  background: var(--light); color: var(--dark);",
      "  border: 1px solid var(--lightgray); border-radius: 4px;",
      "  cursor: pointer; white-space: nowrap; min-height: 32px;",
      "  transition: all 0.15s; font-family: inherit;",
      "  display: inline-flex; align-items: center; gap: 4px;",
      "}",
      ".ok-mood-pill:hover { border-color: var(--dark); background: var(--dark); color: var(--light); }",
      ".ok-mood-pill.active {",
      "  background: var(--dark); color: var(--light); border-color: var(--dark);",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function getFilterFromHash(): string {
    var hash = window.location.hash; // e.g. "#filter=heavy"
    var m = hash.match(/^#filter=([a-z]+)$/);
    return m ? m[1] : "all";
  }

  function setFilterInHash(filterId: string) {
    var newHash = filterId === "all" ? "" : "#filter=" + filterId;
    // replaceState keeps URL tidy without adding a history entry for filter changes
    var url = window.location.pathname + window.location.search + newHash;
    history.replaceState(null, "", url);
  }

  function applyFilter(filterId: string) {
    var filter = FILTERS.find(function(f) { return f.id === filterId; })
    if (!filter) filter = FILTERS[0]

    var cards = document.querySelectorAll(".trail-card")
    var visible = 0
    cards.forEach(function(card) {
      var passes = filter!.test(null, card)
      ;(card as HTMLElement).style.display = passes ? "" : "none"
      if (passes) visible++
    })

    var countEl = document.getElementById("trail-count")
    if (countEl) {
      var total = cards.length
      countEl.textContent = "Showing " + visible + " of " + total + " trails"
    }
  }

  function saveScrollAndFilter() {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    sessionStorage.setItem(FILTER_KEY, getFilterFromHash());
  }

  function injectFilterBar(activeId: string) {
    // Remove stale bar if any (re-init on nav)
    var existing = document.querySelector(".ok-mood-filters");
    if (existing) existing.remove();

    var grid = document.getElementById("trail-grid");
    if (!grid) return;

    var bar = document.createElement("div");
    bar.className = "ok-mood-filters";

    FILTERS.forEach(function(f) {
      var pill = document.createElement("button");
      pill.className = "ok-mood-pill" + (f.id === activeId ? " active" : "");
      pill.dataset.filter = f.id;
      pill.textContent = f.label;
      bar.appendChild(pill);
    });

    var parent = grid.parentNode!;
    parent.insertBefore(bar, grid);

    bar.addEventListener("click", function(e) {
      var pill = (e.target as Element).closest(".ok-mood-pill");
      if (!pill) return;
      var filterId = (pill as HTMLElement).dataset.filter || "all";
      bar.querySelectorAll(".ok-mood-pill").forEach(function(p) { p.classList.remove("active"); });
      pill.classList.add("active");
      setFilterInHash(filterId);
      applyFilter(filterId);
      // Clear saved scroll when user explicitly changes filter
      sessionStorage.removeItem(SCROLL_KEY);
    });

    // Save scroll position whenever a trail card link is clicked
    grid.addEventListener("click", function(e) {
      var link = (e.target as Element).closest("a");
      if (link) saveScrollAndFilter();
    }, true);
  }

  function init() {
    var slug = window.location.pathname.replace(/^\//, "").replace(/\/$/, "");
    if (slug !== "STORY-TRAILS") return;

    var grid = document.getElementById("trail-grid");
    if (!grid) return;

    injectStyles();

    // Determine which filter to apply: sessionStorage (back nav) > URL hash > "all"
    var savedFilter = sessionStorage.getItem(FILTER_KEY);
    var hashFilter = getFilterFromHash();

    var activeId = "all";
    if (savedFilter && savedFilter !== "all") {
      activeId = savedFilter;
      // Promote saved filter into hash so it's visible in URL
      setFilterInHash(activeId);
    } else if (hashFilter !== "all") {
      activeId = hashFilter;
    }

    injectFilterBar(activeId);
    applyFilter(activeId);

    // Restore scroll position if returning from a trail
    var savedScroll = sessionStorage.getItem(SCROLL_KEY);
    if (savedScroll) {
      sessionStorage.removeItem(SCROLL_KEY);
      sessionStorage.removeItem(FILTER_KEY);
      // requestAnimationFrame ensures DOM has settled before scrolling
      requestAnimationFrame(function() {
        window.scrollTo({ top: parseInt(savedScroll!, 10), behavior: "instant" });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("nav", init);
})();

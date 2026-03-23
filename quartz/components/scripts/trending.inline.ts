(function () {
  var cachedTrending: any[] | null = null;
  var fetchInFlight: Promise<any[] | null> | null = null;

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

  function fetchTrending(): Promise<any[] | null> {
    if (cachedTrending) return Promise.resolve(cachedTrending);
    if (fetchInFlight) return fetchInFlight;
    fetchInFlight = fetch("/api/trending")
      .then(function (r) {
        return r.json();
      })
      .then(function (data: any) {
        cachedTrending = data.trending || [];
        fetchInFlight = null;
        return cachedTrending;
      })
      .catch(function (err) {
        fetchInFlight = null;
        console.warn("Trending: failed to load", err);
        return null;
      });
    return fetchInFlight;
  }

  function trackClick(slug: string) {
    var listenerId = getListenerId();
    fetch("/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Listener-ID": listenerId,
      },
      body: JSON.stringify({ event_type: "trending_click", slug: slug }),
    }).catch(function () {});
  }

  function renderHomepage(items: any[]) {
    var container = document.getElementById("ok-trending");
    if (!container) return;

    // Avoid re-rendering
    if (container.querySelector(".ok-trending-list")) return;

    var top10 = items.slice(0, 10);
    if (!top10.length) {
      container.innerHTML = '<p class="ok-trending-empty">No trending notes yet.</p>';
      return;
    }

    var heading = document.createElement("h3");
    heading.className = "ok-trending-heading";
    heading.textContent = "Trending This Week";

    var ol = document.createElement("ol");
    ol.className = "ok-trending-list";

    for (var i = 0; i < top10.length; i++) {
      var item = top10[i];
      var li = document.createElement("li");
      li.className = "ok-trending-item";

      var link = document.createElement("a");
      link.href = "/" + item.slug;
      link.className = "ok-trending-title";
      link.textContent = slugToTitle(item.slug);
      link.addEventListener(
        "click",
        (function (s: string) {
          return function () {
            trackClick(s);
          };
        })(item.slug),
      );

      var badge = document.createElement("span");
      badge.className = "ok-trending-views";
      badge.textContent = item.views + " views";

      li.appendChild(link);
      li.appendChild(badge);
      ol.appendChild(li);
    }

    container.appendChild(heading);
    container.appendChild(ol);
  }

  function renderSidebar(items: any[]) {
    var container = document.getElementById("ok-trending-sidebar");
    if (!container) return;

    // Avoid re-rendering
    if (container.querySelector(".ok-trending-sidebar-list")) return;

    var top5 = items.slice(0, 5);
    if (!top5.length) return;

    var heading = document.createElement("h4");
    heading.className = "ok-trending-sidebar-heading";
    heading.textContent = "Trending";

    var ul = document.createElement("ul");
    ul.className = "ok-trending-sidebar-list";

    for (var i = 0; i < top5.length; i++) {
      var item = top5[i];
      var li = document.createElement("li");
      li.className = "ok-trending-sidebar-item";

      var link = document.createElement("a");
      link.href = "/" + item.slug;
      link.className = "ok-trending-sidebar-link";
      link.textContent = slugToTitle(item.slug);
      link.addEventListener(
        "click",
        (function (s: string) {
          return function () {
            trackClick(s);
          };
        })(item.slug),
      );

      li.appendChild(link);
      ul.appendChild(li);
    }

    container.appendChild(heading);
    container.appendChild(ul);
  }

  function init() {
    var homepageContainer = document.getElementById("ok-trending");
    var sidebarContainer = document.getElementById("ok-trending-sidebar");
    if (!homepageContainer && !sidebarContainer) return;

    fetchTrending().then(function (items) {
      if (!items) return;
      if (homepageContainer) renderHomepage(items);
      if (sidebarContainer) renderSidebar(items);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("nav", init);
})();

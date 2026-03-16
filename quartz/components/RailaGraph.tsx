import { QuartzComponent, QuartzComponentConstructor } from "./types"

const RailaGraph: QuartzComponent = () => {
  return null
}

RailaGraph.afterDOMLoaded = `
(function() {
  function initGraph() {
    var container = document.getElementById("ok-raila-graph");
    if (!container) return;
    if (container.dataset.rendered) return;
    container.dataset.rendered = "1";

    var W = container.clientWidth || 800;
    var isMobile = window.innerWidth < 640;
    var H = isMobile ? 280 : 400;

    container.style.width = "100%";
    container.style.height = H + "px";
    container.style.position = "relative";
    container.style.overflow = "hidden";
    container.style.borderRadius = "8px";
    container.style.background = "var(--light, #f8f6f1)";

    // Tooltip
    var tip = document.createElement("div");
    tip.style.cssText = "position:absolute;pointer-events:none;background:rgba(20,20,20,0.88);color:#fff;padding:6px 10px;border-radius:5px;font-size:11px;line-height:1.4;max-width:180px;display:none;z-index:100;transition:opacity 0.15s";
    container.appendChild(tip);

    var nodes = [
      { id: "raila",    label: "Raila Odinga",    type: "center",   href: "/Raila-Odinga",     desc: "Kenya's most consequential opposition figure. Five presidential runs." },
      { id: "oginga",   label: "Oginga Odinga",   type: "family",   href: "/Oginga-Odinga",    desc: "Father. Kenya's first Vice President. The original opposition voice." },
      { id: "uhuru",    label: "Uhuru Kenyatta",  type: "alliance", href: "/Uhuru-Kenyatta",   desc: "Bitter rival turned ally. The 2018 Handshake reshaped Kenyan politics." },
      { id: "kibaki",   label: "Mwai Kibaki",     type: "rival",    href: "/Mwai-Kibaki",      desc: "2007 election rival. The disputed result triggered post-election violence." },
      { id: "ruto",     label: "William Ruto",    type: "rival",    href: "/William-Ruto",     desc: "Post-2022 rival. Beat Raila in the 2022 presidential election." },
      { id: "moi",      label: "Daniel arap Moi", type: "alliance", href: "/Daniel-arap-Moi",  desc: "Detained Raila for years. Later formed a political alliance." },
      { id: "kalonzo",  label: "Kalonzo Musyoka", type: "alliance", href: "/Kalonzo-Musyoka",  desc: "Coalition partner across multiple elections. NASA alliance 2017." },
      { id: "mudavadi", label: "Musalia Mudavadi", type: "alliance", href: "/Musalia-Mudavadi", desc: "Coalition partner. CORD and later Orange movement ally." },
      { id: "karua",    label: "Martha Karua",    type: "alliance", href: "/Martha-Karua",     desc: "NARC ally. Prominent reformist who shared the democracy movement." },
      { id: "matiba",   label: "Kenneth Matiba",  type: "alliance", href: "/Kenneth-Matiba",   desc: "Democracy movement ally. Both fought for multiparty politics in the 1990s." },
      { id: "odm",      label: "ODM Party",       type: "entity",   href: "/ODM",              desc: "Orange Democratic Movement. Raila's political vehicle since 2007." },
      { id: "2007",     label: "2007 Election",   type: "event",    href: "/2007-Kenyan-election", desc: "The disputed election that triggered Kenya's worst post-independence crisis." },
      { id: "handshake",label: "The Handshake",   type: "event",    href: "/Handshake",        desc: "March 2018. Raila and Uhuru end their rivalry and forge a governing deal." },
      { id: "luo",      label: "Luo Community",   type: "entity",   href: "/Luo",              desc: "Raila's ethnic base. The lake, the intellect, the long opposition tradition." },
      { id: "au",       label: "AU Commission",   type: "entity",   href: "/African-Union",    desc: "Raila appointed AU Commission Chairperson candidate in 2024." },
    ];

    var links = [
      { source: "raila", target: "oginga",    type: "family",   label: "father / son" },
      { source: "raila", target: "uhuru",     type: "alliance", label: "rivals turned allies (Handshake 2018)" },
      { source: "raila", target: "kibaki",    type: "rival",    label: "2007 election dispute, then coalition" },
      { source: "raila", target: "ruto",      type: "rival",    label: "rivals post-2022 election" },
      { source: "raila", target: "moi",       type: "alliance", label: "detained by Moi, later allied" },
      { source: "raila", target: "kalonzo",   type: "alliance", label: "NASA coalition 2017" },
      { source: "raila", target: "mudavadi",  type: "alliance", label: "CORD and Orange alliance" },
      { source: "raila", target: "karua",     type: "alliance", label: "NARC democracy allies" },
      { source: "raila", target: "matiba",    type: "alliance", label: "multiparty movement allies 1990s" },
      { source: "raila", target: "odm",       type: "entity",   label: "ODM founder and leader" },
      { source: "raila", target: "2007",      type: "event",    label: "disputed presidential candidate" },
      { source: "raila", target: "handshake", type: "event",    label: "architect of the Handshake deal" },
      { source: "raila", target: "luo",       type: "entity",   label: "ethnic political base" },
      { source: "raila", target: "au",        type: "entity",   label: "AU Commission bid 2024" },
      { source: "uhuru", target: "handshake", type: "event",    label: "co-architect of the Handshake" },
      { source: "kibaki", target: "2007",     type: "rival",    label: "declared winner, disputed result" },
    ];

    var colors = {
      center:   "#1a4a2e",
      family:   "#c2603a",
      alliance: "#5a7a5a",
      rival:    "#8b1a1a",
      event:    "#a08a3a",
      entity:   "#3a5a7a",
    };

    var linkColors = {
      family:   "#c2603a",
      alliance: "#5a7a5a",
      rival:    "#8b1a1a",
      event:    "#a08a3a",
      entity:   "#3a5a7a",
    };

    function nodeRadius(n) {
      return n.type === "center" ? 20 : 11;
    }

    var d3Loaded = typeof window.d3 !== "undefined";

    function render(d3) {
      container.innerHTML = "";
      container.appendChild(tip);

      var svg = d3.select(container)
        .append("svg")
        .attr("width", "100%")
        .attr("height", H)
        .style("display", "block");

      var g = svg.append("g");

      // Zoom
      var zoom = d3.zoom()
        .scaleExtent([0.4, 3])
        .on("zoom", function(event) { g.attr("transform", event.transform); });
      svg.call(zoom);

      // Arrow markers per link type
      var defs = svg.append("defs");
      Object.keys(linkColors).forEach(function(type) {
        defs.append("marker")
          .attr("id", "arrow-" + type)
          .attr("viewBox", "0 -4 8 8")
          .attr("refX", 18)
          .attr("refY", 0)
          .attr("markerWidth", 5)
          .attr("markerHeight", 5)
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M0,-4L8,0L0,4")
          .attr("fill", linkColors[type])
          .attr("opacity", 0.6);
      });

      var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(function(d) { return d.id; }).distance(isMobile ? 70 : 100))
        .force("charge", d3.forceManyBody().strength(isMobile ? -200 : -320))
        .force("center", d3.forceCenter(W / 2, H / 2))
        .force("collision", d3.forceCollide().radius(function(d) { return nodeRadius(d) + 8; }));

      var link = g.append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", function(d) { return linkColors[d.type] || "#888"; })
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.5)
        .attr("marker-end", function(d) { return "url(#arrow-" + d.type + ")"; });

      var node = g.append("g")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .style("cursor", "pointer")
        .call(d3.drag()
          .on("start", function(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on("drag", function(event, d) {
            d.fx = event.x; d.fy = event.y;
          })
          .on("end", function(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
        );

      node.append("circle")
        .attr("r", function(d) { return nodeRadius(d); })
        .attr("fill", function(d) { return colors[d.type] || "#888"; })
        .attr("stroke", "rgba(255,255,255,0.3)")
        .attr("stroke-width", 1.5);

      node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", function(d) { return nodeRadius(d) + 12; })
        .style("font-size", isMobile ? "8px" : "10px")
        .style("font-family", "Inter, system-ui, sans-serif")
        .style("fill", "var(--dark, #1a1a1a)")
        .style("pointer-events", "none")
        .style("user-select", "none")
        .each(function(d) {
          var el = d3.select(this);
          var words = d.label.split(" ");
          if (words.length <= 2 || isMobile) {
            el.text(d.label);
          } else {
            // wrap at 2 words
            el.text(words.slice(0, 2).join(" "));
            el.append("tspan")
              .attr("x", 0)
              .attr("dy", "1.1em")
              .text(words.slice(2).join(" "));
          }
        });

      // Hover tooltip
      node.on("mouseover", function(event, d) {
          tip.style.display = "block";
          tip.innerHTML = "<strong>" + d.label + "</strong><br>" + d.desc;
        })
        .on("mousemove", function(event) {
          var rect = container.getBoundingClientRect();
          var x = event.clientX - rect.left + 12;
          var y = event.clientY - rect.top - 10;
          if (x + 190 > W) x = x - 200;
          tip.style.left = x + "px";
          tip.style.top = y + "px";
        })
        .on("mouseout", function() {
          tip.style.display = "none";
        })
        .on("click", function(event, d) {
          if (d.href) window.location.href = d.href;
        });

      // Touch tooltip
      node.on("touchstart", function(event, d) {
        event.preventDefault();
        tip.style.display = "block";
        tip.innerHTML = "<strong>" + d.label + "</strong><br>" + d.desc;
        tip.style.left = "50%";
        tip.style.top = "8px";
        tip.style.transform = "translateX(-50%)";
      }, { passive: false });

      simulation.on("tick", function() {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      });

      // Legend
      var legendTypes = [
        { type: "center",   label: "Raila" },
        { type: "family",   label: "Family" },
        { type: "alliance", label: "Alliance" },
        { type: "rival",    label: "Rival" },
        { type: "event",    label: "Event" },
        { type: "entity",   label: "Entity" },
      ];
      var legend = svg.append("g")
        .attr("transform", "translate(8," + (H - 8) + ")");
      legendTypes.forEach(function(item, i) {
        var row = legend.append("g").attr("transform", "translate(" + (i * (isMobile ? 50 : 68)) + ",0)");
        row.append("circle").attr("r", 5).attr("cx", 5).attr("cy", -5).attr("fill", colors[item.type]);
        row.append("text").attr("x", 13).attr("y", -1)
          .style("font-size", isMobile ? "7px" : "9px")
          .style("font-family", "Inter, system-ui, sans-serif")
          .style("fill", "var(--dark, #1a1a1a)")
          .text(item.label);
      });
    }

    if (typeof window.d3 !== "undefined") {
      render(window.d3);
    } else {
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js";
      script.onload = function() { render(window.d3); };
      script.onerror = function() {
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:#888;font-size:0.9rem">Graph could not load. <a href="/Raila-Odinga">Read about Raila Odinga instead.</a></p>';
      };
      document.head.appendChild(script);
    }
  }

  function tryInit() {
    var el = document.getElementById("ok-raila-graph");
    if (el) { initGraph(); return true; }
    return false;
  }

  if (!tryInit()) {
    document.addEventListener("nav", function() { tryInit(); });
    setTimeout(function() { tryInit(); }, 100);
    if (document.readyState !== "complete") {
      window.addEventListener("load", function() { tryInit(); });
    }
  }
  document.addEventListener("nav", function() {
    var el = document.getElementById("ok-raila-graph");
    if (el) { el.dataset.rendered = ""; initGraph(); }
  });
})();
`

export default (() => RailaGraph) satisfies QuartzComponentConstructor

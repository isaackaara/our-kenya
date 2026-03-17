---
title: Our Kenya
description: Kenya's history, written together. 6,547 notes, 131 trails, and 56,000 connections across Kenya's history.
cssclasses:
  - homepage
---

<div class="ok-hero">
<p class="ok-tagline">Kenya's history, written together.</p>
<p class="ok-intro">6,547 notes. 56,000 connections. 131 trails through Kenya's history. One knowledge graph. This archive is incomplete. Every story missing is an invitation.</p>
<div class="ok-cta-row">
<a href="contribute" class="ok-cta-primary">Help Write the Rest</a>
<a href="Kenya" class="ok-cta-secondary">Start Exploring</a>
<a href="STORY-TRAILS" class="ok-cta-outline">Browse Story Trails</a>
</div>
</div>

<div id="ok-surprise-wrap"></div>

<div id="ok-daily-note"></div>

## The Shape of Kenya

A living graph of Kenya's history. Explore connections across 6,500+ notes.

<div id="ok-hero-graph" style="width: 100%; margin: 2rem 0;"></div>

<script>
function initHeroGraph() {
  if (!window.d3) {
    setTimeout(initHeroGraph, 100);
    return;
  }

  const { select, forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, drag, zoom } = window.d3;
  const container = document.getElementById('ok-hero-graph');
  if (!container) return;

  const W = container.clientWidth || 800;
  const H = window.innerWidth < 640 ? 280 : 400;

  // Graph data
  const nodes = [
    { id: "Kenya", label: "Kenya", type: "center" },
    { id: "Elections", label: "Elections", type: "primary" },
    { id: "Presidencies", label: "Presidencies", type: "primary" },
    { id: "Corruption", label: "Corruption", type: "primary" },
    { id: "Colonial Kenya", label: "Colonial Kenya", type: "primary" },
    { id: "Conservation", label: "Conservation", type: "primary" },
    { id: "Political Movements", label: "Political Movements", type: "primary" },
    { id: "Ethnic Groups", label: "Ethnic Groups", type: "primary" },
    { id: "E1", type: "secondary" },
    { id: "E2", type: "secondary" },
    { id: "P1", type: "secondary" },
    { id: "P2", type: "secondary" },
    { id: "C1", type: "secondary" },
    { id: "C2", type: "secondary" },
    { id: "Co1", type: "secondary" },
    { id: "Co2", type: "secondary" },
    { id: "Con1", type: "secondary" },
    { id: "Con2", type: "secondary" },
    { id: "Pol1", type: "secondary" },
    { id: "Pol2", type: "secondary" },
    { id: "Eth1", type: "secondary" },
    { id: "Eth2", type: "secondary" },
  ];

  const links = [
    { source: "Kenya", target: "Elections" },
    { source: "Kenya", target: "Presidencies" },
    { source: "Kenya", target: "Corruption" },
    { source: "Kenya", target: "Colonial Kenya" },
    { source: "Kenya", target: "Conservation" },
    { source: "Kenya", target: "Political Movements" },
    { source: "Kenya", target: "Ethnic Groups" },
    { source: "Elections", target: "E1" },
    { source: "Elections", target: "E2" },
    { source: "Presidencies", target: "P1" },
    { source: "Presidencies", target: "P2" },
    { source: "Corruption", target: "C1" },
    { source: "Corruption", target: "C2" },
    { source: "Colonial Kenya", target: "Co1" },
    { source: "Colonial Kenya", target: "Co2" },
    { source: "Conservation", target: "Con1" },
    { source: "Conservation", target: "Con2" },
    { source: "Political Movements", target: "Pol1" },
    { source: "Political Movements", target: "Pol2" },
    { source: "Ethnic Groups", target: "Eth1" },
    { source: "Ethnic Groups", target: "Eth2" },
  ];

  // Wrapper
  const wrap = document.createElement('div');
  wrap.style.cssText = `width:100%;height:${H}px;position:relative;overflow:hidden;border-radius:8px;background:#000;`;
  container.appendChild(wrap);

  // SVG
  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgEl.setAttribute("width", "100%");
  svgEl.setAttribute("height", String(H));
  svgEl.style.display = "block";
  svgEl.style.background = "#000";
  wrap.appendChild(svgEl);

  const svg = select(svgEl);
  const gRoot = svg.append("g").attr("class", "kg-root");

  // Zoom
  const zoomBehavior = zoom()
    .scaleExtent([0.3, 3])
    .filter((event) => {
      if (event.type === "wheel") return event.ctrlKey || event.metaKey
      return !event.button
    })
    .on("zoom", (event) => gRoot.attr("transform", event.transform))
  svg.call(zoomBehavior);
  svgEl.addEventListener("wheel", (e) => { if (!e.ctrlKey && !e.metaKey) e.stopPropagation() }, { passive: true });

  // Simulate
  const nodeData = nodes.map(n => ({ ...n }));
  const linkData = links.map(l => ({ ...l }));

  const simulation = forceSimulation(nodeData)
    .force("link", forceLink(linkData).id(d => d.id).distance(100))
    .force("charge", forceManyBody().strength(-250))
    .force("center", forceCenter(W / 2, H / 2))
    .force("collision", forceCollide().radius(d => (d.type === "center" ? 12 : d.type === "primary" ? 7 : 4) + 5));

  const linkSel = gRoot.append("g")
    .selectAll("line")
    .data(linkData)
    .enter()
    .append("line")
    .attr("stroke", "#666")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.5);

  const dragBehavior = drag()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x; d.fy = d.y
    })
    .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null; d.fy = null
    });

  const nodeSel = gRoot.append("g")
    .selectAll("circle")
    .data(nodeData)
    .enter()
    .append("circle")
    .attr("r", d => d.type === "center" ? 10 : d.type === "primary" ? 5 : 3)
    .attr("fill", d => d.type === "center" ? "#666" : "#aaa")
    .attr("opacity", 0.8)
    .style("cursor", "pointer")
    .call(dragBehavior);

  simulation.on('tick', () => {
    linkSel
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodeSel
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroGraph);
} else {
  initHeroGraph();
}
</script>

## Explore by storyline

141 journeys that changed how we see Kenya. Each one pulls you deeper.

<div class="ok-verticals">
<a href="/Trails/The-Reluctant-Father" class="ok-vertical-card">
<strong>The Reluctant Father</strong>
<span>Kenyatta: from detainee to founding father.</span>
</a>
<a href="/Trails/Swahili:-A-Thousand-Years" class="ok-vertical-card">
<strong>Swahili: A Thousand Years</strong>
<span>City-states, dhows, monsoons, and a thousand years of Indian Ocean trade.</span>
</a>
<a href="/Trails/The-Handshake" class="ok-vertical-card">
<strong>The Handshake</strong>
<span>Uhuru and Raila, 2018. The deal that rewrote Kenyan politics.</span>
</a>
<a href="/Trails/The-Running-Phenomenon" class="ok-vertical-card">
<strong>The Running Phenomenon</strong>
<span>Why Kalenjin runners dominate distance running - and what Kipchoge means.</span>
</a>
<a href="/Trails/Goldenberg:-The-Heist" class="ok-vertical-card">
<strong>Goldenberg: The Heist</strong>
<span>The gold scam that cost Kenya billions.</span>
</a>
<a href="/Trails/The-Land-Question" class="ok-vertical-card">
<strong>The Land Question</strong>
<span>From colonial theft to modern inequality.</span>
</a>
<a href="/Trails/Wangari-Maathai:-Trees-and-Freedom" class="ok-vertical-card">
<strong>Wangari Maathai: Trees and Freedom</strong>
<span>A Nobel Prize. 30 million trees. A movement.</span>
</a>
<a href="/Trails/Anglo-Leasing:-Phantom-Contracts" class="ok-vertical-card">
<strong>Anglo Leasing: Phantom Contracts</strong>
<span>Ghost firms, real money, no accountability.</span>
</a>
<a href="/Trails/The-Coastal-Land-Problem" class="ok-vertical-card">
<strong>The Coastal Land Problem</strong>
<span>600 years of ownership. Still unresolved.</span>
</a>
</div>

<p class="ok-see-all"><a href="STORY-TRAILS">See all 141 storylines →</a></p>

## Explore by theme

Every theme has its own index. Start at any node - the graph takes you further.

<div class="ok-verticals" id="ok-theme-grid"></div>

## Story Trails

<div class="ok-trails-callout">
<p>141 curated journeys through Kenya's history. Each trail is a sequence of notes ordered to tell a complete story arc. Follow the thread. Every note has its own trails branching off.</p>
<p>You may not come back the same way you arrived.</p>
<p><a href="STORY-TRAILS">Browse all Story Trails</a></p>
</div>

<div class="ok-graph-section">

## Explore Kenya's Story

Fifty-eight knowledge graphs. Each one a different corner of Kenya's history. Click any node to read the full story.

<div id="ok-knowledge-graphs"></div>

</div>

## How this works

Our Kenya is a knowledge graph built from primary sources, oral histories, and documented research. 6,547 notes. 56,252 mapped connections between people, events, places, and ideas.

Each note is written to be finished in under two minutes. History does not have to be a textbook.

Start anywhere - [[Kenya]], a county, a president, an election. Follow any link. You're in.

There is no right place to begin. There is no wrong turn.

## Contribute

This archive is 6,547 notes deep. But Kenya's story is deeper. There are communities not yet represented. Elections not yet documented. People who shaped this country and left no trace in the official record. If you know a story that isn't here, it belongs here.

<a href="contribute" class="ok-section-cta">Help write the rest</a>

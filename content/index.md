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

A living graph of Kenya's history. Kenya at the center, 7 themes radiating outward.

<div id="hero-graph-container" style="width: 100%; height: 600px; margin: 2rem 0; border-radius: 8px; overflow: hidden; background: linear-gradient(135deg, #006B3F 0%, #BB0000 100%);"></div>

<script async src="https://d3js.org/d3.v7.min.js"></script>
<script>
function initHeroGraph() {
  if (!window.d3) {
    setTimeout(initHeroGraph, 100);
    return;
  }

  const container = document.getElementById('hero-graph-container');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Graph data - hardcoded like knowledge-graphs.inline.ts
  const nodes = [
    { id: "Kenya", label: "Kenya", type: "center", size: 20, color: "#006B3F" },
    { id: "Elections", label: "Elections", type: "primary", size: 10, color: "#BB0000" },
    { id: "Presidencies", label: "Presidencies", type: "primary", size: 10, color: "#BB0000" },
    { id: "Corruption", label: "Corruption", type: "primary", size: 10, color: "#BB0000" },
    { id: "Colonial Kenya", label: "Colonial Kenya", type: "primary", size: 10, color: "#BB0000" },
    { id: "Conservation", label: "Conservation", type: "primary", size: 10, color: "#BB0000" },
    { id: "Political Movements", label: "Political Movements", type: "primary", size: 10, color: "#BB0000" },
    { id: "Ethnic Groups", label: "Ethnic Groups", type: "primary", size: 10, color: "#BB0000" },
    { id: "Elections-1", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Elections-2", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Presidencies-1", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Presidencies-2", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Corruption-1", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Corruption-2", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Colonial-1", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Colonial-2", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Conservation-1", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Conservation-2", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Political-1", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Political-2", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Ethnic-1", label: "", type: "secondary", size: 5, color: "#84a59d" },
    { id: "Ethnic-2", label: "", type: "secondary", size: 5, color: "#84a59d" },
  ];

  const links = [
    { source: "Kenya", target: "Elections" },
    { source: "Kenya", target: "Presidencies" },
    { source: "Kenya", target: "Corruption" },
    { source: "Kenya", target: "Colonial Kenya" },
    { source: "Kenya", target: "Conservation" },
    { source: "Kenya", target: "Political Movements" },
    { source: "Kenya", target: "Ethnic Groups" },
    { source: "Elections", target: "Elections-1" },
    { source: "Elections", target: "Elections-2" },
    { source: "Presidencies", target: "Presidencies-1" },
    { source: "Presidencies", target: "Presidencies-2" },
    { source: "Corruption", target: "Corruption-1" },
    { source: "Corruption", target: "Corruption-2" },
    { source: "Colonial Kenya", target: "Colonial-1" },
    { source: "Colonial Kenya", target: "Colonial-2" },
    { source: "Conservation", target: "Conservation-1" },
    { source: "Conservation", target: "Conservation-2" },
    { source: "Political Movements", target: "Political-1" },
    { source: "Political Movements", target: "Political-2" },
    { source: "Ethnic Groups", target: "Ethnic-1" },
    { source: "Ethnic Groups", target: "Ethnic-2" },
  ];

  const svg = d3.select(container).append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)');

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(80))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg.selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1)
    .attr('opacity', 0.4);

  const node = svg.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', d => d.size)
    .attr('fill', d => d.color)
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .attr('opacity', 0.85);

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
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

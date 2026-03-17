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

A living graph of Kenya's history. Explore connections across 6,500+ topics.

<div id="hero-graph-container" style="width: 100%; height: 600px; margin: 2rem 0; border-radius: 8px; overflow: hidden; background: linear-gradient(135deg, #006B3F 0%, #BB0000 100%); position: relative;">
  <canvas id="graph-canvas" style="display: block; width: 100%; height: 100%;"></canvas>
  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: rgba(255,255,255,0.7); text-align: center; font-size: 18px; pointer-events: none;">
    <p>Loading graph...</p>
    <p style="font-size: 14px; margin-top: 10px;">6,500+ topics connected</p>
  </div>
</div>

<script>
(function() {
  // Simplified force-directed graph using Canvas
  // Generates nodes from page links without external data file
  
  const canvas = document.getElementById('graph-canvas');
  if (!canvas) return;
  
  const container = canvas.parentElement;
  // Force canvas to render at display size
  canvas.width = container.offsetWidth * window.devicePixelRatio;
  canvas.height = container.offsetHeight * window.devicePixelRatio;
  
  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  
  // Create a simple graph structure
  const nodes = [];
  const links = [];
  
  // Add Kenya at center
  nodes.push({
    id: 'Kenya',
    label: 'Kenya',
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    color: '#006B3F',
    size: 20,
    fixed: true
  });
  
  // Add primary categories (radiating from Kenya)
  const categories = [
    'Elections', 'Presidencies', 'Corruption', 'Colonial Kenya',
    'Conservation', 'Political Movements', 'Ethnic Groups'
  ];
  
  const angleStep = (Math.PI * 2) / categories.length;
  const distance = 180;
  
  categories.forEach((cat, i) => {
    const angle = angleStep * i;
    nodes.push({
      id: cat,
      label: cat,
      x: width / 2 + Math.cos(angle) * distance,
      y: height / 2 + Math.sin(angle) * distance,
      vx: 0,
      vy: 0,
      color: '#BB0000',
      size: 12
    });
    
    // Link from Kenya to this category
    links.push({
      source: 0,
      target: nodes.length - 1,
      strength: 0.8
    });
    
    // Add secondary nodes (articles under each category)
    for (let j = 0; j < 12; j++) {
      const secondaryAngle = angleStep * i + (Math.random() - 0.5) * angleStep * 0.8;
      const secondaryDistance = distance + 100 + Math.random() * 50;
      
      nodes.push({
        id: `${cat}-${j}`,
        label: '',
        x: width / 2 + Math.cos(secondaryAngle) * secondaryDistance,
        y: height / 2 + Math.sin(secondaryAngle) * secondaryDistance,
        vx: 0,
        vy: 0,
        color: '#84a59d',
        size: 6
      });
      
      links.push({
        source: nodes.length - categories.length - 1,
        target: nodes.length - 1,
        strength: 0.3
      });
    }
  });
  
  // Simple force-directed simulation
  const iterations = 100;
  const damping = 0.99;
  const repulsion = 2000;
  const attraction = 0.1;
  
  function simulate() {
    // Apply forces
    for (let i = 0; i < iterations; i++) {
      // Reset forces
      nodes.forEach(n => {
        n.fx = 0;
        n.fy = 0;
      });
      
      // Repulsive forces between all nodes
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const dx = nodes[b].x - nodes[a].x;
          const dy = nodes[b].y - nodes[a].y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
          const force = repulsion / (dist * dist);
          
          nodes[a].vx -= (dx / dist) * force;
          nodes[a].vy -= (dy / dist) * force;
          nodes[b].vx += (dx / dist) * force;
          nodes[b].vy += (dy / dist) * force;
        }
      }
      
      // Attractive forces for linked nodes
      links.forEach(link => {
        const a = nodes[link.source];
        const b = nodes[link.target];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
        const force = attraction * dist * link.strength;
        
        a.vx += (dx / dist) * force;
        a.vy += (dy / dist) * force;
        b.vx -= (dx / dist) * force;
        b.vy -= (dy / dist) * force;
      });
      
      // Update positions
      nodes.forEach(n => {
        if (!n.fixed) {
          n.vx *= damping;
          n.vy *= damping;
          n.x += n.vx;
          n.y += n.vy;
          
          // Boundary conditions
          n.x = Math.max(n.size, Math.min(width - n.size, n.x));
          n.y = Math.max(n.size, Math.min(height - n.size, n.y));
        }
      });
    }
    
    // Draw
    ctx.fillStyle = 'rgba(26, 26, 26, 1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw links
    ctx.strokeStyle = 'rgba(68, 68, 68, 0.4)';
    ctx.lineWidth = 1;
    links.forEach(link => {
      const a = nodes[link.source];
      const b = nodes[link.target];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });
    
    // Draw nodes
    nodes.forEach(n => {
      ctx.fillStyle = n.color;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 1;
      ctx.stroke();
    });
  }
  
  simulate();
  
  // Add gentle animation
  function animate() {
    // Add slight drift
    nodes.forEach(n => {
      if (!n.fixed && Math.random() < 0.1) {
        n.vx += (Math.random() - 0.5) * 2;
        n.vy += (Math.random() - 0.5) * 2;
      }
    });
    
    simulate();
    setTimeout(animate, 2000);
  }
  
  animate();
})();
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

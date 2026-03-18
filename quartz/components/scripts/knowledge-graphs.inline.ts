import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
  select,
  drag,
  zoom,
} from "d3"

interface KGNode {
  id: string
  label: string
  type: string
  href: string
  desc: string
}

interface KGLink {
  source: string
  target: string
  type: string
  label: string
}

interface GraphDataset {
  id: string
  label: string
  nodes: KGNode[]
  links: KGLink[]
}

interface GraphCategory {
  label: string
  topics: string[]
}

const COLORS: Record<string, string> = {
  // New type scheme
  person:   "#1a1a1a",
  event:    "#8b2c2c",
  place:    "#4a7c59",
  concept:  "#2c5282",
  // Legacy types (kept for backward compat with raila graph)
  center:   "#1a1a1a",
  family:   "#c2603a",
  alliance: "#4a7c59",
  rival:    "#8b2c2c",
  entity:   "#2c5282",
}

function nodeRadius(type: string) {
  return type === "center" ? 20 : 11
}

// Graph data is lazy-loaded from /static/knowledge-graphs.json
let GRAPH_DATA: Record<string, GraphDataset> = {}
let GRAPH_CATEGORIES: GraphCategory[] = []
let GRAPHS_FLAT: GraphDataset[] = []
let currentGraphId = "raila"
let currentSimulation: any = null
let dataLoaded = false

async function loadGraphData(): Promise<boolean> {
  if (dataLoaded) return true
  try {
    const resp = await fetch("/static/knowledge-graphs.json")
    if (!resp.ok) return false
    const json = await resp.json()
    GRAPH_DATA = json.graphs || {}
    GRAPH_CATEGORIES = json.categories || []
    GRAPHS_FLAT = GRAPH_CATEGORIES.flatMap(cat =>
      cat.topics.map(id => GRAPH_DATA[id]).filter(Boolean)
    )
    currentGraphId = GRAPHS_FLAT.length > 0
      ? GRAPHS_FLAT[Math.floor(Math.random() * GRAPHS_FLAT.length)].id
      : "raila"
    dataLoaded = true
    return true
  } catch {
    return false
  }
}

function buildKnowledgeGraphs() {
  const container = document.getElementById("ok-knowledge-graphs")
  if (!container) return
  if (container.dataset.rendered === "1") return
  container.dataset.rendered = "1"

  container.style.cssText = "width:100%;position:relative"

  // --- Inject styles ---
  const styleEl = document.createElement("style")
  styleEl.textContent = `
    .ok-dropdown-btn{width:100%;background:#ffffff;color:#1a1a1a;border:1.5px solid #1a1a1a;border-radius:6px;padding:10px 16px;font-size:14px;font-family:Inter,system-ui,sans-serif;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:background 0.15s,color 0.15s;}
    .ok-dropdown-btn:hover{background:#f5f5f5;}
    .ok-dropdown-btn.ok-open{background:#1a1a1a;color:#ffffff;border-color:#1a1a1a;}
    .ok-dropdown-panel{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1px solid #c8c2b8;border-radius:6px;max-height:320px;overflow-y:auto;z-index:100;box-shadow:0 4px 16px rgba(0,0,0,0.12);}
    @media(max-width:640px){.ok-dropdown-panel{max-height:240px;}}
    .ok-dropdown-panel.ok-hidden{display:none;}
    .ok-cat-header{position:sticky;top:0;background:#f5f0e8;color:#1a1a1a;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;padding:6px 14px;border-bottom:1px solid #e0d8ce;}
    .ok-topic-item{padding:8px 14px;font-size:13px;font-family:Inter,system-ui,sans-serif;cursor:pointer;color:#333;transition:background 0.15s;}
    .ok-topic-item:hover{background:#f0f0f0;}
    .ok-topic-item.ok-selected{background:#1a1a1a;color:#ffffff;}
    .ok-graph-title{color:#1a1a1a;font-weight:700;font-size:14px;font-family:Inter,system-ui,sans-serif;margin:8px 0 4px 0;}
    .ok-quickpills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;}
    .ok-pill{background:#ffffff;color:#1a1a1a;border:1px solid #1a1a1a;border-radius:20px;padding:5px 13px;font-size:12px;font-family:Inter,system-ui,sans-serif;cursor:pointer;transition:background 0.15s,color 0.15s;white-space:nowrap;}
    .ok-pill:hover,.ok-pill.ok-pill-active{background:#1a1a1a;color:#ffffff;}
  `
  document.head.appendChild(styleEl)

  // --- Dropdown wrapper ---
  const dropWrap = document.createElement("div")
  dropWrap.style.cssText = "position:relative;margin-bottom:8px;"
  container.appendChild(dropWrap)

  const dropBtn = document.createElement("button")
  dropBtn.className = "ok-dropdown-btn"
  dropWrap.appendChild(dropBtn)

  const dropPanel = document.createElement("div")
  dropPanel.className = "ok-dropdown-panel ok-hidden"
  dropWrap.appendChild(dropPanel)

  function getLabel() {
    const g = GRAPH_DATA[currentGraphId]
    if (!g) return "Select topic"
    return `${g.label} - ${g.nodes.length} nodes`
  }

  function updateBtn() {
    const total = GRAPHS_FLAT.length
    dropBtn.innerHTML = `<span>${getLabel()}</span><span style="display:flex;align-items:center;gap:8px;flex-shrink:0;margin-left:12px;"><span style="font-size:11px;opacity:0.55;">${total} graphs</span><span style="font-size:11px;">&#9660;</span></span>`
  }

  function buildPanel() {
    dropPanel.innerHTML = ""
    GRAPH_CATEGORIES.forEach(cat => {
      const hdr = document.createElement("div")
      hdr.className = "ok-cat-header"
      hdr.textContent = cat.label
      dropPanel.appendChild(hdr)
      cat.topics.forEach(topicId => {
        const g = GRAPH_DATA[topicId]
        if (!g) return
        const item = document.createElement("div")
        item.className = "ok-topic-item" + (topicId === currentGraphId ? " ok-selected" : "")
        item.textContent = g.label
        item.addEventListener("click", () => {
          if (topicId === currentGraphId) { closePanel(); return }
          currentGraphId = topicId
          updateBtn()
          buildPanel()
          closePanel()
          buildPills()
          switchGraph()
        })
        dropPanel.appendChild(item)
      })
    })
  }

  let panelOpen = false

  function openPanel() {
    dropPanel.classList.remove("ok-hidden")
    dropBtn.classList.add("ok-open")
    panelOpen = true
  }

  function closePanel() {
    dropPanel.classList.add("ok-hidden")
    dropBtn.classList.remove("ok-open")
    panelOpen = false
  }

  dropBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    if (panelOpen) closePanel()
    else { buildPanel(); openPanel() }
  })

  document.addEventListener("click", () => { if (panelOpen) closePanel() })
  dropPanel.addEventListener("click", e => e.stopPropagation())

  updateBtn()

  // --- Quick-select pills ---
  const QUICK_PICKS = [
    "raila","jomo-kenyatta","wangari-maathai","mau-mau","pev-2007",
    "mpesa","swahili-coast","nairobi-city","marathon-champions","dedan-kimathi",
    "tom-mboya","conservation-history","safari-rally","lamu-island","women-parliament",
  ]
  const pillsRow = document.createElement("div")
  pillsRow.className = "ok-quickpills"
  function buildPills() {
    pillsRow.innerHTML = ""
    QUICK_PICKS.forEach(id => {
      const g = GRAPH_DATA[id]
      if (!g) return
      const pill = document.createElement("button")
      pill.className = "ok-pill" + (id === currentGraphId ? " ok-pill-active" : "")
      pill.textContent = g.label
      pill.addEventListener("click", () => {
        if (id === currentGraphId) return
        currentGraphId = id
        updateBtn()
        buildPills()
        switchGraph()
      })
      pillsRow.appendChild(pill)
    })
  }
  buildPills()
  container.appendChild(pillsRow)

  // --- Hint text ---
  const hint = document.createElement("p")
  hint.textContent = "Each graph maps a corner of Kenya's story. Click any node to explore."
  hint.style.cssText = "font-size:12px;color:#666;margin:4px 0 4px 0;font-family:Inter,system-ui,sans-serif;font-style:italic;"
  container.appendChild(hint)

  // --- Graph title ---
  const graphTitle = document.createElement("div")
  graphTitle.className = "ok-graph-title"
  container.appendChild(graphTitle)

  function updateTitle() {
    const g = GRAPH_DATA[currentGraphId]
    graphTitle.textContent = g ? g.label : ""
  }
  updateTitle()

  // --- Graph container ---
  const graphWrap = document.createElement("div")
  const isMobile = window.innerWidth < 640
  const H = isMobile ? 280 : 400
  graphWrap.style.cssText = [
    "width:100%",
    `height:${H}px`,
    "position:relative",
    "overflow:hidden",
    "border-radius:8px",
    "background:var(--light,#f8f6f1)",
  ].join(";")
  container.appendChild(graphWrap)

  // Loading indicator
  const loading = document.createElement("div")
  loading.textContent = "Loading..."
  loading.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:13px;color:#888;font-family:Inter,system-ui,sans-serif;pointer-events:none;"
  graphWrap.appendChild(loading)

  // Tooltip
  const tip = document.createElement("div")
  tip.style.cssText = "position:absolute;pointer-events:none;background:rgba(20,20,20,0.88);color:#fff;padding:6px 10px;border-radius:5px;font-size:11px;line-height:1.4;max-width:180px;display:none;z-index:100;"
  graphWrap.appendChild(tip)

  // SVG
  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svgEl.setAttribute("width", "100%")
  svgEl.setAttribute("height", String(H))
  svgEl.style.display = "block"
  graphWrap.appendChild(svgEl)

  const svg = select(svgEl)
  const gRoot = svg.append("g").attr("class", "kg-root")
  const W = graphWrap.clientWidth || 700

  // Zoom
  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.3, 3])
    .filter((event) => {
      if (event.type === "wheel") return event.ctrlKey || event.metaKey
      return !event.button
    })
    .on("zoom", (event) => gRoot.attr("transform", event.transform))
  svg.call(zoomBehavior as any)
  svgEl.addEventListener("wheel", (e) => { if (!e.ctrlKey && !e.metaKey) e.stopPropagation() }, { passive: true })

  // Arrow markers
  const defs = svg.append("defs")
  const markerTypes = Object.keys(COLORS)
  markerTypes.forEach(type => {
    defs.append("marker")
      .attr("id", `kg-arrow-${type}`)
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 18)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L8,0L0,4")
      .attr("fill", COLORS[type])
      .attr("opacity", 0.6)
  })

  // Legend
  const legendDefs = [
    { type: "person",  label: "Person"  },
    { type: "event",   label: "Event"   },
    { type: "place",   label: "Place"   },
    { type: "concept", label: "Concept" },
  ]
  const legendG = svg.append("g").attr("transform", `translate(8,${H - 8})`)
  legendDefs.forEach((item, i) => {
    const row = legendG.append("g").attr("transform", `translate(${i * (isMobile ? 60 : 80)},0)`)
    row.append("circle").attr("r", 5).attr("cx", 5).attr("cy", -5).attr("fill", COLORS[item.type])
    row.append("text")
      .attr("x", 13).attr("y", -1)
      .style("font-size", isMobile ? "8px" : "10px")
      .style("font-family", "Inter,system-ui,sans-serif")
      .style("fill", "var(--dark,#1a1a1a)")
      .text(item.label)
  })

  function renderGraph(graphId: string, animate: boolean) {
    const dataset = GRAPH_DATA[graphId]
    if (!dataset) return

    if (loading.parentNode) loading.remove()

    if (currentSimulation) {
      currentSimulation.stop()
      currentSimulation = null
    }

    const nodes = dataset.nodes.map(n => ({ ...n })) as any[]
    const links = dataset.links.map(l => ({ ...l })) as any[]

    if (animate) {
      gRoot.transition().duration(200).style("opacity", 0).on("end", () => {
        gRoot.selectAll("*").remove()
        drawGraph(nodes, links)
        gRoot.style("opacity", 0).transition().duration(300).style("opacity", 1)
      })
    } else {
      gRoot.selectAll("*").remove()
      drawGraph(nodes, links)
    }
  }

  function drawGraph(nodes: any[], links: any[]) {
    const currentW = graphWrap.clientWidth || W

    const simulation = forceSimulation(nodes)
      .force("link", forceLink(links).id((d: any) => d.id).distance(isMobile ? 70 : 105))
      .force("charge", forceManyBody().strength(isMobile ? -200 : -280))
      .force("center", forceCenter(currentW / 2, H / 2))
      .force("collision", forceCollide().radius((d: any) => nodeRadius(d.type) + 9))

    currentSimulation = simulation

    const linkSel = gRoot.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", (d: any) => `url(#kg-arrow-${d.type || "concept"})`)

    const dragBehavior = drag<SVGGElement, any>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x; d.fy = d.y
      })
      .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null; d.fy = null
      })

    const nodeSel = gRoot.append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .call(dragBehavior)

    nodeSel.append("circle")
      .attr("r", (d: any) => nodeRadius(d.type))
      .attr("fill", (d: any) => COLORS[d.type] || "#2c5282")
      .attr("stroke", "rgba(255,255,255,0.3)")
      .attr("stroke-width", 1.5)

    nodeSel.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d: any) => nodeRadius(d.type) + 12)
      .style("font-size", isMobile ? "8px" : "10px")
      .style("font-family", "Inter,system-ui,sans-serif")
      .style("fill", "var(--dark,#1a1a1a)")
      .style("pointer-events", "none")
      .style("user-select", "none")
      .each(function(d: any) {
        const el = select(this)
        const words = d.label.split(" ")
        if (words.length <= 2 || isMobile) {
          el.text(d.label)
        } else {
          el.text(words.slice(0, 2).join(" "))
          el.append("tspan").attr("x", 0).attr("dy", "1.1em").text(words.slice(2).join(" "))
        }
      })

    nodeSel
      .on("mouseover", (_event: any, d: any) => {
        tip.style.display = "block"
        tip.innerHTML = `<strong>${d.label}</strong><br>${d.desc}`
      })
      .on("mousemove", (event: any) => {
        const rect = graphWrap.getBoundingClientRect()
        let x = event.clientX - rect.left + 12
        const y = event.clientY - rect.top - 10
        if (x + 190 > (graphWrap.clientWidth || W)) x -= 200
        tip.style.left = `${x}px`
        tip.style.top = `${y}px`
      })
      .on("mouseout", () => { tip.style.display = "none" })
      .on("click", (_event: any, d: any) => { if (d.href) window.location.href = d.href })
      .on("touchstart", (event: any, d: any) => {
        event.preventDefault()
        tip.style.display = "block"
        tip.innerHTML = `<strong>${d.label}</strong><br>${d.desc}`
        tip.style.left = "50%"
        tip.style.top = "8px"
        tip.style.transform = "translateX(-50%)"
      })

    simulation.on("tick", () => {
      linkSel
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)
      nodeSel.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })
  }

  function switchGraph() {
    tip.style.display = "none"
    updateTitle()
    renderGraph(currentGraphId, true)
  }

  renderGraph(currentGraphId, false)
}

async function tryInit() {
  const el = document.getElementById("ok-knowledge-graphs")
  if (!el) return false
  const loaded = await loadGraphData()
  if (!loaded) return false
  buildKnowledgeGraphs()
  return true
}

document.addEventListener("nav", async () => {
  const el = document.getElementById("ok-knowledge-graphs")
  if (!el) return
  const loaded = await loadGraphData()
  if (!loaded) return
  el.innerHTML = ""
  el.dataset.rendered = ""
  buildKnowledgeGraphs()
})

tryInit()

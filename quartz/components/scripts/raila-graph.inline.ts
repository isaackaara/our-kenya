import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
  select,
  drag,
  zoom,
  zoomIdentity,
} from "d3"

const NODES = [
  { id: "raila",     label: "Raila Odinga",     type: "center",   href: "/Political-Movements/Raila-Odinga",                                        desc: "Kenya's most consequential opposition figure. Five presidential runs." },
  { id: "oginga",    label: "Oginga Odinga",    type: "family",   href: "/Political-Movements/Oginga-Odinga",                                       desc: "Father. Kenya's first Vice President. The original opposition voice." },
  { id: "uhuru",     label: "Uhuru Kenyatta",   type: "alliance", href: "/Presidencies/Uhuru-Kenyatta-Presidency/Uhuru-and-the-Opposition",         desc: "Bitter rival turned ally. The 2018 Handshake reshaped Kenyan politics." },
  { id: "kibaki",    label: "Mwai Kibaki",      type: "rival",    href: "/Presidencies/Mwai-Kibaki-Presidency/Kibaki-and-Uhuru-Kenyatta",           desc: "2007 election rival. The disputed result triggered post-election violence." },
  { id: "ruto",      label: "William Ruto",     type: "rival",    href: "/Trails/The-Hustler%27s-Gambit%3A-William-Ruto",                           desc: "Post-2022 rival. Beat Raila in the 2022 presidential election." },
  { id: "moi",       label: "Daniel arap Moi",  type: "alliance", href: "/Presidencies/Daniel-arap-Moi-Presidency/Moi-and-Raila-Odinga",           desc: "Detained Raila for years. Later formed a political alliance." },
  { id: "kalonzo",   label: "Kalonzo Musyoka",  type: "alliance", href: "/Kamba/Kalonzo-Musyoka-Deep-Dive",                                         desc: "Coalition partner across multiple elections. NASA alliance 2017." },
  { id: "mudavadi",  label: "Musalia Mudavadi", type: "alliance", href: "/Luhya/Musalia-Mudavadi-Deep-Dive",                                        desc: "Coalition partner. CORD and Orange movement ally." },
  { id: "karua",     label: "Martha Karua",     type: "alliance", href: "/Presidencies/Mwai-Kibaki-Presidency/Kibaki-and-Martha-Karua-Iron-Lady",   desc: "NARC ally. Prominent reformist who shared the democracy movement." },
  { id: "matiba",    label: "Kenneth Matiba",   type: "alliance", href: "/Political-Movements/Kenneth-Matiba",                                      desc: "Democracy movement ally. Both fought for multiparty politics in the 1990s." },
  { id: "odm",       label: "ODM Party",        type: "entity",   href: "/Elections/2007-Election/2007-Election-Raila-Odinga-ODM",                  desc: "Orange Democratic Movement. Raila's political vehicle since 2007." },
  { id: "e2007",     label: "2007 Election",    type: "event",    href: "/Trails/When-Kenya-Burned%3A-2007-08",                                     desc: "The disputed election that triggered Kenya's worst post-independence crisis." },
  { id: "handshake", label: "The Handshake",    type: "event",    href: "/Trails/The-Handshake",                                                    desc: "March 2018. Raila and Uhuru end their rivalry and forge a governing deal." },
  { id: "luo",       label: "Luo Community",    type: "entity",   href: "/Luo/Luo",                                                                 desc: "Raila's ethnic base. The lake, the intellect, the long opposition tradition." },
  { id: "au",        label: "AU Commission",    type: "entity",   href: "/Presidencies/Mwai-Kibaki-Presidency/Kibaki-and-the-African-Union-Leadership", desc: "Raila appointed AU Commission Chairperson candidate in 2024." },
]

const LINKS = [
  { source: "raila",  target: "oginga",    type: "family",   label: "father / son" },
  { source: "raila",  target: "uhuru",     type: "alliance", label: "rivals turned allies (Handshake 2018)" },
  { source: "raila",  target: "kibaki",    type: "rival",    label: "2007 election dispute, then coalition" },
  { source: "raila",  target: "ruto",      type: "rival",    label: "rivals post-2022 election" },
  { source: "raila",  target: "moi",       type: "alliance", label: "detained by Moi, later allied" },
  { source: "raila",  target: "kalonzo",   type: "alliance", label: "NASA coalition 2017" },
  { source: "raila",  target: "mudavadi",  type: "alliance", label: "CORD and Orange alliance" },
  { source: "raila",  target: "karua",     type: "alliance", label: "NARC democracy allies" },
  { source: "raila",  target: "matiba",    type: "alliance", label: "multiparty movement allies 1990s" },
  { source: "raila",  target: "odm",       type: "entity",   label: "ODM founder and leader" },
  { source: "raila",  target: "e2007",     type: "event",    label: "disputed presidential candidate" },
  { source: "raila",  target: "handshake", type: "event",    label: "architect of the Handshake deal" },
  { source: "raila",  target: "luo",       type: "entity",   label: "ethnic political base" },
  { source: "raila",  target: "au",        type: "entity",   label: "AU Commission bid 2024" },
  { source: "uhuru",  target: "handshake", type: "event",    label: "co-architect of the Handshake" },
  { source: "kibaki", target: "e2007",     type: "rival",    label: "declared winner, disputed result" },
]

const COLORS: Record<string, string> = {
  center:   "#1a4a2e",
  family:   "#c2603a",
  alliance: "#5a7a5a",
  rival:    "#8b1a1a",
  event:    "#a08a3a",
  entity:   "#3a5a7a",
}

function nodeRadius(type: string) {
  return type === "center" ? 20 : 11
}

function initRailaGraph() {
  const container = document.getElementById("ok-raila-graph")
  if (!container) return
  if (container.dataset.rendered === "1") return
  container.dataset.rendered = "1"

  const W = container.clientWidth || 800
  const isMobile = window.innerWidth < 640
  const H = isMobile ? 280 : 400

  container.style.cssText = `width:100%;height:${H}px;position:relative;overflow:hidden;border-radius:8px;background:var(--light,#f8f6f1)`

  // Tooltip
  const tip = document.createElement("div")
  tip.style.cssText =
    "position:absolute;pointer-events:none;background:rgba(20,20,20,0.88);color:#fff;padding:6px 10px;border-radius:5px;font-size:11px;line-height:1.4;max-width:180px;display:none;z-index:100"
  container.appendChild(tip)

  // Deep-clone node/link data so simulation doesn't mutate constants
  const nodes = NODES.map((n) => ({ ...n })) as any[]
  const links = LINKS.map((l) => ({ ...l })) as any[]

  const svg = select(container).append("svg").attr("width", "100%").attr("height", H).style("display", "block")
  const g = svg.append("g")

  // Zoom
  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.4, 3])
    .on("zoom", (event) => g.attr("transform", event.transform))
  svg.call(zoomBehavior as any)

  // Arrow markers
  const defs = svg.append("defs")
  Object.entries(COLORS).forEach(([type, color]) => {
    defs
      .append("marker")
      .attr("id", `rg-arrow-${type}`)
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 18)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L8,0L0,4")
      .attr("fill", color)
      .attr("opacity", 0.6)
  })

  const simulation = forceSimulation(nodes)
    .force("link", forceLink(links).id((d: any) => d.id).distance(isMobile ? 70 : 100))
    .force("charge", forceManyBody().strength(isMobile ? -200 : -300))
    .force("center", forceCenter(W / 2, H / 2))
    .force("collision", forceCollide().radius((d: any) => nodeRadius(d.type) + 8))

  const link = g
    .append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", (d: any) => COLORS[d.type] || "#888")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.5)
    .attr("marker-end", (d: any) => `url(#rg-arrow-${d.type})`)

  const dragBehavior = drag<SVGGElement, any>()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    })
    .on("drag", (event, d) => {
      d.fx = event.x
      d.fy = event.y
    })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    })

  const node = g.append("g").selectAll("g").data(nodes).enter().append("g").style("cursor", "pointer").call(dragBehavior)

  node
    .append("circle")
    .attr("r", (d: any) => nodeRadius(d.type))
    .attr("fill", (d: any) => COLORS[d.type] || "#888")
    .attr("stroke", "rgba(255,255,255,0.3)")
    .attr("stroke-width", 1.5)

  node
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", (d: any) => nodeRadius(d.type) + 12)
    .style("font-size", isMobile ? "8px" : "10px")
    .style("font-family", "Inter,system-ui,sans-serif")
    .style("fill", "var(--dark,#1a1a1a)")
    .style("pointer-events", "none")
    .style("user-select", "none")
    .each(function (d: any) {
      const el = select(this)
      const words = d.label.split(" ")
      if (words.length <= 2 || isMobile) {
        el.text(d.label)
      } else {
        el.text(words.slice(0, 2).join(" "))
        el.append("tspan").attr("x", 0).attr("dy", "1.1em").text(words.slice(2).join(" "))
      }
    })

  node
    .on("mouseover", (_event: any, d: any) => {
      tip.style.display = "block"
      tip.innerHTML = `<strong>${d.label}</strong><br>${d.desc}`
    })
    .on("mousemove", (event: any) => {
      const rect = container.getBoundingClientRect()
      let x = event.clientX - rect.left + 12
      const y = event.clientY - rect.top - 10
      if (x + 190 > W) x -= 200
      tip.style.left = `${x}px`
      tip.style.top = `${y}px`
    })
    .on("mouseout", () => {
      tip.style.display = "none"
    })
    .on("click", (_event: any, d: any) => {
      if (d.href) window.location.href = d.href
    })

  node.on("touchstart", (event: any, d: any) => {
    event.preventDefault()
    tip.style.display = "block"
    tip.innerHTML = `<strong>${d.label}</strong><br>${d.desc}`
    tip.style.left = "50%"
    tip.style.top = "8px"
    tip.style.transform = "translateX(-50%)"
  })

  simulation.on("tick", () => {
    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y)
    node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
  })

  // Legend
  const legendItems = [
    { type: "center",   label: "Raila" },
    { type: "family",   label: "Family" },
    { type: "alliance", label: "Alliance" },
    { type: "rival",    label: "Rival" },
    { type: "event",    label: "Event" },
    { type: "entity",   label: "Entity" },
  ]
  const legend = svg.append("g").attr("transform", `translate(8,${H - 8})`)
  legendItems.forEach((item, i) => {
    const row = legend.append("g").attr("transform", `translate(${i * (isMobile ? 50 : 68)},0)`)
    row.append("circle").attr("r", 5).attr("cx", 5).attr("cy", -5).attr("fill", COLORS[item.type])
    row
      .append("text")
      .attr("x", 13)
      .attr("y", -1)
      .style("font-size", isMobile ? "7px" : "9px")
      .style("font-family", "Inter,system-ui,sans-serif")
      .style("fill", "var(--dark,#1a1a1a)")
      .text(item.label)
  })
}

function tryInit() {
  const el = document.getElementById("ok-raila-graph")
  if (el) {
    initRailaGraph()
    return true
  }
  return false
}

document.addEventListener("nav", () => {
  const el = document.getElementById("ok-raila-graph")
  if (el) {
    el.dataset.rendered = ""
    initRailaGraph()
  }
})

if (!tryInit()) {
  setTimeout(tryInit, 100)
  if (document.readyState !== "complete") {
    window.addEventListener("load", tryInit)
  }
}

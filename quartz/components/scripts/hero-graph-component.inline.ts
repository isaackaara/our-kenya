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

interface HGNode {
  id: string
  label: string
  type: string
  href?: string
  desc?: string
}

interface HGLink {
  source: string
  target: string
  type: string
  label?: string
}

const COLORS: Record<string, string> = {
  center:   "#1a1a1a",
  primary:  "#666666",
  secondary: "#999999",
}

function nodeRadius(type: string) {
  return type === "center" ? 20 : type === "primary" ? 11 : 7
}

const GRAPH_DATA = {
  kenya: {
    id: "kenya",
    label: "Kenya",
    nodes: [
      { id: "kenya",     label: "Kenya",              type: "center",   href: "/Kenya", desc: "The nation. A history of kingdoms, empires, nations." },
      { id: "elections", label: "Elections",          type: "primary",  href: "/Elections", desc: "13 general elections from 1963 to 2022." },
      { id: "presidencies", label: "Presidencies",    type: "primary",  href: "/Presidencies", desc: "Five presidents. Six decades of power." },
      { id: "corruption",label: "Corruption",         type: "primary",  href: "/Corruption", desc: "Goldenberg. Anglo-Leasing. The scandals that define an era." },
      { id: "colonial",  label: "Colonial Kenya",     type: "primary",  href: "/Colonial-Kenya", desc: "1895-1963. The making of a colony and its cost." },
      { id: "conservation", label: "Conservation",    type: "primary",  href: "/Conservation", desc: "Wangari. Richard Leakey. The fight for Kenya's wildlifeFocus." },
      { id: "politics",  label: "Political Movements",type: "primary",  href: "/Political-Movements", desc: "Raila. Tom Mboya. Oginga. The forces that shaped the nation." },
      { id: "ethnic",    label: "Ethnic Groups",      type: "primary",  href: "/Kikuyu", desc: "Kikuyu, Luo, Luhya, Kamba, Kalenjin, Maasai, Somali, Swahili, and more." },
      { id: "e1",        label: "2007 Election",      type: "secondary", href: "/Trails/When-Kenya-Burned%3A-2007-08", desc: "The disputed election that triggered post-election violence." },
      { id: "e2",        label: "Mau Mau",            type: "secondary", href: "/Trails/Mau-Mau:-The-Forest-War", desc: "The armed uprising that made British rule untenable." },
      { id: "e3",        label: "Independence",       type: "secondary", href: "/Presidencies/Jomo-Kenyatta-Presidency", desc: "1963. Uhuru. The moment a nation was born." },
      { id: "e4",        label: "The Handshake",      type: "secondary", href: "/Trails/The-Handshake", desc: "2018. Raila and Uhuru end their rivalry." },
      { id: "p1",        label: "Jomo Kenyatta",      type: "secondary", href: "/Kikuyu/Jomo-Kenyatta", desc: "Founding father. Founding president. Complex, contested, consequential." },
      { id: "p2",        label: "Raila Odinga",       type: "secondary", href: "/Political-Movements/Raila-Odinga", desc: "The man who might have been president. Five times he ran." },
      { id: "p3",        label: "Daniel arap Moi",    type: "secondary", href: "/Presidencies/Daniel-arap-Moi-Presidency", desc: "24 years. Single-party rule. The man who wouldn't let go." },
      { id: "c1",        label: "Goldenberg Scandal", type: "secondary", href: "/Corruption/Goldenberg-Scandal", desc: "The gold scam that cost Kenya billions." },
      { id: "c2",        label: "Anglo-Leasing",      type: "secondary", href: "/Corruption/Anglo-Leasing", desc: "Phantom military contracts. Real money. No accountability." },
      { id: "co1",       label: "White Highlands",    type: "secondary", href: "/Trails/The-Land-Question", desc: "The theft that triggered everything. Land taken from Kikuyu." },
      { id: "co2",       label: "Lancaster House",    type: "secondary", href: "/Political-Movements/The-Lancaster-House-Conferences", desc: "The London negotiations where independence was negotiated." },
      { id: "con1",      label: "Green Belt Movement",type: "secondary", href: "/Conservation/Green-Belt-Movement", desc: "Wangari Maathai. 30 million trees planted by women." },
      { id: "con2",      label: "Ivory Ban 1989",     type: "secondary", href: "/Conservation/Conservation-Timeline-Kenya", desc: "Richard Leakey. 12 tonnes burned on camera." },
      { id: "pol1",      label: "Tom Mboya",          type: "secondary", href: "/Political-Movements/Tom-Mboya", desc: "Labour organiser. KANU architect. Assassinated 1969." },
      { id: "pol2",      label: "Oginga Odinga",      type: "secondary", href: "/Political-Movements/Oginga-Odinga", desc: "First VP. The original opposition voice." },
      { id: "eth1",      label: "Kikuyu History",     type: "secondary", href: "/Kikuyu/Kikuyu", desc: "Land, resistance, independence, and the dominant political tradition." },
      { id: "eth2",      label: "Luo Community",      type: "secondary", href: "/Luo/Luo", desc: "The lake, the intellect, Oginga, Raila, and the long opposition." },
    ] as HGNode[],
    links: [
      { source: "kenya", target: "elections",   type: "primary",  label: "13 elections" },
      { source: "kenya", target: "presidencies", type: "primary",  label: "5 presidents" },
      { source: "kenya", target: "corruption",   type: "primary",  label: "scandals" },
      { source: "kenya", target: "colonial",     type: "primary",  label: "colonial era" },
      { source: "kenya", target: "conservation", type: "primary",  label: "conservation" },
      { source: "kenya", target: "politics",     type: "primary",  label: "political movements" },
      { source: "kenya", target: "ethnic",       type: "primary",  label: "ethnic groups" },
      { source: "elections", target: "e1",       type: "secondary", label: "" },
      { source: "elections", target: "e2",       type: "secondary", label: "" },
      { source: "elections", target: "e3",       type: "secondary", label: "" },
      { source: "elections", target: "e4",       type: "secondary", label: "" },
      { source: "presidencies", target: "p1",    type: "secondary", label: "" },
      { source: "presidencies", target: "p2",    type: "secondary", label: "" },
      { source: "presidencies", target: "p3",    type: "secondary", label: "" },
      { source: "corruption", target: "c1",      type: "secondary", label: "" },
      { source: "corruption", target: "c2",      type: "secondary", label: "" },
      { source: "colonial", target: "co1",       type: "secondary", label: "" },
      { source: "colonial", target: "co2",       type: "secondary", label: "" },
      { source: "conservation", target: "con1",  type: "secondary", label: "" },
      { source: "conservation", target: "con2",  type: "secondary", label: "" },
      { source: "politics", target: "pol1",      type: "secondary", label: "" },
      { source: "politics", target: "pol2",      type: "secondary", label: "" },
      { source: "ethnic", target: "eth1",        type: "secondary", label: "" },
      { source: "ethnic", target: "eth2",        type: "secondary", label: "" },
    ] as HGLink[],
  }
}

let currentSimulation: any = null

function cleanupHeroGraph() {
  if (currentSimulation) {
    currentSimulation.stop()
    currentSimulation = null
  }
}

export default function initHeroGraph() {
  const container = document.getElementById("ok-hero-graph-root")
  if (!container || !window.d3) return

  // Clean up previous simulation on SPA navigation
  if (typeof window.addCleanup === "function") {
    window.addCleanup(cleanupHeroGraph)
  }

  const isMobile = window.innerWidth < 640
  const H = isMobile ? 280 : 400
  const W = container.clientWidth || 800

  // Wrapper
  const graphWrap = document.createElement("div")
  graphWrap.style.cssText = [
    "width:100%",
    `height:${H}px`,
    "position:relative",
    "overflow:hidden",
    "border-radius:8px",
    "background:var(--light,#f8f6f1)",
  ].join(";")
  container.appendChild(graphWrap)

  // SVG
  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svgEl.setAttribute("width", "100%")
  svgEl.setAttribute("height", String(H))
  svgEl.style.display = "block"
  graphWrap.appendChild(svgEl)

  const svg = select(svgEl)
  const gRoot = svg.append("g").attr("class", "kg-root")

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

  function renderGraph() {
    const dataset = GRAPH_DATA.kenya
    const nodes = dataset.nodes.map(n => ({ ...n })) as any[]
    const links = dataset.links.map(l => ({ ...l })) as any[]

    if (currentSimulation) {
      currentSimulation.stop()
      currentSimulation = null
    }

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
      .attr("fill", (d: any) => COLORS[d.type] || "#666")
      .attr("opacity", 0.8)

    simulation.on("tick", () => {
      linkSel
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      nodeSel.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })
  }

  renderGraph()
}

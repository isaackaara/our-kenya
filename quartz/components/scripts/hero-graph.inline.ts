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

interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  label: string
  type: "center" | "primary" | "secondary"
  color: string
  size: number
  fx?: number
  fy?: number
}

interface GraphLink {
  source: string | GraphNode
  target: string | GraphNode
  type: string
  strength: number
}

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

function initializeHeroGraph(): void {
  ;(async () => {
  const container = document.getElementById("hero-graph-container")
  if (!container) return

  // Load graph data
  let data: GraphData
  try {
    const response = await fetch("/data/hero-graph.json")
    data = await response.json()
  } catch (err) {
    console.error("Failed to load graph data:", err)
    return
  }

  const rect = container.getBoundingClientRect()
  const width = Math.max(rect.width, 400)
  const height = Math.max(rect.height, 400)

  // Create SVG
  const svg = select(container)
    .append("svg")
    .attr("class", "hero-graph")
    .attr("width", width)
    .attr("height", height)

  // Create nodes and links with type-aware handling
  const nodes: GraphNode[] = data.nodes.map((d) => ({
    ...d,
    x: width / 2,
    y: height / 2,
  }))

  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  const links: any[] = data.links.map((d) => ({
    ...d,
    source:
      typeof d.source === "string"
        ? nodeMap.get(d.source as string)!
        : (d.source as GraphNode),
    target:
      typeof d.target === "string"
        ? nodeMap.get(d.target as string)!
        : (d.target as GraphNode),
  }))

  // Pin Kenya node in center
  const kenyaNode = nodes.find((n) => n.id === "Kenya")
  if (kenyaNode) {
    kenyaNode.fx = width / 2
    kenyaNode.fy = height / 2
  }

  // Create force simulation
  const simulation = forceSimulation(nodes)
    .force("link", forceLink(links).distance(80).strength(0.4))
    .force("charge", forceManyBody().strength(-300).distanceMax(500))
    .force("center", forceCenter(width / 2, height / 2).strength(0.05))
    .force("collide", forceCollide().radius((d: any) => d.size + 2))

  // Create group for zoomable content
  const g = svg.append("g")

  // Add zoom behavior
  const zoomBehavior = zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
    g.attr("transform", event.transform)
  })

  svg.call(zoomBehavior)

  // Add links
  const linkElements = g
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "#ccc")
    .attr("stroke-width", (d: any) => (d.type === "primary" ? 2 : 1))
    .attr("stroke-opacity", 0.4)

  // Add nodes
  const nodeElements = g
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", (d: any) => d.size)
    .attr("fill", (d: any) => d.color)
    .attr("opacity", 0.85)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .attr("class", (d: any) => `node node-${d.type}`)
    .style("cursor", "pointer")
    .on("click", (event, d: any) => {
      event.stopPropagation()
      // Navigate to node page (optional)
      if (d.type !== "center") {
        // const slug = d.id.toLowerCase().replace(/\s+/g, "-")
        // Uncomment to enable navigation:
        // window.location.href = `/${slug}`
      }
    })
    .on("mouseenter", (_event, d: any) => {
      // Highlight connected nodes
      linkElements.style("stroke-opacity", (link: any) => {
        return link.source.id === d.id || link.target.id === d.id ? 0.8 : 0.1
      })
      nodeElements.style("opacity", (node: any) => {
        if (node.id === d.id) return 1
        const connected = links.some(
          (l: any) =>
            (l.source.id === d.id && l.target.id === node.id) ||
            (l.target.id === d.id && l.source.id === node.id)
        )
        return connected ? 0.85 : 0.3
      })
    })
    .on("mouseleave", () => {
      linkElements.style("stroke-opacity", 0.4)
      nodeElements.style("opacity", 0.85)
    })
    .call(
      drag<SVGCircleElement, GraphNode>()
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
          if (d.type !== "center") {
            d.fx = undefined
            d.fy = undefined
          }
        })
    )

  // Add labels (only for center and primary nodes)
  const labelElements = g
    .selectAll("text")
    .data(nodes.filter((n) => n.type === "center" || n.type === "primary"))
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".3em")
    .attr("font-size", (d: any) => (d.type === "center" ? 14 : 10))
    .attr("font-weight", (d: any) => (d.type === "center" ? "bold" : "normal"))
    .attr("fill", "#fff")
    .attr("pointer-events", "none")
    .text((d: any) => d.label)

  // Progressive rendering
  setTimeout(() => {
    nodeElements.style("opacity", (d: any) => (d.type === "center" ? 0.95 : 0))
    labelElements.style("opacity", (d: any) => (d.type === "center" ? 1 : 0))
  }, 50)

  setTimeout(() => {
    nodeElements.style("opacity", (d: any) => (d.type !== "secondary" ? 0.85 : 0))
    labelElements.style("opacity", (d: any) => (d.type !== "secondary" ? 1 : 0))
    linkElements.style("opacity", (l: any) => (l.type !== "secondary" ? 0.4 : 0))
  }, 150)

  setTimeout(() => {
    nodeElements.style("opacity", 0.85)
    linkElements.style("opacity", 0.4)
  }, 300)

  // Update positions on tick
  simulation.on("tick", () => {
    linkElements
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y)

    nodeElements.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

    labelElements.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
  })

  // Gentle drift animation
  const driftAnimation = () => {
    nodeElements.each((d: any) => {
      if (d.type !== "center") {
        d.fx = (d.fx || d.x) + (Math.random() - 0.5) * 0.5
        d.fy = (d.fy || d.y) + (Math.random() - 0.5) * 0.5
      }
    })
    simulation.alpha(0.01).restart()
    setTimeout(driftAnimation, 3000)
  }
  driftAnimation()

  // Handle window resize
  const handleResize = () => {
    const newRect = container.getBoundingClientRect()
    const newWidth = Math.max(newRect.width, 400)
    const newHeight = Math.max(newRect.height, 400)

    svg.attr("width", newWidth).attr("height", newHeight)

    simulation
      .force("center", forceCenter(newWidth / 2, newHeight / 2))
      .alpha(0.1)
      .restart()
  }

  window.addEventListener("resize", handleResize)
  })()
}

export default initializeHeroGraph

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import styles from './HeroGraph.module.css'

interface Node {
  id: string
  label: string
  type: 'center' | 'primary' | 'secondary'
  category?: string
  level: number
  x?: number
  y?: number
  vx?: number
  vy?: number
}

interface Link {
  source: string | Node
  target: string | Node
}

interface GraphData {
  nodes: Node[]
  links: Link[]
  nodesByLevel: {
    center: Node[]
    primary: Node[]
    secondary: Node[]
  }
  stats: {
    totalNodes: number
    centerNodes: number
    primaryNodes: number
    secondaryNodes: number
    totalLinks: number
  }
}

export default function HeroGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null)

  // Load graph data
  useEffect(() => {
    const loadGraphData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/graph-data.json')
        if (!response.ok) throw new Error('Failed to load graph data')
        const data = await response.json()
        setGraphData(data)
      } catch (error) {
        console.error('Error loading graph data:', error)
        setIsLoading(false)
      }
    }

    loadGraphData()
  }, [])

  // Render graph
  useEffect(() => {
    if (!graphData || !svgRef.current || !containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight || 600

    // Clear existing SVG
    d3.select(svgRef.current).selectAll('*').remove()

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)

    // Add background
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', '#faf8f8').attr('class', styles.background)

    // Create container for zoom/pan
    const g = svg.append('g').attr('class', styles.container)

    // Prepare nodes with proper typing
    const nodes: Node[] = graphData.nodes.map((d) => ({
      ...d,
      x: Math.random() * width,
      y: Math.random() * height,
    }))

    // Prepare links with proper references
    const links: Link[] = graphData.links.map((d: any) => ({
      source: typeof d.source === 'string' ? nodes.find((n) => n.id === d.source)! : d.source,
      target: typeof d.target === 'string' ? nodes.find((n) => n.id === d.target)! : d.target,
    }))

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(links as any).id((d: any) => d.id).distance(40))
      .force('charge', d3.forceManyBody().strength((d: any) => {
        if (d.type === 'center') return -500
        if (d.type === 'primary') return -200
        return -50
      }))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.1))
      .force('collision', d3.forceCollide().radius((d: any) => {
        if (d.type === 'center') return 40
        if (d.type === 'primary') return 25
        return 15
      }))

    simulationRef.current = simulation

    // Draw links first (so they appear behind nodes)
    const link = g
      .selectAll('.link')
      .data(links, (d: any, i) => i)
      .enter()
      .append('line')
      .attr('class', styles.link)
      .attr('stroke', '#b8b8b8')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1)

    // Draw nodes
    const node = g
      .selectAll('.node')
      .data(nodes, (d: any) => d.id)
      .enter()
      .append('g')
      .attr('class', styles.node)
      .call(
        d3
          .drag<SVGGElement, Node>()
          .on('start', dragStarted)
          .on('drag', dragged)
          .on('end', dragEnded)
      )

    // Node circles
    node
      .append('circle')
      .attr('r', (d) => {
        if (d.type === 'center') return 30
        if (d.type === 'primary') return 18
        return 10
      })
      .attr('fill', (d) => {
        if (d.type === 'center') return '#006B3F'
        if (d.type === 'primary') return '#BB0000'
        return '#84a59d'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', styles.circle)

    // Node labels (only for center and primary nodes)
    node
      .filter((d) => d.type !== 'secondary')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('font-size', (d) => (d.type === 'center' ? '16px' : '11px'))
      .attr('font-weight', (d) => (d.type === 'center' ? 'bold' : '600'))
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')
      .text((d) => d.label)
      .attr('class', styles.label)

    // Interactive behaviors
    node.on('click', function (event, d) {
      event.stopPropagation()
      setSelectedNode(d)
      // Navigate to node's page if applicable
      if (d.id !== 'Kenya') {
        const slug = d.label.toLowerCase().replace(/\s+/g, '-')
        window.location.href = `/${slug}`
      }
    }).on('mouseenter', function (event, d) {
      // Highlight connected nodes
      link.attr('stroke-opacity', (l: any) => 
        (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.1
      )
      node.select('circle').attr('opacity', (n: any) =>
        n.id === d.id || 
        links.some((l: any) => 
          (l.source.id === n.id && l.target.id === d.id) ||
          (l.target.id === n.id && l.source.id === d.id)
        ) ? 1 : 0.3
      )
    }).on('mouseleave', function () {
      link.attr('stroke-opacity', 0.4)
      node.select('circle').attr('opacity', 1)
    })

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x || 0)
        .attr('y1', (d: any) => d.source.y || 0)
        .attr('x2', (d: any) => d.target.x || 0)
        .attr('y2', (d: any) => d.target.y || 0)

      node.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`)
    })

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
      g.attr('transform', event.transform)
    })

    svg.call(zoom)

    // Reset zoom on double-click
    svg.on('dblclick.zoom', function () {
      svg.transition().duration(750).call(zoom.transform as any, d3.zoomIdentity.translate(0, 0))
    })

    // Drag functions
    function dragStarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragEnded(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Progressive rendering animations
    setTimeout(() => {
      node.filter((d) => d.type === 'primary').attr('opacity', 0).transition().duration(600).attr('opacity', 1)
      link
        .filter((l: any) => l.source.type === 'primary' || l.target.type === 'primary')
        .attr('opacity', 0)
        .transition()
        .duration(600)
        .attr('opacity', 1)
    }, 200)

    setTimeout(() => {
      node.filter((d) => d.type === 'secondary').attr('opacity', 0).transition().duration(800).attr('opacity', 1)
      link
        .filter((l: any) => l.source.type === 'secondary' || l.target.type === 'secondary')
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .attr('opacity', 1)
    }, 400)

    setIsLoading(false)

    return () => {
      simulation.stop()
    }
  }, [graphData])

  return (
    <div className={styles.heroGraphContainer} ref={containerRef}>
      {isLoading && (
        <div className={styles.splashScreen}>
          <div className={styles.loaderContent}>
            <div className={styles.loader}></div>
            <h2>Loading Kenya's Knowledge Graph</h2>
            <p>Connecting {graphData?.stats.totalNodes || '10,000'} topics across history, culture, and innovation</p>
          </div>
        </div>
      )}
      <svg ref={svgRef} className={styles.svg}></svg>
      {selectedNode && selectedNode.id !== 'Kenya' && (
        <div className={styles.nodeInfo}>
          <button className={styles.closeBtn} onClick={() => setSelectedNode(null)}>
            &times;
          </button>
          <h3>{selectedNode.label}</h3>
          {selectedNode.category && <p className={styles.category}>{selectedNode.category}</p>}
          <button className={styles.explorerBtn} onClick={() => (window.location.href = `/${selectedNode.label.toLowerCase().replace(/\s+/g, '-')}`)}>
            Explore this topic
          </button>
        </div>
      )}
    </div>
  )
}

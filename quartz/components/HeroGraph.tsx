import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const HeroGraph: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  const d3Script = `
(async function() {
  if (typeof d3 === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://d3js.org/d3.v7.min.js';
    script.onload = initHeroGraph;
    document.head.appendChild(script);
  } else {
    initHeroGraph();
  }
  
  function initHeroGraph() {
    const container = document.getElementById('ok-hero-graph-root');
    if (!container || !window.d3) return;
    
    const isMobile = window.innerWidth < 640;
    const H = isMobile ? 280 : 400;
    const W = container.clientWidth || 800;
    
    const graphWrap = document.createElement('div');
    graphWrap.style.cssText = 'width:100%;height:' + H + 'px;position:relative;overflow:hidden;border-radius:8px;background:var(--light,#f8f6f1);';
    container.appendChild(graphWrap);
    
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('width', '100%');
    svgEl.setAttribute('height', String(H));
    svgEl.style.display = 'block';
    graphWrap.appendChild(svgEl);
    
    const svg = d3.select(svgEl);
    const gRoot = svg.append('g').attr('class', 'kg-root');
    
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.3, 3])
      .filter((event) => {
        if (event.type === 'wheel') return event.ctrlKey || event.metaKey;
        return !event.button;
      })
      .on('zoom', (event) => gRoot.attr('transform', event.transform));
    svg.call(zoomBehavior);
    svgEl.addEventListener('wheel', (e) => { if (!e.ctrlKey && !e.metaKey) e.stopPropagation(); }, { passive: true });
    
    const nodes = [
      { id: 'kenya', label: 'Kenya', type: 'center' },
      { id: 'elections', label: 'Elections', type: 'primary' },
      { id: 'presidencies', label: 'Presidencies', type: 'primary' },
      { id: 'corruption', label: 'Corruption', type: 'primary' },
      { id: 'colonial', label: 'Colonial Kenya', type: 'primary' },
      { id: 'conservation', label: 'Conservation', type: 'primary' },
      { id: 'politics', label: 'Political Movements', type: 'primary' },
      { id: 'ethnic', label: 'Ethnic Groups', type: 'primary' },
      { id: 'e1', type: 'secondary' },
      { id: 'e2', type: 'secondary' },
      { id: 'p1', type: 'secondary' },
      { id: 'p2', type: 'secondary' },
      { id: 'c1', type: 'secondary' },
      { id: 'c2', type: 'secondary' },
      { id: 'co1', type: 'secondary' },
      { id: 'co2', type: 'secondary' },
      { id: 'con1', type: 'secondary' },
      { id: 'con2', type: 'secondary' },
      { id: 'pol1', type: 'secondary' },
      { id: 'pol2', type: 'secondary' },
      { id: 'eth1', type: 'secondary' },
      { id: 'eth2', type: 'secondary' },
    ];
    
    const links = [
      { source: 'kenya', target: 'elections' },
      { source: 'kenya', target: 'presidencies' },
      { source: 'kenya', target: 'corruption' },
      { source: 'kenya', target: 'colonial' },
      { source: 'kenya', target: 'conservation' },
      { source: 'kenya', target: 'politics' },
      { source: 'kenya', target: 'ethnic' },
      { source: 'elections', target: 'e1' },
      { source: 'elections', target: 'e2' },
      { source: 'presidencies', target: 'p1' },
      { source: 'presidencies', target: 'p2' },
      { source: 'corruption', target: 'c1' },
      { source: 'corruption', target: 'c2' },
      { source: 'colonial', target: 'co1' },
      { source: 'colonial', target: 'co2' },
      { source: 'conservation', target: 'con1' },
      { source: 'conservation', target: 'con2' },
      { source: 'politics', target: 'pol1' },
      { source: 'politics', target: 'pol2' },
      { source: 'ethnic', target: 'eth1' },
      { source: 'ethnic', target: 'eth2' },
    ];
    
    const nodeData = nodes.map(n => ({ ...n }));
    const linkData = links.map(l => ({ ...l }));
    
    const simulation = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(linkData).id(d => d.id).distance(isMobile ? 70 : 105))
      .force('charge', d3.forceManyBody().strength(isMobile ? -200 : -280))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide().radius(d => {
        if (d.type === 'center') return 20 + 9;
        if (d.type === 'primary') return 11 + 9;
        return 7 + 9;
      }));
    
    const linkSel = gRoot.append('g')
      .selectAll('line')
      .data(linkData)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);
    
    const dragBehavior = d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null; d.fy = null;
      });
    
    const nodeSel = gRoot.append('g')
      .selectAll('circle')
      .data(nodeData)
      .enter()
      .append('circle')
      .attr('r', d => d.type === 'center' ? 20 : d.type === 'primary' ? 11 : 7)
      .attr('fill', d => d.type === 'center' ? '#1a1a1a' : '#666')
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
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
})();
`;

  return (
    <>
      <div
        class={displayClass}
        id="ok-hero-graph-root"
        style={{ width: "100%", margin: "2rem 0" }}
      ></div>
      <script dangerouslySetInnerHTML={{ __html: d3Script }} />
    </>
  )
}

export default (() => HeroGraph) satisfies QuartzComponentConstructor

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const HeroGraph: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  const d3Script = `
(async function() {
  if (typeof d3 === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://d3js.org/d3.v7.min.js';
    script.onload = setupScrollTrigger;
    document.head.appendChild(script);
  } else {
    setupScrollTrigger();
  }
  
  function setupScrollTrigger() {
    const container = document.getElementById('ok-hero-graph-root');
    if (!container) return;
    
    let initialized = false;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !initialized) {
        initialized = true;
        observer.unobserve(container);
        initHeroGraph();
      }
    }, { threshold: 0.1 });
    
    observer.observe(container);
  }
  
  function initHeroGraph() {
    const container = document.getElementById('ok-hero-graph-root');
    if (!container || !window.d3) return;
    
    const isMobile = window.innerWidth < 640;
    const H = isMobile ? 300 : 500;
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
    const gRoot = svg.append('g').attr('class', 'kg-root').attr('transform', 'translate(0,0) scale(0.7)');
    
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.2, 4])
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
      { id: 'sports', label: 'Sports', type: 'primary' },
      { id: 'tech', label: 'Technology', type: 'primary' },
      { id: 'coast', label: 'Swahili Coast', type: 'primary' },
      { id: 'e1', label: '2007 PEV', type: 'secondary' },
      { id: 'e2', label: 'Independence', type: 'secondary' },
      { id: 'e3', label: 'The Handshake', type: 'secondary' },
      { id: 'p1', label: 'Jomo Kenyatta', type: 'secondary' },
      { id: 'p2', label: 'Raila Odinga', type: 'secondary' },
      { id: 'p3', label: 'Daniel arap Moi', type: 'secondary' },
      { id: 'c1', label: 'Goldenberg', type: 'secondary' },
      { id: 'c2', label: 'Anglo-Leasing', type: 'secondary' },
      { id: 'co1', label: 'White Highlands', type: 'secondary' },
      { id: 'co2', label: 'Mau Mau', type: 'secondary' },
      { id: 'co3', label: 'Lancaster House', type: 'secondary' },
      { id: 'con1', label: 'Green Belt', type: 'secondary' },
      { id: 'con2', label: 'Ivory Ban', type: 'secondary' },
      { id: 'con3', label: 'Richard Leakey', type: 'secondary' },
      { id: 'pol1', label: 'Tom Mboya', type: 'secondary' },
      { id: 'pol2', label: 'Oginga Odinga', type: 'secondary' },
      { id: 'pol3', label: 'Wangari Maathai', type: 'secondary' },
      { id: 'eth1', label: 'Kikuyu', type: 'secondary' },
      { id: 'eth2', label: 'Luo', type: 'secondary' },
      { id: 'eth3', label: 'Luhya', type: 'secondary' },
      { id: 'eth4', label: 'Kalenjin', type: 'secondary' },
      { id: 's1', label: 'Marathon Champions', type: 'secondary' },
      { id: 's2', label: 'Safari Rally', type: 'secondary' },
      { id: 's3', label: 'Harambee Stars', type: 'secondary' },
      { id: 't1', label: 'M-Pesa', type: 'secondary' },
      { id: 't2', label: 'Silicon Savannah', type: 'secondary' },
      { id: 't3', label: 'Safaricom', type: 'secondary' },
      { id: 'co4', label: 'Mombasa', type: 'secondary' },
      { id: 'co5', label: 'Lamu Island', type: 'secondary' },
      { id: 'co6', label: 'Arab Traders', type: 'secondary' },
      { id: 'legacy1', label: 'Land Question', type: 'secondary' },
      { id: 'legacy2', label: 'Independence Dream', type: 'secondary' },
      { id: 'legacy3', label: 'Urban Language', type: 'secondary' },
      { id: 'legacy4', label: 'Diaspora', type: 'secondary' },
    ];
    
    const links = [
      { source: 'kenya', target: 'elections' },
      { source: 'kenya', target: 'presidencies' },
      { source: 'kenya', target: 'corruption' },
      { source: 'kenya', target: 'colonial' },
      { source: 'kenya', target: 'conservation' },
      { source: 'kenya', target: 'politics' },
      { source: 'kenya', target: 'ethnic' },
      { source: 'kenya', target: 'sports' },
      { source: 'kenya', target: 'tech' },
      { source: 'kenya', target: 'coast' },
      { source: 'elections', target: 'e1' },
      { source: 'elections', target: 'e2' },
      { source: 'elections', target: 'e3' },
      { source: 'presidencies', target: 'p1' },
      { source: 'presidencies', target: 'p2' },
      { source: 'presidencies', target: 'p3' },
      { source: 'corruption', target: 'c1' },
      { source: 'corruption', target: 'c2' },
      { source: 'colonial', target: 'co1' },
      { source: 'colonial', target: 'co2' },
      { source: 'colonial', target: 'co3' },
      { source: 'conservation', target: 'con1' },
      { source: 'conservation', target: 'con2' },
      { source: 'conservation', target: 'con3' },
      { source: 'politics', target: 'pol1' },
      { source: 'politics', target: 'pol2' },
      { source: 'politics', target: 'pol3' },
      { source: 'ethnic', target: 'eth1' },
      { source: 'ethnic', target: 'eth2' },
      { source: 'ethnic', target: 'eth3' },
      { source: 'ethnic', target: 'eth4' },
      { source: 'sports', target: 's1' },
      { source: 'sports', target: 's2' },
      { source: 'sports', target: 's3' },
      { source: 'tech', target: 't1' },
      { source: 'tech', target: 't2' },
      { source: 'tech', target: 't3' },
      { source: 'coast', target: 'co4' },
      { source: 'coast', target: 'co5' },
      { source: 'coast', target: 'co6' },
      { source: 'kenya', target: 'legacy1' },
      { source: 'kenya', target: 'legacy2' },
      { source: 'kenya', target: 'legacy3' },
      { source: 'kenya', target: 'legacy4' },
    ];
    
    const nodeData = nodes.map(n => ({ ...n }));
    const linkData = links.map(l => ({ ...l }));
    
    const simulation = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(linkData).id(d => d.id).distance(d => d.source.type === 'center' || d.target.type === 'center' ? 120 : 80))
      .force('charge', d3.forceManyBody().strength(d => d.type === 'center' ? -500 : -300))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide().radius(d => {
        if (d.type === 'center') return 25;
        if (d.type === 'primary') return 15;
        return 10;
      }));
    
    const linkSel = gRoot.append('g')
      .selectAll('line')
      .data(linkData)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.5);
    
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
      .selectAll('g')
      .data(nodeData)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .call(dragBehavior);
    
    nodeSel.append('circle')
      .attr('r', d => d.type === 'center' ? 20 : d.type === 'primary' ? 11 : 7)
      .attr('fill', d => d.type === 'center' ? '#1a1a1a' : '#666')
      .attr('opacity', 0.8);
    
    nodeSel.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', d => d.type === 'center' ? '11px' : d.type === 'primary' ? '8px' : '6px')
      .attr('font-weight', d => d.type === 'center' ? 'bold' : 'normal')
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')
      .style('text-shadow', '0 0 2px rgba(0,0,0,0.8)');
    
    simulation.on('tick', () => {
      linkSel
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      nodeSel.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
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

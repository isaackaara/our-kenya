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
    const gRoot = svg.append('g').attr('class', 'kg-root').attr('transform', 'translate(0,0) scale(0.65)');
    
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
      { id: 'culture', label: 'Culture', type: 'primary' },
      { id: 'economy', label: 'Economy', type: 'primary' },
      { id: 'e1', label: '2007 PEV', type: 'secondary' },
      { id: 'e2', label: 'Independence', type: 'secondary' },
      { id: 'e3', label: 'Handshake', type: 'secondary' },
      { id: 'e4', label: 'Lancaster House', type: 'secondary' },
      { id: 'e5', label: 'Shifta War', type: 'secondary' },
      { id: 'p1', label: 'Jomo Kenyatta', type: 'secondary' },
      { id: 'p2', label: 'Raila Odinga', type: 'secondary' },
      { id: 'p3', label: 'Moi', type: 'secondary' },
      { id: 'p4', label: 'Kibaki', type: 'secondary' },
      { id: 'p5', label: 'Uhuru', type: 'secondary' },
      { id: 'c1', label: 'Goldenberg', type: 'secondary' },
      { id: 'c2', label: 'Anglo-Leasing', type: 'secondary' },
      { id: 'c3', label: 'Oathing', type: 'secondary' },
      { id: 'co1', label: 'White Highlands', type: 'secondary' },
      { id: 'co2', label: 'Mau Mau', type: 'secondary' },
      { id: 'co3', label: 'Hola', type: 'secondary' },
      { id: 'co4', label: 'Kimathi', type: 'secondary' },
      { id: 'co5', label: 'Mekatilili', type: 'secondary' },
      { id: 'con1', label: 'Green Belt', type: 'secondary' },
      { id: 'con2', label: 'Ivory Ban', type: 'secondary' },
      { id: 'con3', label: 'R. Leakey', type: 'secondary' },
      { id: 'con4', label: 'Wangari', type: 'secondary' },
      { id: 'pol1', label: 'Tom Mboya', type: 'secondary' },
      { id: 'pol2', label: 'Oginga', type: 'secondary' },
      { id: 'pol3', label: 'KANU', type: 'secondary' },
      { id: 'pol4', label: 'ODM', type: 'secondary' },
      { id: 'eth1', label: 'Kikuyu', type: 'secondary' },
      { id: 'eth2', label: 'Luo', type: 'secondary' },
      { id: 'eth3', label: 'Luhya', type: 'secondary' },
      { id: 'eth4', label: 'Kalenjin', type: 'secondary' },
      { id: 'eth5', label: 'Kamba', type: 'secondary' },
      { id: 'eth6', label: 'Maasai', type: 'secondary' },
      { id: 's1', label: 'Marathon', type: 'secondary' },
      { id: 's2', label: 'Safari Rally', type: 'secondary' },
      { id: 's3', label: 'Football', type: 'secondary' },
      { id: 's4', label: 'Athletics', type: 'secondary' },
      { id: 't1', label: 'M-Pesa', type: 'secondary' },
      { id: 't2', label: 'Tech', type: 'secondary' },
      { id: 't3', label: 'Safaricom', type: 'secondary' },
      { id: 't4', label: 'Airways', type: 'secondary' },
      { id: 'co6', label: 'Mombasa', type: 'secondary' },
      { id: 'co7', label: 'Lamu', type: 'secondary' },
      { id: 'co8', label: 'Nairobi', type: 'secondary' },
      { id: 'co9', label: 'Turkana', type: 'secondary' },
      { id: 'cu1', label: 'Sheng', type: 'secondary' },
      { id: 'cu2', label: 'Benga', type: 'secondary' },
      { id: 'cu3', label: 'Architecture', type: 'secondary' },
      { id: 'cu4', label: 'Pastoral', type: 'secondary' },
      { id: 'ec1', label: 'Tea', type: 'secondary' },
      { id: 'ec2', label: 'Flowers', type: 'secondary' },
      { id: 'ec3', label: 'Tourism', type: 'secondary' },
      { id: 'ec4', label: 'NSE', type: 'secondary' },
      { id: 'l1', label: 'Women', type: 'secondary' },
      { id: 'l2', label: 'Land', type: 'secondary' },
      { id: 'l3', label: 'Migration', type: 'secondary' },
      { id: 'l4', label: 'Diaspora', type: 'secondary' },
      { id: 'l5', label: 'Education', type: 'secondary' },
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
      { source: 'kenya', target: 'culture' },
      { source: 'kenya', target: 'economy' },
      { source: 'elections', target: 'e1' },
      { source: 'elections', target: 'e2' },
      { source: 'elections', target: 'e3' },
      { source: 'elections', target: 'e4' },
      { source: 'elections', target: 'e5' },
      { source: 'presidencies', target: 'p1' },
      { source: 'presidencies', target: 'p2' },
      { source: 'presidencies', target: 'p3' },
      { source: 'presidencies', target: 'p4' },
      { source: 'presidencies', target: 'p5' },
      { source: 'corruption', target: 'c1' },
      { source: 'corruption', target: 'c2' },
      { source: 'corruption', target: 'c3' },
      { source: 'colonial', target: 'co1' },
      { source: 'colonial', target: 'co2' },
      { source: 'colonial', target: 'co3' },
      { source: 'colonial', target: 'co4' },
      { source: 'colonial', target: 'co5' },
      { source: 'conservation', target: 'con1' },
      { source: 'conservation', target: 'con2' },
      { source: 'conservation', target: 'con3' },
      { source: 'conservation', target: 'con4' },
      { source: 'politics', target: 'pol1' },
      { source: 'politics', target: 'pol2' },
      { source: 'politics', target: 'pol3' },
      { source: 'politics', target: 'pol4' },
      { source: 'ethnic', target: 'eth1' },
      { source: 'ethnic', target: 'eth2' },
      { source: 'ethnic', target: 'eth3' },
      { source: 'ethnic', target: 'eth4' },
      { source: 'ethnic', target: 'eth5' },
      { source: 'ethnic', target: 'eth6' },
      { source: 'sports', target: 's1' },
      { source: 'sports', target: 's2' },
      { source: 'sports', target: 's3' },
      { source: 'sports', target: 's4' },
      { source: 'tech', target: 't1' },
      { source: 'tech', target: 't2' },
      { source: 'tech', target: 't3' },
      { source: 'tech', target: 't4' },
      { source: 'coast', target: 'co6' },
      { source: 'coast', target: 'co7' },
      { source: 'coast', target: 'co8' },
      { source: 'coast', target: 'co9' },
      { source: 'culture', target: 'cu1' },
      { source: 'culture', target: 'cu2' },
      { source: 'culture', target: 'cu3' },
      { source: 'culture', target: 'cu4' },
      { source: 'economy', target: 'ec1' },
      { source: 'economy', target: 'ec2' },
      { source: 'economy', target: 'ec3' },
      { source: 'economy', target: 'ec4' },
      { source: 'kenya', target: 'l1' },
      { source: 'kenya', target: 'l2' },
      { source: 'kenya', target: 'l3' },
      { source: 'kenya', target: 'l4' },
      { source: 'kenya', target: 'l5' },
    ];
    
    const nodeData = nodes.map(n => ({ ...n }));
    const linkData = links.map(l => ({ ...l }));
    
    const simulation = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(linkData).id(d => d.id).distance(90))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide().radius(d => {
        if (d.type === 'center') return 20;
        if (d.type === 'primary') return 11;
        return 7;
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
      .attr('fill', d => d.type === 'center' ? '#fff' : '#1a1a1a')
      .attr('pointer-events', 'none')
      .style('text-shadow', d => d.type === 'center' ? '0 0 2px rgba(0,0,0,0.8)' : '0 0 1px rgba(255,255,255,0.8)');
    
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

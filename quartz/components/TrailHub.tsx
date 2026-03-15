import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { trails, stopHref } from "../trails"

// Inline styles
const TrailHubCSS = `
.trail-hub {
  width: 100%;
  margin: 0 0 3rem 0;
}

.trail-hub-search {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-family: inherit;
}

.trail-hub-search:focus {
  outline: none;
  border-color: #006B3F;
}

.trail-hub-random {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  background: #006B3F;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  min-height: 48px;
  transition: background 0.2s;
}

.trail-hub-random:hover {
  background: #005230;
}

.trail-hub-random:active {
  transform: scale(0.98);
}

.trail-hub-categories {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.trail-hub-categories::-webkit-scrollbar {
  height: 6px;
}

.trail-hub-categories::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.trail-category-tab {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: #f3f4f6;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  min-height: 44px;
  transition: all 0.2s;
}

.trail-category-tab:hover {
  background: #e5e7eb;
}

.trail-category-tab.active {
  background: #006B3F;
  color: white;
}

.trail-hub-count {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.trail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

@media (max-width: 640px) {
  .trail-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .trail-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.trail-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s;
}

.trail-card:hover {
  border-color: #006B3F;
  box-shadow: 0 4px 12px rgba(0, 107, 63, 0.1);
}

.trail-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.trail-card-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.trail-card-category {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: #d1fae5;
  color: #065f46;
  border-radius: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}

.trail-card-stops {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
}

.trail-card-description {
  font-size: 0.9375rem;
  color: #4b5563;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trail-card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #006B3F;
  text-decoration: none;
  min-height: 44px;
  padding: 0.5rem 0;
}

.trail-card-link:hover {
  color: #005230;
  text-decoration: underline;
}

.trail-card-link::after {
  content: "→";
}
`

const TrailHub: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(trails.map(t => t.category))).sort()]
  
  return (
    <div class={`trail-hub ${displayClass ?? ""}`}>
      <style>{TrailHubCSS}</style>
      
      <input 
        type="text" 
        class="trail-hub-search" 
        placeholder="Search trails by name or description..."
        id="trail-search"
      />
      
      <button class="trail-hub-random" id="random-trail-btn">
        🎲 Surprise me
      </button>
      
      <div class="trail-hub-categories" id="category-tabs">
        {categories.map(cat => (
          <button 
            class={`trail-category-tab ${cat === "All" ? "active" : ""}`}
            data-category={cat}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div class="trail-hub-count" id="trail-count">
        Showing {trails.length} of {trails.length} trails
      </div>
      
      <div class="trail-grid" id="trail-grid">
        {trails.map(trail => (
          <div class="trail-card" data-category={trail.category} data-name={trail.name.toLowerCase()} data-description={trail.description.toLowerCase()}>
            <div class="trail-card-header">
              <h3 class="trail-card-name">{trail.name}</h3>
              <span class="trail-card-category">{trail.category}</span>
            </div>
            <p class="trail-card-stops">{trail.stops.length} stops</p>
            <p class="trail-card-description">{trail.description}</p>
            <a href={stopHref(trail.stops[0])} class="trail-card-link">
              Start trail
            </a>
          </div>
        ))}
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
(function() {
  const trails = ${JSON.stringify(trails.map(t => ({ 
    name: t.name, 
    category: t.category,
    description: t.description,
    firstStop: stopHref(t.stops[0])
  })))};
  
  const searchInput = document.getElementById('trail-search');
  const categoryTabs = document.querySelectorAll('.trail-category-tab');
  const trailCards = document.querySelectorAll('.trail-card');
  const trailCount = document.getElementById('trail-count');
  const randomBtn = document.getElementById('random-trail-btn');
  
  let activeCategory = 'All';
  let searchQuery = '';
  
  function updateDisplay() {
    let visibleCount = 0;
    
    trailCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const name = card.getAttribute('data-name');
      const description = card.getAttribute('data-description');
      
      const categoryMatch = activeCategory === 'All' || category === activeCategory;
      const searchMatch = searchQuery === '' || 
        name.includes(searchQuery) || 
        description.includes(searchQuery);
      
      if (categoryMatch && searchMatch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    trailCount.textContent = \`Showing \${visibleCount} of ${trails.length} trails\`;
  }
  
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-category');
      updateDisplay();
    });
  });
  
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    updateDisplay();
  });
  
  randomBtn.addEventListener('click', () => {
    const visibleTrails = [];
    trailCards.forEach((card, index) => {
      if (card.style.display !== 'none') {
        visibleTrails.push(index);
      }
    });
    
    if (visibleTrails.length > 0) {
      const randomIndex = visibleTrails[Math.floor(Math.random() * visibleTrails.length)];
      const randomTrail = trails[randomIndex];
      window.location.href = randomTrail.firstStop;
    }
  });
})();
        `
      }} />
    </div>
  )
}

export default (() => TrailHub) satisfies QuartzComponentConstructor

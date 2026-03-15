import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { trails, stopHref } from "../trails"

// Inline styles
const TrailHubCSS = `
.trail-hub {
  width: 100%;
  margin: 0 0 3rem 0;
}

.trail-hub-top-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.trail-hub-search {
  flex: 1;
  max-width: 420px;
  padding: 0.6rem 1rem;
  font-size: 0.9375rem;
  border: 1.5px solid #d1d5db;
  border-radius: 0;
  font-family: inherit;
  background: white;
  color: #1f2937;
}

.trail-hub-search:focus {
  outline: none;
  border-color: #006B3F;
}

.trail-hub-random {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  font-size: 0.875rem;
  font-weight: 600;
  background: transparent;
  color: #006B3F;
  border: 1.5px solid #006B3F;
  border-radius: 0;
  cursor: pointer;
  white-space: nowrap;
  min-height: 44px;
  letter-spacing: 0.02em;
  transition: background 0.15s, color 0.15s;
}

.trail-hub-random:hover {
  background: #006B3F;
  color: white;
}

.trail-hub-random:active {
  opacity: 0.85;
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
  padding: 0.45rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  background: white;
  color: #374151;
  border: 1.5px solid #d1d5db;
  border-radius: 0;
  cursor: pointer;
  white-space: nowrap;
  min-height: 36px;
  transition: all 0.15s;
  letter-spacing: 0.01em;
}

.trail-category-tab:hover {
  border-color: #006B3F;
  color: #006B3F;
}

.trail-category-tab.active {
  background: #006B3F;
  color: white;
  border-color: #006B3F;
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
  display: block;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0;
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.trail-card:hover {
  border-color: #006B3F;
  box-shadow: 0 6px 20px rgba(0, 107, 63, 0.12);
  transform: translateY(-2px);
  text-decoration: none;
  color: inherit;
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
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  background: #d1fae5;
  color: #065f46;
  border-radius: 0;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.03em;
  text-transform: uppercase;
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
      
      <div class="trail-hub-top-row">
        <input 
          type="text" 
          class="trail-hub-search" 
          placeholder="Search trails..."
          id="trail-search"
        />
        <button class="trail-hub-random" id="random-trail-btn">
          🎲 Surprise me
        </button>
      </div>
      
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
          <a href={stopHref(trail.stops[0])} class="trail-card" data-category={trail.category} data-name={trail.name.toLowerCase()} data-description={trail.description.toLowerCase()}>
            <div class="trail-card-header">
              <h3 class="trail-card-name">{trail.name}</h3>
              <span class="trail-card-category">{trail.category}</span>
            </div>
            <p class="trail-card-stops">{trail.stops.length} stops</p>
            <p class="trail-card-description">{trail.description}</p>
            <span class="trail-card-link">Start trail →</span>
          </a>
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

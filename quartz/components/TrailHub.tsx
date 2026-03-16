import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { trails, stopHref } from "../trails"
// @ts-ignore
import trailHubScript from "./scripts/trail-hub.inline"

// Inline styles
const TrailHubCSS = `
.trail-hub {
  width: 100%;
  margin: 0 0 3rem 0;
}

.trail-hub-search {
  width: 100%;
  max-width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.9375rem;
  border: 1.5px solid var(--lightgray);
  border-radius: 4px;
  font-family: inherit;
  background: var(--light);
  color: var(--dark);
  margin-bottom: 1.25rem;
}

.trail-hub-search:focus {
  outline: none;
  border-color: var(--secondary);
}

.trail-hub-categories {
  display: flex;
  gap: 8px;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;
  scrollbar-width: thin;
  scrollbar-color: var(--lightgray) transparent;
}

.trail-hub-categories::-webkit-scrollbar {
  height: 4px;
}

.trail-hub-categories::-webkit-scrollbar-track {
  background: transparent;
}

.trail-hub-categories::-webkit-scrollbar-thumb {
  background: var(--lightgray);
  border-radius: 2px;
}

.trail-category-tab {
  padding: 0.45rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  background: var(--lightgray);
  color: var(--darkgray);
  border: 1px solid var(--lightgray);
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  min-height: 36px;
  transition: all 0.15s;
  letter-spacing: 0.02em;
  text-transform: lowercase;
}

.trail-category-tab:hover {
  border-color: var(--secondary);
  background: var(--highlight);
}

.trail-category-tab.active {
  background: var(--secondary);
  color: white;
  border-color: var(--secondary);
}

.trail-hub-random-wrapper {
  text-align: center;
  margin: 1.5rem 0;
}

.trail-hub-random {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  background: transparent;
  color: var(--darkgray);
  border: 2px solid var(--lightgray);
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  min-height: 48px;
  letter-spacing: 0.01em;
  transition: all 0.2s;
}

.trail-hub-random:hover {
  background: var(--highlight);
  border-color: var(--secondary);
  color: var(--dark);
}

.trail-hub-random:active {
  transform: scale(0.98);
}

.trail-hub-count {
  font-size: 0.875rem;
  color: var(--gray);
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
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;
}

.trail-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
  color: var(--dark);
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.trail-card-category {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  background: var(--highlight);
  color: var(--secondary);
  border-radius: 3px;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.trail-card-stops {
  font-size: 0.875rem;
  color: var(--gray);
  margin: 0 0 0.75rem 0;
}

.trail-card-description {
  font-size: 0.9375rem;
  color: var(--darkgray);
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
  gap: 0.4rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #f5f0e8;
  background: var(--secondary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-top: 0.5rem;
  transition: background 0.15s ease, opacity 0.15s ease;
  letter-spacing: 0.01em;
}

.trail-card-link:hover {
  opacity: 0.88;
  text-decoration: none;
}

.trail-card-link::after {
  content: "→";
  font-size: 1rem;
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
        placeholder="Search trails..."
        id="trail-search"
      />
      
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
      
      <div class="trail-hub-random-wrapper">
        <button class="trail-hub-random" id="random-trail-btn">
          🎲 Surprise me
        </button>
      </div>
      
      <div class="trail-hub-count" id="trail-count">
        Showing {trails.length} of {trails.length} trails
      </div>
      
      <div class="trail-grid" id="trail-grid">
        {trails.map(trail => (
          <a href={`/Trails/${trail.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9:-]/g, '')}`} class="trail-card" data-category={trail.category} data-name={trail.name.toLowerCase()} data-description={trail.description.toLowerCase()}>
            <div class="trail-card-header">
              <h3 class="trail-card-name">{trail.name}</h3>
              <span class="trail-card-category">{trail.category}</span>
            </div>
            <p class="trail-card-stops">{trail.stops.length} stops</p>
            <p class="trail-card-description">{trail.description}</p>
            <span class="trail-card-link">Begin trail</span>
          </a>
        ))}
      </div>
      
    </div>
  )
}

TrailHub.afterDOMLoaded = trailHubScript

export default (() => TrailHub) satisfies QuartzComponentConstructor

# Hero Graph Visualization Setup

## Overview
The hero graph is an interactive D3.js force-directed graph visualization that appears on the Our Kenya homepage. It displays Kenya as a central node with 7 primary categories radiating outward, each connected to ~12 secondary articles.

## Components

### 1. Graph Data Extraction
**File:** `scripts/extract-graph.js`
- Parses all markdown files in `content/` directory
- Extracts wikilinks from frontmatter and content
- Builds node/edge structure with proper categorization
- Outputs JSON to `public/data/hero-graph.json`

**Usage:**
```bash
node scripts/extract-graph.js > public/data/hero-graph.json
```

### 2. React/Preact Component
**File:** `quartz/components/HeroGraph.tsx`
- Quartz-compatible component wrapper
- Returns a DOM container for D3 visualization
- Conditionally renders only on homepage (slug === "index")

### 3. Inline Script
**File:** `quartz/components/scripts/hero-graph.inline.ts`
- Client-side D3 initialization and rendering
- Handles force simulation, zoom, drag, and animations
- Progressive rendering: Kenya center (100ms) → primaries (200ms) → secondaries (300ms+)
- Gentle drift animation every 3 seconds
- Responsive to window resize

### 4. Styling
**File:** `quartz/components/styles/HeroGraph.scss`
- Dark mode support
- Mobile responsive (600px on desktop, 400px on tablet, 300px on mobile)
- Kenyan colors: green (#006B3F) and red (#BB0000)
- Loading splash screen with animated spinner

### 5. Data File
**File:** `public/data/hero-graph.json`
- Generated JSON containing nodes and links
- ~92 nodes total: 1 center + 7 primaries + 84 secondaries
- ~237 links connecting related content
- Auto-generated during build (see below)

## Integration Points

### Layout
The component is integrated in `quartz.layout.ts`:
```typescript
Component.ConditionalRender({
  component: Component.HeroGraph(),
  condition: (page) => page.fileData.slug === "index",
})
```

### Component Index
Added to `quartz/components/index.ts` for proper export.

## Deployment

### Build Steps
1. **Extract graph data** (should run before build):
   ```bash
   node scripts/extract-graph.js > public/data/hero-graph.json
   ```

2. **Build site** (regular Quartz build):
   ```bash
   npm run quartz -- build
   ```

3. **Deploy to Cloudflare Pages**:
   - The build output in `public/` will be deployed to ourkenya.com
   - Hero graph data is included in the static assets

### Cloudflare Pages Configuration
- Build command: `npm run quartz -- build`
- Build directory: `public/`
- Ensure `public/data/` directory is included in deployment

## Performance Characteristics

### Data Size
- `hero-graph.json`: ~49KB (minified)
- Lazy-loads on homepage visit
- No impact on non-homepage routes

### Rendering Timeline
- **Page load:** 50-100ms (DOM ready)
- **0-100ms:** Kenya center node renders (visible within 100ms of load)
- **100-200ms:** 7 primary categories appear
- **200-300ms:** Secondary nodes fade in
- **300ms+:** All secondary nodes visible, graph interactive
- **Continuous:** Gentle drift animation every 3 seconds

### Browser Support
- Modern browsers with D3.js support
- Canvas-based rendering via SVG
- Touch-friendly on mobile (draggable nodes)

## Customization

### Change Primary Categories
Edit `scripts/extract-graph.js`, line 23:
```javascript
const PRIMARY_CATEGORIES = [
  'Presidencies',
  'Elections',
  // ... add/remove categories
]
```

Then regenerate data:
```bash
node scripts/extract-graph.js > public/data/hero-graph.json
```

### Change Colors
Edit `quartz/components/styles/HeroGraph.scss`:
```scss
$green: #006B3F;   // Kenya green
$red: #BB0000;     // Kenya red
```

### Adjust Layout
Edit `quartz/components/scripts/hero-graph.inline.ts`:
```typescript
.force('link', forceLink(links).distance(80).strength(0.4))      // Link distance
.force('charge', forceManyBody().strength(-300).distanceMax(500)) // Node repulsion
.force('center', forceCenter(width / 2, height / 2).strength(0.05)) // Center force
```

## Troubleshooting

### Graph doesn't appear
1. Check browser console for errors
2. Verify `public/data/hero-graph.json` exists and is valid JSON
3. Ensure HeroGraph component is in layout for index slug
4. Check that D3 is loaded (should be automatic via package.json)

### Missing nodes/links
1. Regenerate graph data: `node scripts/extract-graph.js > public/data/hero-graph.json`
2. Verify markdown files have proper frontmatter and wikilinks
3. Check that files are in PRIMARY_CATEGORIES directories

### Performance issues
1. Reduce secondary node limit in `extract-graph.js` (currently 12 per category)
2. Increase simulation `distanceMax` to spread nodes further
3. Reduce drift animation frequency (currently 3000ms interval)

## Future Enhancements

- [ ] Click nodes to navigate to article pages
- [ ] Highlight reading trails on hover
- [ ] Search/filter nodes in real-time
- [ ] Export graph data in other formats (GraphML, GexF)
- [ ] Integration with knowledge graph API
- [ ] Timeline visualization for historical events
- [ ] Mobile-optimized simplified layout

## Files Checklist

```
quartz/components/
  ├── HeroGraph.tsx           (React component wrapper)
  ├── scripts/
  │   └── hero-graph.inline.ts (D3 initialization)
  └── styles/
      └── HeroGraph.scss      (Styling)

scripts/
  └── extract-graph.js        (Data extraction utility)

public/
  └── data/
      └── hero-graph.json     (Generated graph data)

quartz.layout.ts              (Updated with HeroGraph)
quartz/components/index.ts    (Updated with export)
```

---

**Last Updated:** March 17, 2026
**Component Status:** Production-ready
**Data Generation:** Automated via build script
**Deployment Target:** ourkenya.com homepage

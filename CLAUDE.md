# Our Kenya - CLAUDE.md

## Project Overview

Our Kenya (ourkenya.com) is a knowledge graph of Kenya's history built as a Quartz v4.5.2 static site. 7,796+ notes, 145 story trails, 58 interactive knowledge graphs. Deployed on Cloudflare Pages.

- **Repo:** isaackaara/our-kenya on GitHub
- **Branch:** v4 (main working branch, also the Cloudflare Pages production branch)
- **Content:** `content/` directory - 83 subdirectories + flat files, all Markdown
- **Dev server:** `npm run dev` — kills stale processes, builds Quartz, starts wrangler with Pages Functions + D1 on http://localhost:8788
- **Build:** `npm run build` (runs quartz build → pagefind index → extract-graph → generate-games → copy-static-pages)
- **Deploy:** Push to v4 → Cloudflare Pages auto-deploys

## Content Architecture

### Note Identity

A note's identity is its **filename without extension**. The wikilink `[[Mau Mau Uprising]]` resolves to whichever file is named `Mau Mau Uprising.md`, regardless of folder.

**Critical rule: every basename must be unique across the entire `content/` directory.** Duplicate basenames break Quartz's "shortest" link resolution - when two files share a name, Quartz can't pick one and generates broken relative URLs (404s). Before creating a new note, always check:

```bash
find content -name "Your Note Name.md"
```

### Folder Structure

Notes live in topical subdirectories (`Kikuyu/`, `Counties/Nairobi/`, `Startups/`, etc.) and some at the content root. The folder determines the URL path but not the wikilink target.

**Folder hub notes:** Some folders have a matching root-level `.md` file (e.g., `content/Asians.md` for `content/Asians/`, `content/Startups.md` for `content/Startups/`). These serve as the content shown on the folder's index page (`/Asians/`, `/Startups/`). The `folderPage.tsx` emitter handles re-resolving inline links so they work correctly from the folder URL. Do NOT create `index.md` files inside these folders - use the root-level `.md` pattern instead.

### Wikilink Format

```
[[Target]]                    - simple link
[[Target|Display Text]]       - aliased link
[[Target#Section]]            - section link
[[Target#Section|Display]]    - section + alias
```

Wikilinks are case-sensitive. `[[mau mau]]` will NOT match `Mau Mau Uprising.md`.

### Gold Standard Note Format

Every note must follow this format - NO exceptions:

1. **No frontmatter.** No YAML, no `---` blocks, no `# Title` heading.
2. **Start with prose.** 300–600 words of substantive content. Inline `[[wikilinks]]` woven into the text.
3. **`## See Also`** - Cross-references to related existing notes.
4. **`## Sources`** - At least 3 real, specific sources. Not generic placeholders like "Kenya National Archives" or "Academic research."

Before adding wikilinks in a new note, verify the target exists:
```bash
find content -name "Target Name.md"
```

## Preventing Dead Links

Dead links happen when a `[[wikilink]]` points to a note that doesn't exist. This was a major issue (8,600+ dead refs at peak) and has been fully resolved. To keep it at zero:

### When creating a new note:
1. **Check the basename is unique** - no other file with the same name anywhere in `content/`
2. **Only wikilink to notes that exist** - verify with `find content -name "Note Name.md"` before linking
3. **If the target doesn't exist**, either create the target note or use plain text instead of a wikilink

### When deleting or renaming a note:
1. **Search for all references first:**
   ```bash
   grep -r '[[Old Name' content/ --include='*.md' -l
   ```
2. **Update or remove all wikilinks** pointing to the old name
3. **If renaming, update `quartz/trails.ts`** if the note is a trail stop

### When moving a note to a different folder:
1. Moving is safe for wikilinks (they resolve by basename, not path)
2. **But check `quartz/trails.ts`** - trail stops use full slugs like `"Kikuyu/Mau Mau Uprising"`. Update the slug if you moved the file.

### Scanning for dead links
```bash
node scripts/rescan.cjs           # summary - wikilink-level scan
node scripts/rescan.cjs --top 20  # top 20 dead targets by ref count
node scripts/rescan.cjs --all     # all dead targets
```

### Scanning for 404s (Playwright crawler)
```bash
python3 scripts/crawl-404s.py                         # default: 500 pages, depth 3
python3 scripts/crawl-404s.py --max-pages 1000 --depth 2  # broader but shallower
```
Requires the dev server running. Pass `--url http://localhost:8788` to match the dev server port. Crawls all internal links BFS-style and reports every 404 with its referrer. Use this before pushing to catch broken links that `rescan.cjs` can't detect (e.g., broken trail intro URLs, missing explore stubs, slug mismatches).

## Key Files

| File | Purpose |
|------|---------|
| `quartz.config.ts` | Quartz configuration. CrawlLinks uses `markdownLinkResolution: "shortest"` |
| `quartz/trails.ts` | All 145 story trails. Trail stops reference notes by `slug` (folder path + basename, no `.md`). `stopHref()` generates URLs with `?trail=id&stop=index` for trail context. `slugToTrails` maps each slug to all trails containing it. |
| `quartz/components/HeroGraph.tsx` | D3 force-directed hero graph on homepage (visual only, nodes are not clickable links) |
| `quartz/components/scripts/knowledge-graphs.inline.ts` | 58 interactive knowledge graphs. Lazy-loads data from `knowledge-graphs.json` only when the homepage container exists. |
| `quartz/static/knowledge-graphs.json` | All 58 graph datasets + 8 categories (225KB). Fetched on demand, not bundled in JS. |
| `quartz/components/scripts/raila-graph.inline.ts` | Standalone Raila Odinga relationship graph (removed from bundle - still exists but not imported in `components/index.ts`) |
| `quartz/static/sw.js` | Service worker: cache-first for static assets, network-first for HTML. Precaches `scores.json` and `trail-scores.json`. |
| `quartz/components/DailyThemeGrid.tsx` | Theme grid + storyline shuffling on homepage. Themes randomized via Fisher-Yates shuffle. Also shuffles `.ok-verticals` storyline cards on every page load |
| `quartz/components/TrailNav.tsx` | Trail navigation UI (top + bottom) rendered on trail stop pages. Renders ALL trail memberships with `data-trail-id` + `data-trail-pos`; client-side JS reads `?trail=` and `&stop=` from URL to show the correct one. |
| `content/explore/*.md` | Explore landing pages. These are stubs with `<div class="ok-explore-tree" data-root="...">` - do NOT delete them |
| `quartz/components/TrailHub.tsx` | STORY-TRAILS page. Generates trail card URLs from `trail.name` via `.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9:-]/g, '')`. Cards randomized on every page load via `trail-hub.inline.ts` |
| `content/Trails/*.md` | Trail intro pages. Each has a `<a class="trail-begin-btn" data-trail="trailId">` linking to the first stop. Client-side JS appends `?trail=` on click (can't embed in markdown href — Quartz CrawlLinks mangles query params). **Filename must match the URL slug generated by TrailHub.tsx** |
| `quartz/components/scripts/daily-note.inline.ts` | "Today in Kenya's history" homepage widget. Reads `/static/scores.json` for scored notes |
| `quartz/static/scores.json` | Scored notes for daily note widget. Keys are slugs - must match actual file paths |
| `content/index.md` | Homepage content with dynamic `{{NOTE_COUNT}}` etc. placeholders |
| `scripts/rescan.cjs` | Dead link scanner |
| `quartz/components/PagefindSearch.tsx` | Pagefind-based search modal with focus trap and ARIA roles |
| `quartz/plugins/emitters/folderPage.tsx` | Folder page emitter - patched to fix relative URL resolution for folder hub notes |
| `quartz/components/Darkmode.tsx` | Light/dark mode toggle (pill switch with label). Defaults light, respects `prefers-color-scheme`, persists via `localStorage` |
| `quartz/components/ListenButton.tsx` | Cloud TTS audio player. Fetches MP3 from `/api/tts`, plays via `<audio>` element with full controls |
| `quartz/components/PageviewTracker.tsx` | Fires pageview tracking on every SPA navigation via `/api/pageview`. Also saves visited slugs to `localStorage` for ExploreProgress |
| `quartz/components/StatsDashboard.tsx` | Public analytics dashboard at `/stats`. Fetches from `/api/stats` |
| `quartz/components/KeepReading.tsx` | Server-rendered end-of-note recommendations. Shows 3 notes: 2 same-topic (co-citation), 1 wild card. Skips homepage, STORY-TRAILS, explore/*, Trails/*, folder indexes |
| `quartz/components/TrendingNotes.tsx` | "Trending This Week" — top 10 most-viewed notes. Homepage full list + right sidebar compact list on note pages. Fetches `/api/trending` |
| `quartz/components/RandomNoteFAB.tsx` | "Surprise me" floating pill button on every page. Navigates to random note with wonder >= 7 from `scores.json` |
| `quartz/components/HiddenGem.tsx` | "Hidden Gem" daily spotlight on homepage. Cross-refs `/api/cold-notes` with `scores.json` (wonder >= 8, <5 views). Deterministic daily pick |
| `quartz/components/NewThisWeek.tsx` | Server-rendered list of 5 most recently created notes (last 14 days). Homepage only |
| `quartz/components/ExploreProgress.tsx` | Progress bar on `/explore/*` pages: "You've explored X of Y notes". Uses localStorage visited slugs |
| `quartz/components/AnalyticsDashboard.tsx` | Internal KPI dashboard at `/analytics`. Auth-protected via `ANALYTICS_KEY` env var. Shows engagement, content, and feature metrics |
| `functions/api/tts.ts` | Cloudflare Pages Function: proxies text to OpenAI TTS API (`tts-1`, voice `nova`), caches at edge for 30 days, rate limits 20/hr/IP |
| `functions/api/pageview.ts` | Cloudflare Pages Function: logs pageviews to D1. Accepts optional `referrer_slug` for navigation tracking |
| `functions/api/stats.ts` | Cloudflare Pages Function: returns aggregate analytics (totals, daily trends, leaderboards). Filters out non-note pages (stats, STORY-TRAILS, games, etc.) |
| `functions/api/trending.ts` | Cloudflare Pages Function: top 10 most-viewed content notes from past 7 days. Excludes non-note pages. Cached 5 min |
| `functions/api/cold-notes.ts` | Cloudflare Pages Function: slugs with <5 pageviews. For Hidden Gem feature. Cached 1 hour |
| `functions/api/event.ts` | Cloudflare Pages Function: `POST /api/event` logs feature interaction events (surprise_click, search, trail_advance, etc.) |
| `functions/api/analytics.ts` | Cloudflare Pages Function: `GET /api/analytics` returns KPI data. Protected by `ANALYTICS_KEY` query param/header |
| `functions/api/tts-stats.ts` | Cloudflare Pages Function: per-slug listen/pageview counts |
| `wrangler.toml` | Cloudflare wrangler config with D1 database binding (`LISTENS_DB` → `ourkenya-listens`) |
| `.dev.vars` | Local dev secrets (gitignored). Contains `OPENAI_API_KEY`, `ANALYTICS_KEY` |
| `migrations/*.sql` | D1 database migrations: `0001` listens, `0002` pageviews, `0003` events, `0004` referrer_slug |
| `content/stats.md` | Stats page stub with `<div id="ok-stats-dashboard">` container |
| `content/analytics.md` | Analytics page stub with `<div id="ok-analytics-dashboard">` container |
| `pitch-liberty.html` | Liberty Insurance partnership pitch (source). Copied to `public/partnerships/liberty/index.html` by `copy-static-pages` |
| `pitch-im.html` | I&M Bank partnership pitch (source). Commercial sponsorship with art patronage angle, maroon brand, 3 tiers. Copied to `public/partnerships/im/index.html` |
| `pitch-mastercard-foundation.html` | Mastercard Foundation partnership pitch (source). Grant proposal with Young Africa Works alignment, impact framework, 3-phase program. Copied to `public/partnerships/mastercard-foundation/index.html` |
| `im-logo.png`, `im-logo-white.png` | I&M Bank logos (colored + white for dark backgrounds). Pre-rebrand version |
| `mastercard-foundation-logo.png`, `mastercard-foundation-logo-white.png` | Mastercard Foundation logos (colored + white for dark backgrounds) |
| `liberty-logo.png` | Liberty Insurance logo |

## Partnership Pages

Standalone HTML pitch pages for potential partners. Each is a self-contained file at the project root (`pitch-*.html`) with all CSS/JS inline. The `copy-static-pages` npm script copies them to `public/partnerships/*/index.html` after build (since `quartz build` wipes `public/`).

| Page | URL | Type | Source |
|------|-----|------|--------|
| Liberty Insurance | `/partnerships/liberty/` | Commercial sponsorship | `pitch-liberty.html` |
| I&M Bank | `/partnerships/im/` | Commercial sponsorship | `pitch-im.html` |
| Mastercard Foundation | `/partnerships/mastercard-foundation/` | Grant/program proposal | `pitch-mastercard-foundation.html` |

### How it works
1. Source HTML + logo files live at project root (not in `content/` or `public/`)
2. `npm run build` ends with `copy-static-pages` which creates `public/partnerships/*/` dirs and copies HTML as `index.html` + logo files
3. Each page references logos by filename only (same directory after copy)
4. Logo variants: colored version for light backgrounds, white (`*-white.png`) for dark backgrounds (mockup sponsor bars, footers)

### Adding a new partnership page
1. Create `pitch-partnername.html` at project root (use Liberty template as base)
2. Add logo files at project root
3. Update `copy-static-pages` in `package.json` to mkdir + cp the new files
4. Push to v4 → Cloudflare Pages auto-deploys

## Search

Search uses **Pagefind** (not FlexSearch). Pagefind indexes the built HTML files and serves results client-side.

- **Build:** `npx pagefind --site public` must run after `npx quartz build` (already chained in `npm run build`)
- **Dev server:** The `--serve` mode rebuilds `public/` from scratch, so pagefind must be re-run manually after the server starts: `npx pagefind --site public`
- **Component:** `quartz/components/PagefindSearch.tsx` + `quartz/components/scripts/pagefind-search.inline.ts`
- **Assets:** Pagefind generates `/pagefind/pagefind-ui.js`, `/pagefind/pagefind-ui.css`, and index files into `public/pagefind/`
- **Styling:** Pagefind CSS variables are overridden in `quartz/styles/custom.scss` for dark mode support

## Trail System

Trails are defined in `quartz/trails.ts`. Each trail has:
- `id` - unique identifier
- `name` - display name (note: 5 pairs of trails share the same name but have different IDs and different stops — these are intentional variant trails)
- `stops[]` - ordered list of `{ slug, title }` where slug is the path relative to `content/` without `.md`

### Trail Context via URL Parameters

When a note appears in multiple trails (common — e.g., "Mount Kenya Mafia" is in 7 trails), the system uses URL query parameters to track which trail the user is navigating:

- `?trail=trailId` — identifies which trail's nav to show
- `&stop=N` — disambiguates when a note appears multiple times in the same trail (0-based index)

**Flow:**
1. User clicks "Begin Trail" on intro page → client-side JS appends `?trail=trailId&stop=0` → navigates to first stop
2. `TrailNav` renders ALL trail memberships as separate hidden `<div>` elements with `data-trail-id` and `data-trail-pos` attributes
3. Client-side `afterDOMLoaded` script reads `?trail=` and `&stop=` from URL, shows the matching nav, hides others
4. All prev/next/history links include `?trail=trailId&stop=N` so context persists through the entire trail

**Without `?trail=` parameter** (direct visit), the first trail membership is shown by default.

### Trail Intro Pages

Trail intro pages in `content/Trails/` have a "Begin Trail" button: `<a href="/path/to/first-stop" class="trail-begin-btn" data-trail="trailId">`. The `href` points to the first stop, and `data-trail` carries the trail ID. Client-side JS intercepts the click to append `?trail=` (query params can't be embedded in markdown `<a href>` — Quartz's CrawlLinks transformer treats them as part of the slug).

**When moving a trail stop note:** Update the slug in `quartz/trails.ts`. If it's the first stop, also update the `href` in the trail intro page, or run `node scripts/fix-trail-intros.cjs`.

**When creating a new trail:** Create the trail in `trails.ts`, then create a matching intro page in `content/Trails/` with the Begin Trail button including `data-trail="yourTrailId"`.

### Trail Intro Page Naming

Trail intro filenames **must** produce a Quartz slug that matches the URL generated by `TrailHub.tsx`. The URL is derived from the trail's `name` field in `trails.ts`:

```
URL slug = name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9:-]/g, '')
```

Examples:
- Trail name `"Facing Mount Kenya"` → URL `/Trails/Facing-Mount-Kenya` → file `Facing Mount Kenya.md`
- Trail name `"The Hustler's Gambit"` → URL `/Trails/The-Hustlers-Gambit` → file `The Hustlers Gambit.md` (no apostrophe)
- Trail name `"Ivory Wars: How Kenya Saved Its Elephants"` → URL `/Trails/Ivory-Wars:-How-Kenya-Saved-Its-Elephants` → file `Ivory Wars: How Kenya Saved Its Elephants.md` (keep colons)

### Protected Directories

These directories contain special files that must NOT be deleted by cleanup scripts:
- `content/explore/` - Explore stub pages with `<div class="ok-explore-tree">` used by DailyThemeGrid
- `content/Trails/` - Trail intro pages linked from STORY-TRAILS hub

## Audio Player (Listen Button)

The Listen button uses **OpenAI TTS API** (`tts-1`, voice `nova`) via a Cloudflare Pages Function at `/api/tts`. Replaces the old `SpeechSynthesis` approach.

### How it works
1. User clicks Listen → `POST /api/tts` with `{ slug, text }` + anonymous `X-Listener-ID` header
2. Worker checks Cloudflare Cache API (keyed by slug + SHA-256 content hash)
3. On cache miss: calls OpenAI TTS → returns streaming MP3 → caches for 30 days
4. Client plays via `<audio>` element with seek bar, ±10s skip, play/pause, stop
5. **Media Session API** enables lock screen controls and background playback
6. **localStorage** saves playback position every 2s; offers "Resume from X:XX?" on revisit
7. **Prefetch on hover** — TTS request starts on mouseenter/touchstart for faster playback

### Key details
- Notes >4096 chars are split at sentence boundaries, TTS'd in parallel, concatenated
- Rate limit: 20 generations per IP per hour
- Cost: ~$0.03 per note ($15/1M chars). Cached after first generation.
- `OPENAI_API_KEY` stored in Cloudflare Pages env vars (production) and `.dev.vars` (local)
- SPA cleanup via `window.addCleanup()` — pauses audio, saves position, revokes blob URL

## Analytics

Lightweight privacy-respecting analytics using **Cloudflare D1** (serverless SQLite at edge).

### What's tracked
- **Pageviews**: logged on every SPA navigation via `POST /api/pageview` (includes `referrer_slug` for navigation flow)
- **Listens**: logged on every TTS request via the `/api/tts` handler
- **Events**: feature interactions logged via `POST /api/event` (surprise_click, search, trail_advance, trail_complete, keep_reading_click, trending_click, hidden_gem_click, random_fab)
- **Visited slugs**: saved to `localStorage` key `ok-visited-slugs` (JSON array) for ExploreProgress
- Each record stores: `slug`, `listener_id` (random UUID from localStorage, no PII), `created_at`

### D1 Database
- **Name:** `ourkenya-listens` (ID: `bb7727db-5628-4f5b-b238-fbacda2d84b2`)
- **Binding:** `LISTENS_DB` in `wrangler.toml` and Cloudflare Pages dashboard
- **Tables:** `listens`, `pageviews` (+ `referrer_slug` column), `events` (event_type, slug, meta, listener_id)
- **Migrations:** `0001` listens, `0002` pageviews, `0003` events table, `0004` add referrer_slug to pageviews

### API endpoints
- `GET /api/stats` — aggregate totals, daily trends (30 days), top 20 leaderboards (content notes only), recent listens. Cached 5 min.
- `GET /api/trending` — top 10 most-viewed content notes from past 7 days. Cached 5 min.
- `GET /api/cold-notes` — up to 100 slugs with <5 views. Cached 1 hour.
- `POST /api/event` — logs feature interaction events. Body: `{ event_type, slug?, meta? }`
- `GET /api/analytics?key=KEY` — full KPI data (engagement, content, feature metrics). Auth-protected.
- `GET /api/tts-stats` — per-slug stats. Supports `?slug=X`, `?type=listens|pageviews`, `?limit=N`

### Stats dashboard (public)
- Public page at `/stats` (`content/stats.md` + `StatsDashboard.tsx`)
- Shows: 6 summary cards, daily bar charts, most-read/listened leaderboards, recent listens feed

### Analytics dashboard (internal)
- Auth-protected page at `/analytics` (`content/analytics.md` + `AnalyticsDashboard.tsx`)
- Prompts for `ANALYTICS_KEY`, stores in localStorage
- Engagement KPIs: pages/session, avg session duration, bounce rate, notes discovered, discovery rate, listen-through rate
- Content KPIs: cold notes count, hot notes leaderboard, rising notes (week-over-week delta)
- Feature KPIs: event counts by type, trail completion rates, daily event charts

### Running migrations
```bash
# Local
npx wrangler d1 execute ourkenya-listens --file=migrations/XXXX.sql

# Production
npx wrangler d1 execute ourkenya-listens --file=migrations/XXXX.sql --remote
```

### Querying D1 directly
```bash
npx wrangler d1 execute ourkenya-listens --remote --command="SELECT slug, COUNT(*) as views FROM pageviews GROUP BY slug ORDER BY views DESC LIMIT 10"
```

## Discoverability Features

Six features designed to spread readership beyond the ~308 most-viewed notes:

| Feature | Component | Where | Type |
|---------|-----------|-------|------|
| Keep Reading | `KeepReading.tsx` | Right sidebar, every note page | Server-rendered (build-time, uses `allFiles` co-citation) |
| Trending This Week | `TrendingNotes.tsx` + `trending.inline.ts` | Homepage (`#ok-trending`) + sidebar (`#ok-trending-sidebar`) | Client-side, fetches `/api/trending` |
| Surprise Me FAB | `RandomNoteFAB.tsx` | Bottom-right of every page (floating pill button) | Client-side, uses `scores.json` |
| Hidden Gem | `HiddenGem.tsx` + `hidden-gem.inline.ts` | Homepage (`#ok-hidden-gem`) | Client-side, cross-refs `/api/cold-notes` + `scores.json` |
| New This Week | `NewThisWeek.tsx` | Homepage (afterBody) | Server-rendered (build-time, uses `dates.created`) |
| Explore Progress | `ExploreProgress.tsx` + `explore-progress.inline.ts` | Top of `/explore/*` pages | Client-side, reads localStorage visited slugs |

### Homepage containers
`content/index.md` has these container divs that client-side scripts populate:
- `#ok-surprise-wrap` — Surprise Me button
- `#ok-daily-note` — Today in Kenya's History
- `#ok-hidden-gem` — Hidden Gem spotlight
- `#ok-trending` — Trending This Week
- `#ok-hero-graph-root` — D3 hero graph
- `#ok-theme-grid` — Theme grid (populated by DailyThemeGrid)
- `#ok-knowledge-graphs` — Knowledge graphs

### Randomization
- **Storylines** (hardcoded HTML cards in `index.md` `.ok-verticals`): Shuffled client-side by `DailyThemeGrid.tsx` script via Fisher-Yates on every page load
- **Theme grid** (`#ok-theme-grid`): Built from JS array, shuffled and sliced to 20 on every load
- **Trail hub cards**: Shuffled by `trail-hub.inline.ts`

## Build & Dev

- **Node.js:** v22+ (uses `.cjs` extension for CommonJS scripts)
- **Build:** `npm run build` chains: quartz build → pagefind index → extract-graph → generate-games → copy-static-pages
- **Build time:** ~2 minutes for 7,796+ files + ~13 seconds for pagefind indexing
- **Dev server:** `npm run dev` — kills ports 8080/8788, builds Quartz, starts wrangler with Functions + D1 on `:8788`
- **Port conflicts:** `npm run dev` handles this automatically. Manual: `lsof -ti:8080 -ti:8788 | xargs kill -9`
- **Git date warnings:** Untracked files show "dates will be inaccurate" warnings - safe to ignore
- **`public/` directory:** Sometimes needs `rm -rf public/` before rebuild if you hit ENOTEMPTY errors

## Useful Scripts

Active scripts in `scripts/`. Legacy scripts archived in `scripts/archive/`.

| Script | Purpose |
|--------|---------|
| `rescan.cjs` | Scan for dead wikilinks (fast, no server needed) |
| `crawl-404s.py` | Playwright BFS crawler for 404 detection (needs dev server running) |
| `dedup-notes.cjs` | Find and remove duplicate basenames (keeps larger file, skips protected dirs) |
| `fix-trail-slugs.cjs` | Update trail slugs in `trails.ts` after moving files |
| `fix-trail-intros.cjs` | Fix "Begin Trail" button hrefs and `data-trail` attributes in all trail intro pages to match `trails.ts` first stops |
| `fix-backslash-wikilinks.cjs` | Remove backslashes from wikilinks (`[[Ogiek\ History]]` → `[[Ogiek History]]`) |
| `fix-backslash-names.cjs` | Rename files with literal backslashes in filenames |
| `tier1-cleanup.cjs` | Remove obvious duplicate stubs (root stubs, quoted-path dirs) |
| `pull-contributions.cjs` | Fetch user-submitted contributions from Railway API into `plans/contributions-inbox.md` |

## Performance Architecture

### Lazy Loading

Heavy assets are deferred so non-homepage pages stay fast:

- **Knowledge graphs** (`knowledge-graphs.inline.ts`): Early-returns if `#ok-knowledge-graphs` container doesn't exist. Fetches `knowledge-graphs.json` (225KB) only on the homepage.
- **Surprise Me scores** (`surprise-me.inline.ts`): `scores.json` (512KB) fetched on first button click, not on page load. Cached in memory for SPA navigations.
- **RailaGraph**: Removed from `quartz/components/index.ts` so it's no longer bundled. Source files kept for reference.

### Service Worker

`quartz/static/sw.js` registered via inline script in `Head.tsx`:
- **Cache-first**: `/static/`, `/pagefind/`, CSS, JS, images, fonts
- **Network-first**: HTML pages (with cache fallback for offline)
- **Precaches**: `scores.json`, `trail-scores.json`

### SPA Cleanup

Quartz uses SPA navigation (`nav` events). D3 force simulations must be stopped on navigation to prevent memory leaks. Use `window.addCleanup()`:

```typescript
if (typeof window.addCleanup === "function") {
  window.addCleanup(() => { simulation.stop() })
}
```

The hero graph (`hero-graph-component.inline.ts`) already implements this pattern.

## Accessibility

The site implements the following accessibility features:

- **Skip-to-content link** - visually hidden, appears on Tab focus, jumps to `#quartz-body`
- **ARIA landmarks** - `<main role="main">` for content, `<nav role="navigation">` for left sidebar, `<aside role="complementary">` for right sidebar
- **Focus indicators** - `:focus-visible` outlines on all interactive elements (mouse clicks unaffected)
- **Reduced motion** - `@media (prefers-reduced-motion: reduce)` disables all animations, transitions, and smooth scroll
- **Dark mode** - defaults to light, respects `prefers-color-scheme`, persists choice in `localStorage`. Toggle is a labeled pill switch in the sidebar.
- **Search accessibility** - modal has `role="dialog"`, `aria-modal="true"`, focus trap, labeled close button, `aria-hidden` toggled on open/close
- **Reader mode** - button in sidebar for distraction-free reading
- **Semantic HTML** - proper heading hierarchy, `<article>`, `<nav>`, `<footer>`, `<time>` elements
- **Relative font sizes** - all text uses rem/em units, respects user's browser font size

When adding new interactive components, always include:
- `aria-label` on buttons that use icons instead of text
- Keyboard event handlers (Enter/Space for buttons, Escape to close modals)
- `:focus-visible` styling (inherited from global styles)
- `prefers-reduced-motion` respect for any animations

### Common Pitfalls

- **Filenames with special characters:** Avoid backslashes, quotes, and periods (except `.md`) in filenames. They cause slug mismatches and 404s.
- **Duplicate basenames:** Always check `find content -name "Name.md"` before creating a note. Duplicates silently break all links to that name.
- **Trail intro naming:** The filename must match the URL slug generated by TrailHub (see Trail System section).
- **scores.json staleness:** If you rename/move files, update `quartz/static/scores.json` keys to match new slugs.
- **Pagefind after serve:** When using `--serve` mode, pagefind must be re-run manually after the server starts since the build wipes `public/`.
- **Folder hub notes:** If a folder (e.g., `Startups/`) has a matching root `.md` file (`Startups.md`), do NOT also create `Startups/index.md` - it would break `[[Startups]]` wikilink resolution.
- **Image alt text:** Always include meaningful alt text on images in content files for screen reader users.
- **Query params in markdown links:** Quartz's CrawlLinks transformer treats `?key=value` as part of the slug, mangling it. Never embed query parameters in `<a href>` tags inside markdown content. Use `data-*` attributes and client-side JS instead (see trail intro pages for the pattern).
- **Duplicate trail stops:** If a note slug appears twice in the same trail's `stops[]`, both get separate nav blocks. The `&stop=N` URL param disambiguates. Avoid duplicate stops where possible.

## Testing

### E2E Tests (Playwright)

```bash
npx playwright test tests/e2e.spec.ts    # run all 41 tests
```

Requires dev server running on `:8788`. Tests cover:
- Homepage (load, search, dark mode, theme grid)
- Navigation (SPA, STORY-TRAILS, sidebar)
- Trail System (Begin Trail, trail context, walkthrough, history stack, bottom nav)
- Content Pages (5 key pages, no JS errors)
- 404 Detection (valid pages return 200, invalid return 404)
- Explore Pages (tree container loads)
- Accessibility (headings, alt text, skip link, ARIA landmarks)
- Performance (page load <10s, SPA nav <3s)
- Console Errors (5 pages checked)
- Link Integrity (homepage links, trail card links)
- Stats/Listen/Search

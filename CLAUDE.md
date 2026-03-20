# Our Kenya — CLAUDE.md

## Project Overview

Our Kenya (ourkenya.com) is a knowledge graph of Kenya's history built as a Quartz v4.5.2 static site. 7,756+ notes, 140 story trails, 58 interactive knowledge graphs. Deployed on Cloudflare Pages.

- **Repo:** isaackaara/our-kenya on GitHub
- **Branch:** v4 (main working branch)
- **Content:** `content/` directory — 83 subdirectories + flat files, all Markdown
- **Dev server:** `npx quartz build --serve -d content` → http://localhost:8080 (then run `npx pagefind --site public` for search)
- **Build:** `npm run build` (runs quartz build → pagefind index → extract-graph)
- **Deploy:** Push to v4 → Cloudflare Pages auto-deploys

## Content Architecture

### Note Identity

A note's identity is its **filename without extension**. The wikilink `[[Mau Mau Uprising]]` resolves to whichever file is named `Mau Mau Uprising.md`, regardless of folder.

**Critical rule: every basename must be unique across the entire `content/` directory.** Duplicate basenames break Quartz's "shortest" link resolution — when two files share a name, Quartz can't pick one and generates broken relative URLs (404s). Before creating a new note, always check:

```bash
find content -name "Your Note Name.md"
```

### Folder Structure

Notes live in topical subdirectories (`Kikuyu/`, `Counties/Nairobi/`, `Startups/`, etc.) and some at the content root. The folder determines the URL path but not the wikilink target.

**Folder hub notes:** Some folders have a matching root-level `.md` file (e.g., `content/Asians.md` for `content/Asians/`, `content/Startups.md` for `content/Startups/`). These serve as the content shown on the folder's index page (`/Asians/`, `/Startups/`). The `folderPage.tsx` emitter handles re-resolving inline links so they work correctly from the folder URL. Do NOT create `index.md` files inside these folders — use the root-level `.md` pattern instead.

### Wikilink Format

```
[[Target]]                    — simple link
[[Target|Display Text]]       — aliased link
[[Target#Section]]            — section link
[[Target#Section|Display]]    — section + alias
```

Wikilinks are case-sensitive. `[[mau mau]]` will NOT match `Mau Mau Uprising.md`.

### Gold Standard Note Format

Every note must follow this format — NO exceptions:

1. **No frontmatter.** No YAML, no `---` blocks, no `# Title` heading.
2. **Start with prose.** 300–600 words of substantive content. Inline `[[wikilinks]]` woven into the text.
3. **`## See Also`** — Cross-references to related existing notes.
4. **`## Sources`** — At least 3 real, specific sources. Not generic placeholders like "Kenya National Archives" or "Academic research."

Before adding wikilinks in a new note, verify the target exists:
```bash
find content -name "Target Name.md"
```

## Preventing Dead Links

Dead links happen when a `[[wikilink]]` points to a note that doesn't exist. This was a major issue (8,600+ dead refs at peak) and has been fully resolved. To keep it at zero:

### When creating a new note:
1. **Check the basename is unique** — no other file with the same name anywhere in `content/`
2. **Only wikilink to notes that exist** — verify with `find content -name "Note Name.md"` before linking
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
2. **But check `quartz/trails.ts`** — trail stops use full slugs like `"Kikuyu/Mau Mau Uprising"`. Update the slug if you moved the file.

### Scanning for dead links
```bash
node scripts/rescan.cjs           # summary — wikilink-level scan
node scripts/rescan.cjs --top 20  # top 20 dead targets by ref count
node scripts/rescan.cjs --all     # all dead targets
```

### Scanning for 404s (Playwright crawler)
```bash
python3 scripts/crawl-404s.py                         # default: 500 pages, depth 3
python3 scripts/crawl-404s.py --max-pages 1000 --depth 2  # broader but shallower
```
Requires the dev server running on localhost:8080. Crawls all internal links BFS-style and reports every 404 with its referrer. Use this before pushing to catch broken links that `rescan.cjs` can't detect (e.g., broken trail intro URLs, missing explore stubs, slug mismatches).

## Key Files

| File | Purpose |
|------|---------|
| `quartz.config.ts` | Quartz configuration. CrawlLinks uses `markdownLinkResolution: "shortest"` |
| `quartz/trails.ts` | All 140 story trails. Trail stops reference notes by `slug` (folder path + basename, no `.md`) |
| `quartz/components/HeroGraph.tsx` | D3 force-directed hero graph on homepage (visual only, nodes are not clickable links) |
| `quartz/components/scripts/knowledge-graphs.inline.ts` | 58 interactive knowledge graphs. Lazy-loads data from `knowledge-graphs.json` only when the homepage container exists. |
| `quartz/static/knowledge-graphs.json` | All 58 graph datasets + 8 categories (225KB). Fetched on demand, not bundled in JS. |
| `quartz/components/scripts/raila-graph.inline.ts` | Standalone Raila Odinga relationship graph (removed from bundle — still exists but not imported in `components/index.ts`) |
| `quartz/static/sw.js` | Service worker: cache-first for static assets, network-first for HTML. Precaches `scores.json` and `trail-scores.json`. |
| `quartz/components/DailyThemeGrid.tsx` | Theme grid on homepage. Links to `/explore/*` stub pages |
| `quartz/components/TrailNav.tsx` | Trail navigation UI (top + bottom) rendered on trail stop pages |
| `content/explore/*.md` | Explore landing pages. These are stubs with `<div class="ok-explore-tree" data-root="...">` — do NOT delete them |
| `quartz/components/TrailHub.tsx` | STORY-TRAILS page. Generates trail card URLs from `trail.name` via `.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9:-]/g, '')` |
| `content/Trails/*.md` | Trail intro pages. Each has a "Begin Trail" button linking to the first stop. **Filename must match the URL slug generated by TrailHub.tsx** |
| `quartz/components/scripts/daily-note.inline.ts` | "Today in Kenya's history" homepage widget. Reads `/static/scores.json` for scored notes |
| `quartz/static/scores.json` | Scored notes for daily note widget. Keys are slugs — must match actual file paths |
| `content/index.md` | Homepage content with dynamic `{{NOTE_COUNT}}` etc. placeholders |
| `scripts/rescan.cjs` | Dead link scanner |
| `quartz/components/PagefindSearch.tsx` | Pagefind-based search modal with focus trap and ARIA roles |
| `quartz/plugins/emitters/folderPage.tsx` | Folder page emitter — patched to fix relative URL resolution for folder hub notes |
| `quartz/components/Darkmode.tsx` | Light/dark mode toggle (pill switch with label). Defaults light, respects `prefers-color-scheme`, persists via `localStorage` |

## Search

Search uses **Pagefind** (not FlexSearch). Pagefind indexes the built HTML files and serves results client-side.

- **Build:** `npx pagefind --site public` must run after `npx quartz build` (already chained in `npm run build`)
- **Dev server:** The `--serve` mode rebuilds `public/` from scratch, so pagefind must be re-run manually after the server starts: `npx pagefind --site public`
- **Component:** `quartz/components/PagefindSearch.tsx` + `quartz/components/scripts/pagefind-search.inline.ts`
- **Assets:** Pagefind generates `/pagefind/pagefind-ui.js`, `/pagefind/pagefind-ui.css`, and index files into `public/pagefind/`
- **Styling:** Pagefind CSS variables are overridden in `quartz/styles/custom.scss` for dark mode support

## Trail System

Trails are defined in `quartz/trails.ts`. Each trail has:
- `id` — unique identifier
- `name` — display name
- `stops[]` — ordered list of `{ slug, title }` where slug is the path relative to `content/` without `.md`

Trail intro pages in `content/Trails/` link to the **first stop** via a hardcoded `<a href="..." class="trail-begin-btn">`. The `TrailNav` component then renders prev/next navigation on each stop page by matching the page slug against `slugToTrails`.

**When moving a trail stop note:** Update both the slug in `quartz/trails.ts` AND the `href` in the trail intro page if it's the first stop.

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
- `content/explore/` — Explore stub pages with `<div class="ok-explore-tree">` used by DailyThemeGrid
- `content/Trails/` — Trail intro pages linked from STORY-TRAILS hub

## Build & Dev

- **Node.js:** v22+ (uses `.cjs` extension for CommonJS scripts)
- **Build:** `npm run build` chains: quartz build → pagefind index → extract-graph
- **Build time:** ~60 seconds for 7,756+ files + ~13 seconds for pagefind indexing
- **Port conflicts:** Kill stale processes with `lsof -ti:8080 | xargs kill -9` before restarting
- **Git date warnings:** Untracked files show "dates will be inaccurate" warnings — safe to ignore
- **`public/` directory:** Sometimes needs `rm -rf public/` before rebuild if you hit ENOTEMPTY errors

## Useful Scripts

Active scripts in `scripts/`. Legacy scripts archived in `scripts/archive/`.

| Script | Purpose |
|--------|---------|
| `rescan.cjs` | Scan for dead wikilinks (fast, no server needed) |
| `crawl-404s.py` | Playwright BFS crawler for 404 detection (needs dev server running) |
| `dedup-notes.cjs` | Find and remove duplicate basenames (keeps larger file, skips protected dirs) |
| `fix-trail-slugs.cjs` | Update trail slugs in `trails.ts` after moving files |
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

- **Skip-to-content link** — visually hidden, appears on Tab focus, jumps to `#quartz-body`
- **ARIA landmarks** — `<main role="main">` for content, `<nav role="navigation">` for left sidebar, `<aside role="complementary">` for right sidebar
- **Focus indicators** — `:focus-visible` outlines on all interactive elements (mouse clicks unaffected)
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables all animations, transitions, and smooth scroll
- **Dark mode** — defaults to light, respects `prefers-color-scheme`, persists choice in `localStorage`. Toggle is a labeled pill switch in the sidebar.
- **Search accessibility** — modal has `role="dialog"`, `aria-modal="true"`, focus trap, labeled close button, `aria-hidden` toggled on open/close
- **Reader mode** — button in sidebar for distraction-free reading
- **Semantic HTML** — proper heading hierarchy, `<article>`, `<nav>`, `<footer>`, `<time>` elements
- **Relative font sizes** — all text uses rem/em units, respects user's browser font size

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
- **Folder hub notes:** If a folder (e.g., `Startups/`) has a matching root `.md` file (`Startups.md`), do NOT also create `Startups/index.md` — it would break `[[Startups]]` wikilink resolution.
- **Image alt text:** Always include meaningful alt text on images in content files for screen reader users.

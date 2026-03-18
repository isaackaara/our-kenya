# Our Kenya — CLAUDE.md

## Project Overview

Our Kenya (ourkenya.com) is a knowledge graph of Kenya's history built as a Quartz v4.5.2 static site. 7,676 notes, 140 story trails, 58 interactive knowledge graphs. Deployed on Cloudflare Pages.

- **Repo:** isaackaara/our-kenya on GitHub
- **Branch:** v4 (main working branch)
- **Content:** `content/` directory — 82 subdirectories + flat files, all Markdown
- **Dev server:** `npx quartz build --serve -d content` → http://localhost:8080
- **Build:** `npx quartz build -d content` (must complete with zero errors before pushing)
- **Deploy:** Push to v4 → Cloudflare Pages auto-deploys

## Content Architecture

### Note Identity

A note's identity is its **filename without extension**. The wikilink `[[Mau Mau Uprising]]` resolves to whichever file is named `Mau Mau Uprising.md`, regardless of folder.

**Critical rule: every basename must be unique across the entire `content/` directory.** Duplicate basenames break Quartz's "shortest" link resolution — when two files share a name, Quartz can't pick one and generates broken relative URLs (404s). Before creating a new note, always check:

```bash
find content -name "Your Note Name.md"
```

### Folder Structure

Notes live in topical subdirectories (`Kikuyu/`, `Counties/Nairobi/`, `Corruption/`, etc.) and some at the content root. The folder determines the URL path but not the wikilink target.

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
node scripts/rescan.cjs           # summary
node scripts/rescan.cjs --top 20  # top 20 dead targets by ref count
node scripts/rescan.cjs --all     # all dead targets
```

## Key Files

| File | Purpose |
|------|---------|
| `quartz.config.ts` | Quartz configuration. CrawlLinks uses `markdownLinkResolution: "shortest"` |
| `quartz/trails.ts` | All 140 story trails. Trail stops reference notes by `slug` (folder path + basename, no `.md`) |
| `quartz/components/HeroGraph.tsx` | D3 force-directed hero graph on homepage (visual only, nodes are not clickable links) |
| `quartz/components/scripts/knowledge-graphs.inline.ts` | 58 interactive knowledge graphs. Randomized on each page load. Graph data is hardcoded. |
| `quartz/components/scripts/raila-graph.inline.ts` | Standalone Raila Odinga relationship graph (legacy, data also in knowledge-graphs) |
| `quartz/components/DailyThemeGrid.tsx` | Theme grid on homepage. Links to `/explore/*` stub pages |
| `quartz/components/TrailNav.tsx` | Trail navigation UI (top + bottom) rendered on trail stop pages |
| `content/explore/*.md` | Explore landing pages. These are stubs with `<div class="ok-explore-tree" data-root="...">` — do NOT delete them |
| `content/Trails/*.md` | Trail intro pages. Each has a "Begin Trail" button linking to the first stop |
| `content/index.md` | Homepage content with dynamic `{{NOTE_COUNT}}` etc. placeholders |
| `scripts/rescan.cjs` | Dead link scanner |

## Trail System

Trails are defined in `quartz/trails.ts`. Each trail has:
- `id` — unique identifier
- `name` — display name
- `stops[]` — ordered list of `{ slug, title }` where slug is the path relative to `content/` without `.md`

Trail intro pages in `content/Trails/` link to the **first stop** via a hardcoded `<a href="..." class="trail-begin-btn">`. The `TrailNav` component then renders prev/next navigation on each stop page by matching the page slug against `slugToTrails`.

**When moving a trail stop note:** Update both the slug in `quartz/trails.ts` AND the `href` in the trail intro page if it's the first stop.

## Build & Dev

- **Node.js:** v25+ (uses `.cjs` extension for CommonJS scripts)
- **Build time:** ~45 seconds for 7,676 files
- **Port conflicts:** Kill stale processes with `lsof -ti:8080 | xargs kill -9` before restarting
- **Git date warnings:** Untracked files show "dates will be inaccurate" warnings — safe to ignore
- **`public/` directory:** Sometimes needs `rm -rf public/` before rebuild if you hit ENOTEMPTY errors

## Useful Scripts

All in `scripts/`, all `.cjs` (CommonJS for Node v25+):

- `rescan.cjs` — Scan for dead wikilinks
- `dedup-notes.cjs` — Find and remove duplicate basenames (keeps larger file)
- `fix-trail-slugs.cjs` — Update trail slugs after moving files
- `tier1-cleanup.cjs` — Remove obvious duplicate stubs (root stubs, quoted-path dirs)

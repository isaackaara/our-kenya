'use strict'

const fs = require('fs')
const path = require('path')

// ── Config ─────────────────────────────────────────────────────────────────
const CONTENT_DIR = path.join(process.env.HOME, 'Projects/kenya-history/content')
const OUT_SCORES  = path.join(process.env.HOME, 'Projects/kenya-history/quartz/static/scores.json')
const OUT_TRAILS  = path.join(process.env.HOME, 'Projects/kenya-history/quartz/static/trail-scores.json')

// ── Category base scores [emotion, wonder] ─────────────────────────────────
const CATEGORY_BASES = {
  // Administrative / geographical
  'Counties':           [2, 2],
  'Architecture':       [3, 7],
  'Technology':         [3, 6],
  'Elections':          [4, 4],
  'Presidencies':       [4, 5],
  'Political Movements':[5, 5],
  'East Africa':        [4, 5],
  // Culture / arts
  'Music':              [5, 6],
  'Film':               [4, 6],
  'Literature':         [5, 6],
  'Photography':        [4, 6],
  'Food':               [4, 6],
  'Sports':             [5, 5],
  'Religion':           [4, 5],
  // Social / historical drama
  'Education':          [4, 5],
  'Media':              [4, 5],
  'Corporate Kenya':    [3, 5],
  'Legacy':             [5, 5],
  'Cross-Ethnic':       [5, 6],
  'Corruption':         [5, 5],
  'Labour':             [5, 5],
  'Health':             [5, 5],
  'Conservation':       [5, 6],
  'Diaspora':           [5, 6],
  // High emotion groups
  'Colonial Kenya':     [6, 5],
  'Military':           [6, 5],
  'Asians':             [5, 6],
  'Europeans':          [4, 5],
  'Indian Ocean':       [4, 7],
  'Coast History':      [5, 7],
  'Swahili':            [4, 7],
  // Ethnic communities (often rich culture, some trauma)
  'Kikuyu':             [6, 5],
  'Luo':                [5, 5],
  'Luhya':              [4, 5],
  'Kalenjin':           [5, 6],
  'Kamba':              [5, 6],
  'Maasai':             [5, 7],
  'Kisii':              [4, 5],
  'Meru':               [4, 5],
  'Embu':               [4, 5],
  'Tharaka':            [4, 6],
  'Mijikenda':          [4, 6],
  'Samburu':            [5, 7],
  'Turkana':            [6, 7],
  'Taita':              [4, 6],
  'Somali':             [6, 6],
  // Highest emotion categories
  'Women':              [7, 5],
  'Poverty':            [7, 5],
  'Refugees':           [8, 5],
  'Forest Peoples':     [7, 7],
  // Trails are curated stories - higher baseline
  'Trails':             [7, 7],
}

// ── Emotion keyword signals ─────────────────────────────────────────────────
const EMOTION_HIGH = [
  'killed', 'murdered', 'massacred', 'genocide', 'executed', 'hanged', 'death', 'died',
  'sacrifice', 'martyr', 'suffering', 'suffered', 'torture', 'tortur', 'brutal',
  'detained', 'imprisoned', 'prison', 'exile', 'displaced', 'refugee',
  'famine', 'hunger', 'starvation', 'drought', 'poverty', 'destitute',
  'protest', 'uprising', 'rebellion', 'revolution', 'resistance', 'freedom fighter',
  'liberation', 'independence', 'freedom', 'oppression', 'colonialism', 'slavery',
  'grief', 'mourning', 'tragedy', 'heartbreak', 'anguish',
  'triumph', 'survived', 'overcame', 'resilience', 'resilient',
  'children', 'mothers', 'orphan', 'widow', 'family torn',
  'massacre', 'slaughter', 'atrocity', 'war crime', 'ethnic cleansing',
  'never surrendered', 'last stand', 'betrayed', 'abandoned',
  'hanged at', 'shot dead', 'bodies found', 'mass grave', 'unmarked grave',
  'trauma', 'violation', 'assault', 'rape', 'forced', 'coercion',
  'never won', 'persevered', 'fought against', 'despite all odds',
  'historic', 'first african', 'first woman', 'first kenyan',
]

const EMOTION_LOW = [
  'county', 'administrative', 'headquarters', 'sub-county', 'ward',
  'census', 'population', 'km²', 'kilometres', 'square',
  'amendment', 'statute', 'regulation', 'section', 'article', 'clause',
  'ministry', 'department', 'committee', 'parliamentary', 'legislature',
  'geographical', 'located', 'bordered', 'coordinates',
  'budget', 'revenue', 'fiscal', 'allocation', 'funding',
]

// ── Wonder keyword signals ──────────────────────────────────────────────────
const WONDER_HIGH = [
  'first', 'oldest', 'ancient', 'discovered', 'unknown', 'secret', 'hidden',
  'surprising', 'unexpected', 'revolutionary', 'transformed', 'paradox', 'irony',
  'forgotten', 'mysterious', 'remarkable', 'extraordinary', 'unprecedented',
  "world's largest", "world's oldest", 'largest in africa', 'unique to',
  'few people know', 'little known', 'rarely discussed', 'buried history',
  'counterintuitive', 'defied', 'against all', 'contradicted',
  'smuggled', 'underground', 'clandestine', 'covert',
  'predates', 'older than', 'centuries before', 'traced back to',
  'invented', 'pioneered', 'originated', 'genesis',
  'inspired by', 'influenced by', 'shaped the', 'changed everything',
  'ironic', 'twist', 'unexpected twist', 'turned out',
  'strange', 'bizarre', 'peculiar', 'eccentric',
  'accidentally', 'by chance', 'unintended', 'side effect',
  'thousand years', 'millennia', 'ancient trade', 'silk road',
  'genetic', 'dna evidence', 'archaeology', 'excavation', 'fossil',
  'still unknown', 'mystery remains', 'never explained',
  'nobody expected', 'shocked', 'astonished', 'stunned',
]

const WONDER_LOW = [
  'county', 'located in', 'bordered by', 'population',
  'election results', 'votes cast', 'percentage', 'turnout',
  'minister appointed', 'committee formed', 'policy',
  'administrative', 'headquarters', 'offices',
]

// ── Title-based score boosts ────────────────────────────────────────────────
const TITLE_EMOTION_HIGH = [
  'death', 'last days', 'killed', 'executed', 'hanged', 'murder', 'massacre',
  'sacrifice', 'struggle', 'freedom', 'liberation', 'independence', 'martyr',
  'resistance', 'uprising', 'revolution', 'protest', 'mau mau',
  'exile', 'prison', 'detained', 'arrested', 'deported',
  'famine', 'drought', 'hunger', 'refugee',
  'first', 'pioneer', 'trailblazer',
  "women's", 'mothers', 'daughters', 'sisters',
  'betrayal', 'betrayed', 'corruption', 'scandal',
  'dynasty', 'hustler', 'crisis', 'election violence',
  'land', 'dispossession', 'eviction', 'landless',
]

const TITLE_WONDER_HIGH = [
  'secret', 'hidden', 'unknown', 'forgotten', 'mystery', 'mysterious',
  'oldest', 'ancient', 'first', 'origins', 'genesis',
  'surprising', 'unexpected', 'paradox', 'irony',
  'world', 'largest', 'never', 'unique', 'bizarre',
  'underground', 'contraband', 'smuggled',
  'invented', 'revolution', 'transformed', 'changed',
  'thousand year', 'century', 'ancient', 'prehistoric',
]

// ── Helpers ─────────────────────────────────────────────────────────────────

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, Math.round(v)))
}

function countKeywordHits(text, keywords) {
  const lower = text.toLowerCase()
  let hits = 0
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) hits++
  }
  return hits
}

function getCategoryFromPath(filePath) {
  const rel = path.relative(CONTENT_DIR, filePath)
  const parts = rel.split(path.sep)
  if (parts.length === 1) return 'Root'
  return parts[0]
}

function makeSlug(filePath) {
  const rel = path.relative(CONTENT_DIR, filePath)
  return rel.replace(/\.md$/, '').split(path.sep).map(s => s.replace(/ /g, '-')).join('/')
}

function scoreFile(filePath) {
  const category = getCategoryFromPath(filePath)
  const title = path.basename(filePath, '.md').toLowerCase()

  // Read content (first 800 chars for signals)
  let content = ''
  try {
    content = fs.readFileSync(filePath, 'utf8').slice(0, 800)
  } catch {
    content = ''
  }
  const fullText = (title + ' ' + content).toLowerCase()

  // Base scores from category
  const bases = CATEGORY_BASES[category] || [4, 4]
  let e = bases[0]
  let w = bases[1]

  // Emotion adjustments
  const eHigh = countKeywordHits(fullText, EMOTION_HIGH)
  const eLow  = countKeywordHits(fullText, EMOTION_LOW)
  e += Math.min(eHigh, 4) * 0.6
  e -= Math.min(eLow, 3) * 0.5

  // Wonder adjustments
  const wHigh = countKeywordHits(fullText, WONDER_HIGH)
  const wLow  = countKeywordHits(fullText, WONDER_LOW)
  w += Math.min(wHigh, 4) * 0.6
  w -= Math.min(wLow, 3) * 0.5

  // Title-specific boosts (title is a strong signal)
  const titleEmotionHits = countKeywordHits(title, TITLE_EMOTION_HIGH)
  const titleWonderHits  = countKeywordHits(title, TITLE_WONDER_HIGH)
  e += titleEmotionHits * 0.7
  w += titleWonderHits * 0.7

  // Trail bonus - trails are curated, high-quality stories
  if (category === 'Trails') {
    // Trails get a content-length bonus (longer = richer)
    const contentLen = content.length
    if (contentLen > 400) { e += 0.5; w += 0.5 }
  }

  // Content length signal - longer/denser content = more likely to be rich
  const contentLen = content.replace(/---[\s\S]*?---/, '').trim().length
  if (contentLen > 600) { e += 0.3; w += 0.3 }
  if (contentLen < 100) { e -= 0.5; w -= 0.5 }

  return { e: clamp(e, 1, 10), w: clamp(w, 1, 10) }
}

// ── File collection ─────────────────────────────────────────────────────────

function collectMdFiles(dir, excludeDirs = []) {
  let results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!excludeDirs.includes(entry.name)) {
        results = results.concat(collectMdFiles(full, excludeDirs))
      }
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
      results.push(full)
    }
  }
  return results
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('Kenya History Scorer (Heuristic Mode)')
  console.log('======================================')

  const trailsDir = path.join(CONTENT_DIR, 'Trails')

  // Collect notes (exclude Trails, explore, and top-level non-note .md files)
  const SKIP_FILES = new Set(['index.md', 'Explore.md', 'Kenya.md', 'STORY-TRAILS.md', 'contribute.md', 'support.md'])
  const noteFiles = collectMdFiles(CONTENT_DIR, ['Trails', 'explore'])
    .filter(f => !SKIP_FILES.has(path.basename(f)))

  const trailFiles = collectMdFiles(trailsDir)

  console.log(`Found ${noteFiles.length} notes and ${trailFiles.length} trails`)

  // Score all notes
  const noteScores = {}
  for (let i = 0; i < noteFiles.length; i++) {
    const f = noteFiles[i]
    const slug = makeSlug(f)
    noteScores[slug] = scoreFile(f)
    if ((i + 1) % 500 === 0 || i === noteFiles.length - 1) {
      console.log(`  Notes: ${i + 1}/${noteFiles.length}`)
    }
  }

  // Score trails
  const trailScores = {}
  for (const f of trailFiles) {
    const slug = makeSlug(f)
    trailScores[slug] = scoreFile(f)
  }
  console.log(`  Trails: ${trailFiles.length}/${trailFiles.length}`)

  // Write outputs
  fs.writeFileSync(OUT_SCORES, JSON.stringify(noteScores, null, 2))
  fs.writeFileSync(OUT_TRAILS, JSON.stringify(trailScores, null, 2))
  console.log(`\nWrote ${Object.keys(noteScores).length} scores to ${OUT_SCORES}`)
  console.log(`Wrote ${Object.keys(trailScores).length} trail scores to ${OUT_TRAILS}`)

  // Top 10 stats
  function topN(scores, key, n = 10) {
    return Object.entries(scores)
      .sort((a, b) => b[1][key] - a[1][key])
      .slice(0, n)
      .map(([slug, s]) => `  ${s[key]}  ${slug}`)
      .join('\n')
  }

  const allScores = { ...noteScores, ...trailScores }

  console.log('\nTop 10 WONDER scores:')
  console.log(topN(allScores, 'w'))
  console.log('\nTop 10 EMOTION scores:')
  console.log(topN(allScores, 'e'))

  console.log('\n=== SUMMARY ===')
  console.log(`Notes scored: ${Object.keys(noteScores).length}/${noteFiles.length}`)
  console.log(`Trails scored: ${Object.keys(trailScores).length}/${trailFiles.length}`)
  console.log('Failures: 0')

  // Score distribution
  function distribution(scores) {
    const dist = Array(11).fill(0)
    for (const s of Object.values(scores)) { dist[s.e]++; }
    return dist.slice(1).map((c, i) => `${i + 1}:${c}`).join(' ')
  }
  console.log('Emotion dist:', distribution(noteScores))

  console.log('\nTop 5 WONDER:')
  console.log(topN(allScores, 'w', 5))
  console.log('\nTop 5 EMOTION:')
  console.log(topN(allScores, 'e', 5))
}

main()

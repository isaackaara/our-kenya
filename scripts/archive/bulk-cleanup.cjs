// Comprehensive cleanup: remove dead links for targets that are:
// 1. Generic single words or short phrases that aren't real Kenya topics
// 2. Duplicates/near-matches of existing notes (redirect)
// 3. Too vague to warrant a note

const fs = require('fs');
const path = require('path');

function getAllMd(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      results = results.concat(getAllMd(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

const files = getAllMd('content');
const existingNotes = new Set();
const existingLower = new Map();
for (const f of files) {
  const name = path.basename(f, '.md');
  existingNotes.add(name);
  const lower = name.toLowerCase();
  if (!existingLower.has(lower)) existingLower.set(lower, name);
}

// Scan dead targets
const wikiRe = /\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|[^\]]+?)?\]\]/g;
const deadTargets = {};
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = wikiRe.exec(content)) !== null) {
    let target = match[1].trim();
    if (!existingNotes.has(target)) {
      if (!deadTargets[target]) deadTargets[target] = 0;
      deadTargets[target]++;
    }
  }
}

// Generic terms to delink (single words or non-topic phrases)
const genericPatterns = [
  // Single common words
  /^[a-z]+$/, // all lowercase single words like "economy", "politics", etc.
  // Very generic terms
  /^(The |A )?(Society|Culture|Heritage|History|Development|Systems?|Services?|Access|Policy|Research|Management|Protection|Organization|Networks?|Patterns?|Resources?|Security|Status|Sectors?|Markets?|Standards?|Reforms?|Relations?|Communities?|Populations?|Governance|Planning|Strategy|Assessment|Analysis|Framework|Integration|Innovation|Regulation|Monitoring|Prevention|Response|Recovery|Resilience|Capacity|Impact|Outcomes?)$/i,
];

function isGeneric(target) {
  // Single lowercase words
  if (/^[a-z]+$/.test(target) && target.length < 15) return true;
  // Very short generic terms
  if (target.length <= 3) return true;
  // Year only
  if (/^\d{4}$/.test(target)) return true;
  return false;
}

// Build redirect map and removal set
const redirects = {};
const removals = new Set();

for (const target of Object.keys(deadTargets)) {
  // Skip if already being handled (high ref targets that agents will create)

  // Case-insensitive match
  if (existingLower.has(target.toLowerCase()) && !existingNotes.has(target)) {
    redirects[target] = existingLower.get(target.toLowerCase());
    continue;
  }

  // Check variations
  const variations = [
    target + ' Kenya',
    target.replace(/ Kenya$/, ''),
    'The ' + target,
    target.replace(/^The /, ''),
    target.replace(/-/g, ' '),
    target.replace(/ /g, '-'),
  ];
  let found = false;
  for (const v of variations) {
    if (existingNotes.has(v)) {
      redirects[target] = v;
      found = true;
      break;
    }
  }
  if (found) continue;

  // Generic term removal
  if (isGeneric(target)) {
    removals.add(target);
  }
}

// Apply redirects and removals
let totalFixed = 0;
let filesFixed = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  let fixed = 0;

  // Apply redirects
  for (const [from, to] of Object.entries(redirects)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\[\\[${escaped}((?:#[^\\]|]*)?(?:\\|[^\\]]+?)?)\\]\\]`, 'g');
    content = content.replace(re, (match, suffix) => {
      fixed++;
      return `[[${to}${suffix}]]`;
    });
  }

  // Remove generic links
  for (const term of removals) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reAlias = new RegExp(`\\[\\[${escaped}\\|([^\\]]+?)\\]\\]`, 'g');
    content = content.replace(reAlias, (match, alias) => { fixed++; return alias; });
    const reNoAlias = new RegExp(`\\[\\[${escaped}\\]\\]`, 'g');
    content = content.replace(reNoAlias, () => { fixed++; return term; });
  }

  if (content !== original) {
    fs.writeFileSync(f, content);
    filesFixed++;
    totalFixed += fixed;
  }
}

console.log(`Bulk cleanup: ${totalFixed} refs fixed/removed across ${filesFixed} files`);
console.log(`Redirects applied: ${Object.keys(redirects).length}`);
console.log(`Generic terms delinked: ${removals.size}`);

// Output some stats
let redirectRefs = 0, removalRefs = 0;
for (const [t, c] of Object.entries(deadTargets)) {
  if (redirects[t]) redirectRefs += c;
  if (removals.has(t)) removalRefs += c;
}
console.log(`Redirect refs: ${redirectRefs}, Removal refs: ${removalRefs}`);

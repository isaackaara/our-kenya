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
const notesByLower = new Map();
for (const f of files) {
  const name = path.basename(f, '.md');
  existingNotes.add(name);
  const lower = name.toLowerCase();
  if (!notesByLower.has(lower)) notesByLower.set(lower, []);
  notesByLower.get(lower).push(name);
}

// Get dead targets
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

const sorted = Object.entries(deadTargets).sort((a, b) => b[1] - a[1]);

// For the top dead targets, try to find the best matching existing note
const redirects = {};

// Fuzzy matching strategies
function findMatch(target) {
  // 1. Case-insensitive exact
  const lower = target.toLowerCase();
  if (notesByLower.has(lower)) {
    const matches = notesByLower.get(lower);
    if (matches.length === 1) return matches[0];
  }

  // 2. Common suffix/prefix variations
  const variations = [
    target + ' Kenya',
    target.replace(/ Kenya$/, ''),
    'The ' + target,
    target.replace(/^The /, ''),
    target.replace(/ and /g, ' & '),
    target.replace(/ & /g, ' and '),
    target.replace(/-/g, ' '),
    target.replace(/ /g, '-'),
    target.replace(/'/g, "'"),
    target.replace(/'/g, "'"),
  ];

  for (const v of variations) {
    if (existingNotes.has(v)) return v;
  }

  return null;
}

// Find all possible redirects
for (const [target, count] of sorted) {
  const match = findMatch(target);
  if (match) {
    redirects[target] = match;
  }
}

// Additional manual mappings for important high-ref targets
const manualMappings = {
  'Kenya Constitution 2010': null,  // Need to create
  'Nairobi History': null,  // Need to create
  'Kenya Political Economy': null,  // Need to create
  'Kenya Land Reform': null,  // Need to create
  'Kenya Railways': null,  // Need to create
  'KANU': null,  // KANU directory exists but no KANU.md
  'Kenya Human Rights Commission': null,  // Need to create
  'Kenya Defence Forces': null,  // Need to create
  'Tsavo': 'Tsavo Ecosystem',
  'ODM': null,  // Need to create
  'Horticultural Exports Kenya': 'Horticultural Export Growth',
  'Indian Communities Kenya': null,
  'Agriculture Kenya': null,
  'Maasai Mara': 'Maasai Mara National Reserve',
  'Jubilee Party': null,
};

for (const [from, to] of Object.entries(manualMappings)) {
  if (to && existingNotes.has(to)) {
    redirects[from] = to;
  }
}

// Output
console.log('Redirects found:', Object.keys(redirects).length);
let totalRedirectRefs = 0;
for (const [from, to] of Object.entries(redirects)) {
  const refs = deadTargets[from] || 0;
  totalRedirectRefs += refs;
  if (refs >= 3) console.log(`${refs}\t${JSON.stringify(from)} -> ${JSON.stringify(to)}`);
}
console.log('Total refs to redirect:', totalRedirectRefs);

// Remaining dead targets that need notes created
const remaining = sorted.filter(([t]) => !redirects[t]);
console.log('\nRemaining dead targets:', remaining.length);
console.log('Remaining refs:', remaining.reduce((s, [, c]) => s + c, 0));
console.log('\nTop 30 remaining:');
for (const [t, c] of remaining.slice(0, 30)) {
  console.log(`${c}\t${t}`);
}

fs.writeFileSync('scripts/all-redirects.json', JSON.stringify(redirects, null, 2));

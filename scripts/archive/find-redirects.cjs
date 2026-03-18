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
  existingLower.set(name.toLowerCase(), name);
}

const dead = require('./dead-targets-post-phase1.json');

const redirects = {};
for (const target of Object.keys(dead)) {
  // Case-insensitive match
  const lower = target.toLowerCase();
  if (existingLower.has(lower) && !existingNotes.has(target)) {
    redirects[target] = existingLower.get(lower);
    continue;
  }

  // Common variations
  const variations = [
    target.replace(/ and /g, ' & '),
    target.replace(/ & /g, ' and '),
    target.replace(/-/g, ' '),
    target.replace(/ /g, '-'),
    target + ' Kenya',
    target.replace(/ Kenya$/, ''),
    target.replace(/^The /, ''),
    'The ' + target,
  ];

  for (const v of variations) {
    if (existingNotes.has(v) && v !== target) {
      redirects[target] = v;
      break;
    }
  }
}

// Manual known duplicates
const manualChecks = {
  'Mau Mau Rebellion': 'Mau Mau Uprising',
  'Mau Mau': 'Mau Mau Uprising',
  'Mau Mau rebellion': 'Mau Mau Uprising',
  '2007 Post-Election Violence': '2007-2008 Post Election Violence',
  'Moi': 'Daniel arap Moi Era',
  'Kibaki': 'Mwai Kibaki',
  'Miraa': 'Miraa Trade',
  'Meru people': 'Meru People',
  'Giriama': 'Giriama Resistance',
};

for (const [dead_t, existing_t] of Object.entries(manualChecks)) {
  if (existingNotes.has(existing_t) && !existingNotes.has(dead_t)) {
    redirects[dead_t] = existing_t;
  }
}

console.log('Found', Object.keys(redirects).length, 'near-duplicate redirects:');
const sorted = Object.entries(redirects).sort((a, b) => (dead[b[0]] || 0) - (dead[a[0]] || 0));
let totalRefs = 0;
for (const [from, to] of sorted) {
  const refs = dead[from] || 0;
  totalRefs += refs;
  console.log(refs + ' refs: ' + JSON.stringify(from) + ' -> ' + JSON.stringify(to));
}
console.log('\nTotal refs to redirect:', totalRefs);

fs.writeFileSync('scripts/redirects.json', JSON.stringify(redirects, null, 2));
console.log('Wrote redirects.json');

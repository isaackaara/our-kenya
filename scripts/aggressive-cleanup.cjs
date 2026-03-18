const fs = require('fs');
const path = require('path');

function getAllMd(dir) {
  let r = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') r = r.concat(getAllMd(f));
    else if (e.isFile() && e.name.endsWith('.md')) r.push(f);
  }
  return r;
}

const files = getAllMd('content');
const existing = new Set();
const existingLower = new Map();
for (const f of files) {
  const name = path.basename(f, '.md');
  existing.add(name);
  if (!existingLower.has(name.toLowerCase())) existingLower.set(name.toLowerCase(), name);
}

const wikiRe = /\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|[^\]]+?)?\]\]/g;
const dead = {};
const deadFiles = {};
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = wikiRe.exec(c)) !== null) {
    const t = m[1].trim();
    if (!existing.has(t)) {
      if (!dead[t]) { dead[t] = 0; deadFiles[t] = []; }
      dead[t]++;
      if (deadFiles[t].length < 3) deadFiles[t].push(f);
    }
  }
}

function shouldRemove(target, count) {
  // 1. Single/double lowercase words (generic)
  if (/^[a-z][a-z ]*$/.test(target) && target.length < 25) return true;

  // 2. Very short targets
  if (target.length <= 4) return true;

  // 3. Years
  if (/^\d{4}$/.test(target)) return true;

  // 4. Single refs that are very generic or non-Kenya-specific
  if (count === 1) {
    // Single words (even capitalized)
    if (!target.includes(' ') && target.length < 15) return true;
    // Generic two-word phrases that aren't Kenya-specific
    if (target.split(' ').length <= 2 && !/Kenya|Nairobi|Mombasa|Kisumu|Kikuyu|Luo|Kamba|Luhya|Maasai|Samburu|Turkana|Somali|Swahili|Meru|Giriama|Mijikenda|Kalenjin|Borana|Rendille|Pokot|Teso|Taita|Digo|Rabai|Duruma/.test(target)) {
      // But keep if it looks like a proper name (both words capitalized)
      const words = target.split(' ');
      const allCapped = words.every(w => /^[A-Z]/.test(w));
      if (!allCapped) return true;
    }
  }

  // 5. Generic trade/maritime terms
  if (/^(Copper|Gold|Textile|Merchant|Piracy|Trade|Coral|Ship|Gemstone|Luxury|Maritime|Incense|Market|Pearl|Port|Anchor|Crew|Loading|Sail|Weather|Wave|Current|Tide|Depth|Chart|Route|Signal|Harbor|Coastal|Lighthouse|Position|Cross-Staff|Astrolabe|Kamal|Compass|Magnetic|Direction|Dead Reckoning|Latitude|Longitude) /.test(target) &&
      !/(Kenya|Nairobi|Mombasa|Swahili|Indian Ocean|African)/.test(target)) return true;

  // 6. Patterns that are section headers or structural
  if (/^(Related|Other|See Also|Further|Additional|More|Also|Note|TODO|FIXME|Draft|Test)/i.test(target)) return true;

  return false;
}

function canRedirect(target) {
  if (existingLower.has(target.toLowerCase()) && !existing.has(target)) {
    return existingLower.get(target.toLowerCase());
  }
  const variations = [
    target + ' Kenya', target.replace(/ Kenya$/, ''),
    'The ' + target, target.replace(/^The /, ''),
    target.replace(/-/g, ' '), target.replace(/ /g, '-'),
    target.replace(/ and /g, ' & '), target.replace(/ & /g, ' and '),
  ];
  for (const v of variations) {
    if (existing.has(v)) return v;
  }
  return null;
}

// Process all dead targets
const redirects = {};
const removals = new Set();
let redirectRefs = 0, removeRefs = 0;

for (const [target, count] of Object.entries(dead)) {
  const redirect = canRedirect(target);
  if (redirect) {
    redirects[target] = redirect;
    redirectRefs += count;
  } else if (shouldRemove(target, count)) {
    removals.add(target);
    removeRefs += count;
  }
}

console.log(`Redirects: ${Object.keys(redirects).length} targets, ${redirectRefs} refs`);
console.log(`Removals: ${removals.size} targets, ${removeRefs} refs`);
console.log(`Remaining to create: ${Object.keys(dead).length - Object.keys(redirects).length - removals.size} targets`);

// Apply
let totalFixed = 0, filesFixed = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Redirects
  for (const [from, to] of Object.entries(redirects)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\[\\[${escaped}((?:#[^\\]|]*)?(?:\\|[^\\]]+?)?)\\]\\]`, 'g');
    content = content.replace(re, (m, s) => { totalFixed++; return `[[${to}${s}]]`; });
  }

  // Removals
  for (const term of removals) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reA = new RegExp(`\\[\\[${escaped}\\|([^\\]]+?)\\]\\]`, 'g');
    content = content.replace(reA, (m, a) => { totalFixed++; return a; });
    const reN = new RegExp(`\\[\\[${escaped}\\]\\]`, 'g');
    content = content.replace(reN, () => { totalFixed++; return term; });
  }

  if (content !== original) {
    fs.writeFileSync(f, content);
    filesFixed++;
  }
}

console.log(`\nApplied: ${totalFixed} refs fixed across ${filesFixed} files`);

// Rescan
const files2 = getAllMd('content');
const existing2 = new Set();
for (const f2 of files2) existing2.add(path.basename(f2, '.md'));

let total2 = 0, dead2 = 0;
const deadT2 = {};
for (const f2 of files2) {
  const c = fs.readFileSync(f2, 'utf8');
  let m;
  while ((m = wikiRe.exec(c)) !== null) {
    total2++;
    const t = m[1].trim();
    if (!existing2.has(t)) { dead2++; if (!deadT2[t]) deadT2[t] = 0; deadT2[t]++; }
  }
}
const sorted2 = Object.entries(deadT2).sort((a, b) => b[1] - a[1]);

console.log(`\nPost-cleanup:`);
console.log(`Total links: ${total2}, Dead: ${dead2}, Live: ${total2 - dead2} (${((total2 - dead2) / total2 * 100).toFixed(1)}%)`);
console.log(`Unique dead targets: ${sorted2.length}`);

const r10 = sorted2.filter(([, c]) => c >= 10);
const r5 = sorted2.filter(([, c]) => c >= 5 && c <= 9);
const r2 = sorted2.filter(([, c]) => c >= 2 && c <= 4);
const r1 = sorted2.filter(([, c]) => c === 1);
console.log(`>=10: ${r10.length} (${r10.reduce((s,[,c])=>s+c,0)} refs)`);
console.log(`5-9: ${r5.length} (${r5.reduce((s,[,c])=>s+c,0)} refs)`);
console.log(`2-4: ${r2.length} (${r2.reduce((s,[,c])=>s+c,0)} refs)`);
console.log(`1: ${r1.length}`);

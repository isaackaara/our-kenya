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

const redirects = require('./redirects.json');
const files = getAllMd('content');

let totalFixed = 0;
let filesFixed = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  let fileFixed = 0;

  for (const [from, to] of Object.entries(redirects)) {
    // Match [[from]], [[from|alias]], [[from#section]], [[from#section|alias]]
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\[\\[${escaped}((?:#[^\\]|]*)?(?:\\|[^\\]]+?)?)\\]\\]`, 'g');
    content = content.replace(re, (match, suffix) => {
      fileFixed++;
      return `[[${to}${suffix}]]`;
    });
  }

  if (content !== original) {
    fs.writeFileSync(f, content);
    filesFixed++;
    totalFixed += fileFixed;
  }
}

console.log(`Applied redirects: ${totalFixed} refs fixed in ${filesFixed} files`);

// Re-scan
const existingNotes = new Set();
const files2 = getAllMd('content');
for (const f of files2) existingNotes.add(path.basename(f, '.md'));

const wikiRe = /\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|[^\]]+?)?\]\]/g;
let totalLinks = 0, deadLinks = 0;
const deadTargets = {};

for (const f of files2) {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = wikiRe.exec(content)) !== null) {
    totalLinks++;
    let target = match[1].trim();
    if (!existingNotes.has(target)) {
      deadLinks++;
      if (!deadTargets[target]) deadTargets[target] = 0;
      deadTargets[target]++;
    }
  }
}

console.log(`\nPost-redirect scan:`);
console.log(`Total wikilinks: ${totalLinks}`);
console.log(`Dead link references: ${deadLinks}`);
console.log(`Unique dead targets: ${Object.keys(deadTargets).length}`);

const sorted = Object.entries(deadTargets).sort((a, b) => b[1] - a[1]);

// Distribution
const refs10plus = sorted.filter(([, c]) => c >= 10);
const refs5to9 = sorted.filter(([, c]) => c >= 5 && c <= 9);
const refs2to4 = sorted.filter(([, c]) => c >= 2 && c <= 4);
const refs1 = sorted.filter(([, c]) => c === 1);
console.log('\nDistribution:');
console.log(`>=10 refs: ${refs10plus.length} targets, ${refs10plus.reduce((s, [, c]) => s + c, 0)} refs`);
console.log(`5-9 refs: ${refs5to9.length} targets, ${refs5to9.reduce((s, [, c]) => s + c, 0)} refs`);
console.log(`2-4 refs: ${refs2to4.length} targets, ${refs2to4.reduce((s, [, c]) => s + c, 0)} refs`);
console.log(`1 ref: ${refs1.length} targets, ${refs1.length} refs`);

console.log('\nTop 30 remaining:');
for (const [t, c] of sorted.slice(0, 30)) {
  console.log(`${c} refs: ${JSON.stringify(t)}`);
}

// Save updated dead targets
const updated = {};
for (const [t, c] of sorted) updated[t] = c;
fs.writeFileSync('scripts/dead-targets-post-redirects.json', JSON.stringify(updated, null, 2));

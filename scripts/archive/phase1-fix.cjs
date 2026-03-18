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
for (const f of files) existingNotes.add(path.basename(f, '.md'));

let totalFixedRefs = 0;
let totalFixedFiles = 0;

// Build replacement map
const replacements = new Map();

// 1a: Path-based wikilinks -> simple basename
// Even if basename note doesn't exist yet, simplify the path so future note creation works
const pathRe = /\[\[([^\]|#]*\/[^\]|#]+?)(\|[^\]]+?)?\]\]/g;

// 1b: Quoted Samburu targets
// [["Samburu County" County|...]] -> [[Samburu County]]
// [["Samburu County" Politics|...]] -> [[Samburu County Politics]]
// etc.
const samburuMap = {
  '"Samburu County" County': 'Samburu County',
  '"Samburu County" Politics': 'Samburu County Politics',
  '"Samburu County" Agriculture': 'Samburu County Agriculture',
  '"Samburu County" Education': 'Samburu County Education',
};

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  let fileFixed = 0;

  // Fix path-based wikilinks
  content = content.replace(pathRe, (match, target, alias) => {
    const basename = target.split('/').pop().trim();
    if (basename === target.trim()) return match; // No path component
    fileFixed++;
    if (alias) {
      return `[[${basename}${alias}]]`;
    }
    return `[[${basename}]]`;
  });

  // Fix quoted Samburu targets
  for (const [bad, good] of Object.entries(samburuMap)) {
    const escaped = bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\[\\[${escaped}(\\|[^\\]]+?)?\\]\\]`, 'g');
    content = content.replace(re, (match, alias) => {
      fileFixed++;
      if (alias) {
        return `[[${good}${alias}]]`;
      }
      return `[[${good}]]`;
    });
  }

  if (content !== original) {
    fs.writeFileSync(f, content);
    totalFixedFiles++;
    totalFixedRefs += fileFixed;
    if (totalFixedFiles <= 10) {
      console.log(`Fixed ${fileFixed} refs in ${f}`);
    }
  }
}

console.log(`\nPhase 1 complete:`);
console.log(`Fixed ${totalFixedRefs} references across ${totalFixedFiles} files`);

// Re-scan to get updated counts
const wikiRe2 = /\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|[^\]]+?)?\]\]/g;
let totalLinks = 0, deadLinks = 0;
const deadTargets = {};

const files2 = getAllMd('content');
const existingNotes2 = new Set();
for (const f of files2) existingNotes2.add(path.basename(f, '.md'));

for (const f of files2) {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = wikiRe2.exec(content)) !== null) {
    totalLinks++;
    let target = match[1].trim();
    if (!existingNotes2.has(target)) {
      deadLinks++;
      if (!deadTargets[target]) deadTargets[target] = 0;
      deadTargets[target]++;
    }
  }
}

console.log(`\nPost-fix scan:`);
console.log(`Total wikilinks: ${totalLinks}`);
console.log(`Dead link references: ${deadLinks}`);
console.log(`Unique dead targets: ${Object.keys(deadTargets).length}`);
console.log(`Live links: ${totalLinks - deadLinks}`);

const sorted = Object.entries(deadTargets).sort((a, b) => b[1] - a[1]);
console.log('\nTop 20 remaining dead targets:');
for (const [target, count] of sorted.slice(0, 20)) {
  console.log(`${count} refs: ${JSON.stringify(target)}`);
}

// Check for remaining path-based
const remainingPaths = sorted.filter(([t]) => t.includes('/'));
console.log(`\nRemaining path-based dead targets: ${remainingPaths.length}`);
if (remainingPaths.length > 0) {
  for (const [t, c] of remainingPaths.slice(0, 10)) {
    console.log(`  ${c} refs: ${JSON.stringify(t)}`);
  }
}

// Check for remaining quoted
const remainingQuoted = sorted.filter(([t]) => t.includes('"'));
console.log(`Remaining quoted dead targets: ${remainingQuoted.length}`);

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

// Save updated dead targets
const updatedDead = {};
for (const [t, c] of sorted) updatedDead[t] = c;
fs.writeFileSync('scripts/dead-targets-post-phase1.json', JSON.stringify(updatedDead, null, 2));

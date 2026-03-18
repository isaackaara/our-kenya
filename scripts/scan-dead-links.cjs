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

const wikiRe = /\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|[^\]]+?)?\]\]/g;
const deadTargets = {};

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = wikiRe.exec(content)) !== null) {
    let target = match[1].trim();
    if (!existingNotes.has(target)) {
      if (!deadTargets[target]) deadTargets[target] = { count: 0, files: [] };
      deadTargets[target].count++;
      if (deadTargets[target].files.length < 5) deadTargets[target].files.push(f);
    }
  }
}

const sorted = Object.entries(deadTargets).sort((a, b) => b[1].count - a[1].count);

// Path-based analysis
const pathBased = sorted.filter(([t]) => t.includes('/'));
let fixableByBasename = 0, fixableRefs = 0;
let unfixablePath = [];
for (const [target, data] of pathBased) {
  const basename = target.split('/').pop();
  if (existingNotes.has(basename)) {
    fixableByBasename++;
    fixableRefs += data.count;
  } else {
    unfixablePath.push([target, data.count, basename]);
  }
}

console.log('=== PHASE 1a: Path-based targets ===');
console.log('Fixable (basename exists):', fixableByBasename, 'targets,', fixableRefs, 'refs');
console.log('Not fixable:', unfixablePath.length, 'targets');
console.log('\nUnfixable path targets (top 30):');
for (const [t, c, b] of unfixablePath.sort((a, b) => b[1] - a[1]).slice(0, 30)) {
  console.log(c, 'refs:', JSON.stringify(t), '-> basename:', JSON.stringify(b));
}

// Quoted analysis
const quoted = sorted.filter(([t]) => t.includes('"'));
console.log('\n=== PHASE 1b: Quoted targets ===');
for (const [t, data] of quoted) {
  console.log(data.count, 'refs:', JSON.stringify(t));
  console.log('  Example files:', data.files.slice(0, 2));
}

// Summary
console.log('\n=== SUMMARY ===');
console.log('Total dead refs:', sorted.reduce((s, [, d]) => s + d.count, 0));
console.log('Unique dead targets:', sorted.length);
console.log('Path-based fixable:', fixableByBasename, '(' + fixableRefs + ' refs)');
console.log('Quoted fixable:', quoted.length, '(' + quoted.reduce((s, [, d]) => s + d.count, 0) + ' refs)');

// Output all dead targets to JSON for further processing
const output = {};
for (const [target, data] of sorted) {
  output[target] = data;
}
fs.writeFileSync('scripts/dead-targets.json', JSON.stringify(output, null, 2));
console.log('\nWrote dead-targets.json');

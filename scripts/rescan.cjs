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
let totalLinks = 0, deadLinks = 0;
const deadTargets = {};

for (const f of files) {
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

const sorted = Object.entries(deadTargets).sort((a, b) => b[1] - a[1]);
const refs10plus = sorted.filter(([, c]) => c >= 10);
const refs5to9 = sorted.filter(([, c]) => c >= 5 && c <= 9);
const refs2to4 = sorted.filter(([, c]) => c >= 2 && c <= 4);
const refs1 = sorted.filter(([, c]) => c === 1);

console.log(`Total wikilinks: ${totalLinks}`);
console.log(`Dead refs: ${deadLinks}`);
console.log(`Unique dead targets: ${sorted.length}`);
console.log(`Live: ${totalLinks - deadLinks} (${((totalLinks - deadLinks) / totalLinks * 100).toFixed(1)}%)`);
console.log(`\n>=10 refs: ${refs10plus.length} targets, ${refs10plus.reduce((s, [, c]) => s + c, 0)} refs`);
console.log(`5-9 refs: ${refs5to9.length} targets, ${refs5to9.reduce((s, [, c]) => s + c, 0)} refs`);
console.log(`2-4 refs: ${refs2to4.length} targets, ${refs2to4.reduce((s, [, c]) => s + c, 0)} refs`);
console.log(`1 ref: ${refs1.length} targets`);

if (process.argv[2] === '--top') {
  const n = parseInt(process.argv[3]) || 30;
  console.log(`\nTop ${n}:`);
  for (const [t, c] of sorted.slice(0, n)) {
    console.log(`${c}\t${t}`);
  }
}

if (process.argv[2] === '--json') {
  const out = {};
  for (const [t, c] of sorted) out[t] = c;
  const outFile = process.argv[3] || 'scripts/dead-targets-latest.json';
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${outFile}`);
}

if (process.argv[2] === '--all') {
  for (const [t, c] of sorted) {
    console.log(`${c}\t${t}`);
  }
}

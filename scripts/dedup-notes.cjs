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

// Protected directories — stubs here are intentional and should never be deduped
const PROTECTED_DIRS = ['content/explore/', 'content/Trails/'];

// Group by basename
const byName = new Map();
for (const f of files) {
  const name = path.basename(f, '.md');
  if (!byName.has(name)) byName.set(name, []);
  byName.get(name).push(f);
}

// Find duplicates
const dupes = [...byName.entries()].filter(([_, paths]) => paths.length > 1);
console.log(`Found ${dupes.length} duplicate basenames\n`);

let totalDeleted = 0;

for (const [name, paths] of dupes) {
  // Get sizes
  const withSize = paths.map(p => ({ path: p, size: fs.statSync(p).size }));
  // Sort by size descending — keep the largest
  withSize.sort((a, b) => b.size - a.size);

  const keep = withSize[0];
  const remove = withSize.slice(1);

  for (const r of remove) {
    // Never delete files in protected directories
    if (PROTECTED_DIRS.some(d => r.path.startsWith(d))) {
      console.log(`SKIP (protected): ${r.path}`);
      continue;
    }
    fs.unlinkSync(r.path);
    totalDeleted++;
    console.log(`DEL: ${r.path} (${r.size}b) — kept ${keep.path} (${keep.size}b)`);
  }
}

// Clean up empty directories
function cleanEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) cleanEmptyDirs(path.join(dir, e.name));
  }
  try {
    const entries = fs.readdirSync(dir);
    if (entries.length === 0 && dir !== 'content') {
      fs.rmdirSync(dir);
      console.log(`RMDIR: ${dir}`);
    }
  } catch {}
}
cleanEmptyDirs('content');

console.log(`\nDeleted ${totalDeleted} duplicate files`);

// Verify no duplicates remain
const filesAfter = getAllMd('content');
const byNameAfter = new Map();
for (const f of filesAfter) {
  const name = path.basename(f, '.md');
  if (!byNameAfter.has(name)) byNameAfter.set(name, []);
  byNameAfter.get(name).push(f);
}
const remaining = [...byNameAfter.entries()].filter(([_, p]) => p.length > 1);
console.log(`Remaining duplicates: ${remaining.length}`);

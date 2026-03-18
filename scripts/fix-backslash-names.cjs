const fs = require('fs');
const path = require('path');

function getAllEntries(dir) {
  let results = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') {
      results = results.concat(getAllEntries(full));
      // Also check if directory name has backslashes
      if (e.name.includes('\\')) {
        results.push({ type: 'dir', path: full, name: e.name });
      }
    } else if (e.isFile() && e.name.includes('\\')) {
      results.push({ type: 'file', path: full, name: e.name });
    }
  }
  return results;
}

const entries = getAllEntries('content');
console.log(`Found ${entries.length} entries with backslashes\n`);

let fixed = 0, skipped = 0;

// Fix files first, then directories
const files = entries.filter(e => e.type === 'file');
const dirs = entries.filter(e => e.type === 'dir');

for (const entry of files) {
  const dir = path.dirname(entry.path);
  const newName = entry.name.replace(/\\/g, ' ').replace(/  +/g, ' ').trim();
  const newPath = path.join(dir, newName);

  if (fs.existsSync(newPath)) {
    // Target already exists — check sizes, keep larger
    const oldSize = fs.statSync(entry.path).size;
    const newSize = fs.statSync(newPath).size;
    if (oldSize > newSize) {
      fs.unlinkSync(newPath);
      fs.renameSync(entry.path, newPath);
      console.log(`OVERWRITE: ${entry.name} -> ${newName} (backslash version was larger)`);
    } else {
      fs.unlinkSync(entry.path);
      console.log(`DEL: ${entry.name} (clean version already exists and is larger)`);
    }
    fixed++;
  } else {
    fs.renameSync(entry.path, newPath);
    console.log(`RENAME: ${entry.name} -> ${newName}`);
    fixed++;
  }
}

// Fix directories
for (const entry of dirs) {
  const parent = path.dirname(entry.path);
  const newName = entry.name.replace(/\\/g, ' ').replace(/  +/g, ' ').trim();
  const newPath = path.join(parent, newName);

  if (fs.existsSync(newPath)) {
    console.log(`DIR EXISTS: ${newName} — merging`);
    // Move files from backslash dir to clean dir
    for (const f of fs.readdirSync(entry.path)) {
      const src = path.join(entry.path, f);
      const dst = path.join(newPath, f);
      if (!fs.existsSync(dst)) {
        fs.renameSync(src, dst);
      } else {
        fs.unlinkSync(src);
      }
    }
    fs.rmdirSync(entry.path);
    console.log(`RMDIR: ${entry.path}`);
  } else {
    fs.renameSync(entry.path, newPath);
    console.log(`RENAME DIR: ${entry.name} -> ${newName}`);
  }
  fixed++;
}

console.log(`\nFixed ${fixed} entries`);

// Verify none remain
const remaining = getAllEntries('content');
console.log(`Remaining backslash entries: ${remaining.length}`);

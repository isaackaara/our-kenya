// Apply redirects from a JSON file
const fs = require('fs');
const path = require('path');

const redirectFile = process.argv[2];
if (!redirectFile) {
  console.error('Usage: node apply-redirects-generic.cjs <redirects.json>');
  process.exit(1);
}

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

const redirects = require(path.resolve(redirectFile));
const files = getAllMd('content');

let totalFixed = 0;
let filesFixed = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  let fileFixed = 0;

  for (const [from, to] of Object.entries(redirects)) {
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

console.log(`Applied ${Object.keys(redirects).length} redirects: ${totalFixed} refs fixed in ${filesFixed} files`);

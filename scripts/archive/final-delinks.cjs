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
for (const f of files) existing.add(path.basename(f, '.md'));

// Redirect Indian Ocean -> The Indian Ocean World
const redirects = {
  'Indian Ocean': 'The Indian Ocean World',
};

let totalFixed = 0;
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  for (const [from, to] of Object.entries(redirects)) {
    if (!existing.has(to)) continue;
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\[\\[${escaped}((?:#[^\\]|]*)?(?:\\|[^\\]]+?)?)\\]\\]`, 'g');
    content = content.replace(re, (m, s) => { totalFixed++; return `[[${to}${s}]]`; });
  }

  if (content !== original) {
    fs.writeFileSync(f, content);
  }
}

console.log(`Fixed ${totalFixed} Indian Ocean refs`);

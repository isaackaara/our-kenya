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

const existing = new Set();
for (const f of getAllMd('content')) existing.add(path.basename(f, '.md'));

const wikiRe = /\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|[^\]]+?)?\]\]/g;
const dead = {};
for (const f of getAllMd('content')) {
  const c = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = wikiRe.exec(c)) !== null) {
    const t = m[1].trim();
    if (!existing.has(t)) {
      if (!dead[t]) dead[t] = 0;
      dead[t]++;
    }
  }
}

const sorted = Object.entries(dead).sort((a, b) => b[1] - a[1]);
const need = sorted.filter(([, c]) => c >= 5);
console.log('Targets with >=5 refs still needing notes: ' + need.length);
for (const [t, c] of need) console.log(c + '\t' + t);

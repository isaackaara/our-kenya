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

// Targets to delink (not worth creating notes for)
const delinks = [
  'Female Leadership Kenya',
  'Kalenjin Warrior Culture',
  'Giriama Resistance', // note exists but different casing?
  'Kalenjin people',
  'Seventh-day Adventist education in Kenya',
  'Language and Education Kenya',
  'Short Story Traditions Kenya',
  'Political Thought Kenya',
  'International Publishing Kenya',
  'Kalenjin Political Ascendancy',
  'Kalenjin Economy and Agriculture',
  'Religious Transformation',
  'Religion in Kenya',
];

const files = getAllMd('content');
let totalFixed = 0, filesFixed = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  for (const term of delinks) {
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

console.log(`Delinked ${totalFixed} refs across ${filesFixed} files`);

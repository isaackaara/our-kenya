// Final fixes for remaining dead targets
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

// Fix malformed links and delink remaining targets
const fixes = {
  // Delink generic/non-topic targets
  "African Kenyans": null, // delink
  "Kenya's": null, // delink (fragment)
  "Indian Ocean": null, // delink (too broad, not Kenya-specific enough for a note)
  "Maasai Mara Ecosystem": "The Maasai Mara Ecosystem", // redirect if exists
};

// Redirects for remaining targets
const redirects = {
  'Kalenjin and the Land': 'Rift Valley',
  'White Kenyans': 'white Kenyans',
  'Giriama Resistance': 'Giriama Resistance',
  'Energy Sector Kenya': 'Energy Access',
  "Kenya's Energy Sector Under Uhuru": 'Energy Access',
  'Telecommunications Kenya': 'Digital Economy Kenya',
  'Kenya Media Ownership': 'Social Media Kenya',
  'Kalenjin Political Ascendancy': 'Kalenjin Political Identity',
  'Kalenjin Warrior Culture': 'Kalenjin Political Identity',
  'Kalenjin people': 'Kalenjin Political Identity',
  'Kalenjin Economy and Agriculture': 'Kalenjin Political Identity',
  'Religion in Kenya': 'Churches Kenya',
  'Religious Transformation': 'Churches Kenya',
  'Media and Press Kenya': 'Social Media Kenya',
  'Nairobi Urban Refugees': 'Human Rights Refugee Camps',
  'Female Leadership Kenya': 'Women in Kenyan Politics',
  'Taita History': 'Mijikenda',
  'Internet Development Kenya': 'Digital Economy Kenya',
  'Maasai Mara Ecosystem': 'The Maasai Mara Ecosystem',
};

let totalFixed = 0, filesFixed = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Fix malformed double-bracket links like [[...among [[Mijikenda]]
  // These are broken wikilinks with [[ inside them
  content = content.replace(/\[\[([^\]]*?)\[\[([^\]]+?)\]\]/g, (match, before, inner) => {
    totalFixed++;
    return `${before}[[${inner}]]`;
  });

  // Apply redirects (only for targets that exist)
  for (const [from, to] of Object.entries(redirects)) {
    if (!existing.has(to)) continue;
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\[\\[${escaped}((?:#[^\\]|]*)?(?:\\|[^\\]]+?)?)\\]\\]`, 'g');
    content = content.replace(re, (m, s) => { totalFixed++; return `[[${to}${s}]]`; });
  }

  // Delink generic targets
  const delinks = ['African Kenyans', "Kenya's", 'Indian Ocean'];
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

console.log(`Final fixes: ${totalFixed} refs across ${filesFixed} files`);

// Remove ALL single-ref dead links except those that are clearly important Kenya topics
// A single-ref dead link means only one note links to this missing target
// It's almost always better to delink these than to create 2,316 notes

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

const wikiRe = /\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|[^\]]+?)?\]\]/g;
const dead = {};
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = wikiRe.exec(c)) !== null) {
    const t = m[1].trim();
    if (!existing.has(t)) { if (!dead[t]) dead[t] = 0; dead[t]++; }
  }
}

// Get single-ref targets
const singleRef = Object.entries(dead).filter(([, c]) => c === 1).map(([t]) => t);

// Also get 2-ref targets that are generic
const twoRef = Object.entries(dead).filter(([, c]) => c === 2).map(([t]) => t);

console.log('Single-ref targets:', singleRef.length);
console.log('Two-ref targets:', twoRef.length);

// Remove ALL single-ref dead links
const removals = new Set(singleRef);

// Also remove 2-ref targets that are generic (non-Kenya-specific)
const kenyaKeywords = /Kenya|Kenyan|Nairobi|Mombasa|Kisumu|Nakuru|Eldoret|Nyeri|Meru|Kikuyu|Luo|Kamba|Luhya|Maasai|Samburu|Turkana|Somali|Swahili|Kalenjin|Borana|Rendille|Pokot|Taita|Digo|Rabai|Mijikenda|Giriama|Embu|Nandi|Kipsigis|Tugen|Marakwet|Orma|Pokomo|Bajun|Mau Mau|Kenyatta|Moi|Kibaki|Ruto|Odinga|Uhuru|Raila|KANU|ODM|SGR|M-Pesa|Safaricom|Tsavo|Amboseli|Rift Valley|Lake Victoria|Lake Turkana|Mount Kenya|Indian Ocean|Lamu|Malindi|Fort Jesus|Tana River|Garissa|Wajir|Mandera|Marsabit|Isiolo|Baringo|Laikipia|Kakamega|Bungoma|Uasin Gishu|Kericho|Bomet|Narok|Kajiado|Siaya|Homa Bay|Migori|Kirinyaga|Murang|Kiambu|Thika|Machakos|Kitui|Makueni|Kwale|Kilifi|Kibera|Mathare|Eastleigh|Gikomba/i;

for (const target of twoRef) {
  if (!kenyaKeywords.test(target)) {
    // Check if it looks like a generic phrase
    const words = target.split(' ');
    if (words.length <= 3 || /^(The |A |An )/.test(target)) {
      removals.add(target);
    }
  }
}

console.log('Total removals:', removals.size);

// Apply removals
let totalFixed = 0, filesFixed = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  for (const term of removals) {
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

console.log(`Removed ${totalFixed} dead links across ${filesFixed} files`);

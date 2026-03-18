// Handle remaining 2-4 ref dead targets
// Strategy: create notes for important Kenya topics, delink the rest
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

const targets24 = Object.entries(dead).filter(([, c]) => c >= 2 && c <= 4);

// Categorize: important Kenya topics to KEEP vs generic to REMOVE
// A target is important if it contains Kenya-specific terms AND looks like a real topic
const kenyaPattern = /Kenya|Kenyan|Nairobi|Mombasa|Kisumu|Nakuru|Nyeri|Meru|Kikuyu|Luo|Kamba|Luhya|Maasai|Samburu|Turkana|Somali|Swahili|Kalenjin|Borana|Mijikenda|Giriama|Embu|Nandi|Kipsigis|Pokot|Taita|Digo|Rabai|Orma|Pokomo|Bajun|Mau Mau|Kenyatta|Moi|Kibaki|Ruto|Odinga|Uhuru|Raila|KANU|ODM|SGR|M-Pesa|Safaricom|Tsavo|Amboseli|Rift Valley|Lake Victoria|Lake Turkana|Mount Kenya|Indian Ocean|Lamu|Malindi|Fort Jesus|Tana River|Garissa|Wajir|Mandera|Marsabit|Isiolo|Baringo|Laikipia|Kakamega|Bungoma|Uasin Gishu|Kericho|Bomet|Narok|Kajiado|Siaya|Homa Bay|Migori|Kirinyaga|Murang|Kiambu|Thika|Machakos|Kitui|Kwale|Kilifi|Kibera|Mathare|Eastleigh|Gikomba/i;

const toRemove = [];
const toKeep = [];

for (const [target, count] of targets24) {
  // Remove non-Kenya-specific generic targets
  if (!kenyaPattern.test(target)) {
    toRemove.push(target);
  } else {
    toKeep.push([target, count]);
  }
}

console.log('2-4 ref targets to KEEP (Kenya-specific):', toKeep.length);
console.log('2-4 ref targets to REMOVE (generic):', toRemove.length);
console.log('\nTargets to keep:');
for (const [t, c] of toKeep.sort((a, b) => b[1] - a[1])) {
  console.log(`  ${c}\t${t}`);
}

// Apply removals
let totalFixed = 0, filesFixed = 0;
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  for (const term of toRemove) {
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

console.log(`\nRemoved ${totalFixed} generic dead links across ${filesFixed} files`);

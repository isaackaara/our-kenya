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
const existingLower = new Map();
for (const f of files) {
  const name = path.basename(f, '.md');
  existing.add(name);
  const lower = name.toLowerCase();
  if (!existingLower.has(lower)) existingLower.set(lower, name);
}

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

const sorted = Object.entries(dead).sort((a, b) => b[1] - a[1]);

// Categorize remaining targets (<=4 refs)
const lowRef = sorted.filter(([, c]) => c <= 4);

// Patterns for removal (not real Kenya topics)
function shouldRemove(target) {
  // Single lowercase words (generic)
  if (/^[a-z][a-z ]+$/.test(target) && target.split(' ').length <= 2 && target.length < 20) return true;
  // Years
  if (/^\d{4}$/.test(target)) return true;
  // Very generic patterns
  const generic = /^(The |A )?(Overview|Summary|Introduction|Background|Context|Conclusion|Discussion|Analysis|Notes?|References?|Bibliography|Appendix|Chapter|Section|Part|Table|Figure|Map|Photo|Image|Diagram|Chart|Graph|List|Index|Glossary|Timeline|Chronology|Further Reading|External Links|Categories?|Tags?|Related|Links|Navigation|Menu|Header|Footer|Sidebar|Content|Main|Body|Title|Sub-?title|Page|Template|Draft|Test|Sample|Example|Demo|Temp|Placeholder|TODO|FIXME|NOTE|WARNING|DEPRECATED|OBSOLETE|Legacy|Archive|Old|New|Updated|Revised|Modified|Version|Release|Build|Deploy|Config|Settings|Options|Parameters?|Variables?|Constants?|Types?|Classes?|Functions?|Methods?|Properties|Attributes?|Fields?|Columns?|Rows?|Records?|Items?|Elements?|Components?|Modules?|Packages?|Libraries?|Frameworks?|Tools?|Utils?|Helpers?|Services?|Providers?|Controllers?|Models?|Views?|Routes?|Handlers?|Middleware|Plugins?|Extensions?|Add-?ons?|Widgets?|Themes?|Styles?|Layouts?|Grids?|Containers?|Wrappers?|Sections?|Blocks?|Panels?|Cards?|Modals?|Dialogs?|Popups?|Tooltips?|Menus?|Navbars?|Footers?|Headers?|Banners?)$/i;
  if (generic.test(target)) return true;

  // Trade/maritime generic terms
  const tradeGeneric = /^(Copper Metal Trade|Gold Trade Corridors|Textile Trade Patterns|Merchant Vessel Armament|Piracy Trade Safety|Trade Route Safety|Coral Shell Trade|Ship Types Designs|Gemstone Trade|Luxury Trade Networks|Maritime Trade Networks|Incense Trade|Market Centers|Pearl Trade|Port Economics|Trade Seasons|Trade Commodities|Trade Networks|Goods Traded|Trade Items|Ship Construction|Sail Types|Monsoon Routes|Anchor Types|Crew Management|Port Facilities|Loading Methods|Ship Maintenance|Trade Agreements|Currency Exchange|Weight Measures|Trade Regulations|Maritime Law|Harbor Defense|Coastal Fortifications|Lighthouse Systems|Signal Systems|Chart Making|Route Planning|Weather Forecasting|Wave Patterns|Current Patterns|Tide Tables|Depth Measurement|Position Finding|Dead Reckoning|Latitude Determination|Longitude Problem|Cross-Staff|Astrolabe|Kamal|Compass Types|Magnetic Variation|Direction Finding)$/;
  if (tradeGeneric.test(target)) return true;

  return false;
}

function canRedirect(target) {
  // Case-insensitive match
  if (existingLower.has(target.toLowerCase()) && !existing.has(target)) {
    return existingLower.get(target.toLowerCase());
  }
  // Variations
  const variations = [
    target + ' Kenya', target.replace(/ Kenya$/, ''),
    'The ' + target, target.replace(/^The /, ''),
    target.replace(/-/g, ' '), target.replace(/ /g, '-'),
  ];
  for (const v of variations) {
    if (existing.has(v)) return v;
  }
  return null;
}

const toRemove = [];
const toRedirect = {};
const toCreate = [];

for (const [target, count] of lowRef) {
  const redirect = canRedirect(target);
  if (redirect) {
    toRedirect[target] = redirect;
  } else if (shouldRemove(target)) {
    toRemove.push(target);
  } else {
    toCreate.push([target, count]);
  }
}

console.log('=== Low-ref target categorization ===');
console.log(`Redirect: ${Object.keys(toRedirect).length} targets`);
console.log(`Remove: ${toRemove.length} targets`);
console.log(`Create: ${toCreate.length} targets`);
console.log(`Total refs in removals: ${toRemove.reduce((s, t) => s + (dead[t] || 0), 0)}`);
console.log(`Total refs in redirects: ${Object.keys(toRedirect).reduce((s, t) => s + (dead[t] || 0), 0)}`);
console.log(`Total refs in creates: ${toCreate.reduce((s, [, c]) => s + c, 0)}`);

console.log('\nRedirects:');
for (const [from, to] of Object.entries(toRedirect).slice(0, 20)) {
  console.log(`  ${dead[from]} refs: "${from}" -> "${to}"`);
}

console.log('\nTo create (top 30):');
for (const [t, c] of toCreate.slice(0, 30)) {
  console.log(`  ${c} refs: "${t}"`);
}

console.log('\nRemovals (sample 30):');
for (const t of toRemove.slice(0, 30)) {
  console.log(`  ${dead[t]} refs: "${t}"`);
}

fs.writeFileSync('scripts/low-ref-redirects.json', JSON.stringify(toRedirect, null, 2));
fs.writeFileSync('scripts/low-ref-removals.json', JSON.stringify(toRemove, null, 2));
fs.writeFileSync('scripts/low-ref-creates.json', JSON.stringify(toCreate, null, 2));

// Final cleanup: aggressively remove single-ref dead links that are:
// - Not clearly important Kenya history topics
// - Generic phrases, fragments, or non-specific terms
// Keep only targets that are clearly important Kenya-specific topics worthy of their own notes

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
  if (!existingLower.has(name.toLowerCase())) existingLower.set(name.toLowerCase(), name);
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

// Kenya-specific keywords that indicate a target IS worth keeping
const kenyaKeywords = /Kenya|Kenyan|Nairobi|Mombasa|Kisumu|Nakuru|Eldoret|Nyeri|Meru|Kikuyu|Luo|Kamba|Luhya|Maasai|Samburu|Turkana|Somali|Swahili|Kalenjin|Borana|Rendille|Pokot|Teso|Taita|Digo|Rabai|Duruma|Mijikenda|Giriama|Embu|Tharaka|Mbeere|Nandi|Kipsigis|Tugen|Marakwet|Keiyo|Sabaot|Ogiek|Sengwer|Endorois|Ilchamus|Njemps|Orma|Pokomo|Bajun|Boni|Dahalo|Cushitic|Nilotic|Bantu|Mau Mau|Kenyatta|Moi|Kibaki|Ruto|Odinga|Uhuru|Raila|KANU|ODM|Jubilee|NARC|PNU|Azimio|ICC|TJRC|KDF|KWS|NEMA|NTSA|EACC|IEBC|SGR|LAPSSET|M-Pesa|Mpesa|Safaricom|KCB|Equity|Tsavo|Amboseli|Aberdare|Rift Valley|Lake Victoria|Lake Turkana|Mount Kenya|Kilimanjaro|Indian Ocean|Lamu|Malindi|Watamu|Diani|Nyali|Fort Jesus|Gede|Takwa|Shanga|Siyu|Pate|Witu|Tana River|Ewaso|Galana|Athi|Sabaki|Nzoia|Yala|Sondu|Mara River|Lake Nakuru|Lake Naivasha|Lake Baringo|Lake Bogoria|Cherangani|Elgon|Suswa|Longonot|Menengai|Hells Gate|Ol Pejeta|Lewa|Laikipia|Samburu|Marsabit|Isiolo|Garissa|Wajir|Mandera|Moyale|Turkwell|Kerio|Kapenguria|Nanyuki|Nyahururu|Karatina|Muranga|Kiambu|Thika|Ruiru|Limuru|Kikuyu Town|Machakos|Kitui|Makueni|Voi|Taveta|Kwale|Kilifi|Tana|Lamu|Busia|Kakamega|Bungoma|Trans Nzoia|Uasin Gishu|Kericho|Bomet|Narok|Kajiado|West Pokot|Baringo|Elgeyo|Nyandarua|Laikipia|Migori|Homa Bay|Siaya|Kisii|Nyamira|Tharaka Nithi|Kirinyaga|Nyandarua|Kwale|Mathare|Kibera|Eastleigh|Gikomba|Dandora|Westlands|Karen|Langata|Muthaiga|Lavington|Kilimani|Hurlingham|Parklands|Ngara|Pangani|Pumwani|Embakasi|Umoja|Buruburu|South B|South C|Kasarani|Roysambu|Ruaraka|Dagoretti|Githurai/i;

function shouldKeep(target, count) {
  // Always keep targets with 3+ refs
  if (count >= 3) return true;

  // Keep Kenya-specific targets
  if (kenyaKeywords.test(target)) return true;

  // Keep targets that look like proper nouns (person names, place names, events)
  // Must be at least 2 words, each capitalized
  const words = target.split(' ');
  if (words.length >= 2 && words.length <= 6) {
    const allCapped = words.every(w => /^[A-Z]/.test(w) || /^(of|the|and|in|for|on|at|to|by|with|from|a|an|de|van|von|el|al|bin|ibn)$/.test(w));
    if (allCapped && !isGenericPhrase(target)) return true;
  }

  return false;
}

function isGenericPhrase(target) {
  const generic = /^(National|International|Regional|Local|Central|Eastern|Western|Northern|Southern|Upper|Lower|Inner|Outer|Greater|Modern|Contemporary|Traditional|Historical|Colonial|Post-Colonial|Pre-Colonial|Early|Late|Middle|Ancient|Medieval|Current|Future|Proposed|Planned|Ongoing|Emerging|Declining|Growing|Changing|Shifting|Rising|Falling)?\s*(Development|Reform|Policy|Systems?|Services?|Management|Protection|Infrastructure|Sector|Markets?|Institutions?|Organizations?|Framework|Strategy|Planning|Assessment|Response|Recovery|Resilience|Impact|Outcomes?|Approaches?|Methods?|Techniques?|Practices?|Activities?|Operations?|Programs?|Projects?|Initiatives?|Efforts?|Campaigns?|Movements?|Processes?|Procedures?|Mechanisms?|Structures?|Patterns?|Trends?|Changes?|Shifts?|Transitions?|Transformations?|Adaptations?|Innovations?|Solutions?|Challenges?|Opportunities?|Constraints?|Barriers?|Factors?|Conditions?|Circumstances?|Contexts?|Settings?|Environments?|Landscapes?|Dynamics?|Relations?|Connections?|Links?|Ties?|Bonds?|Networks?|Communities?|Populations?|Groups?|Peoples?|Societies?|Cultures?|Traditions?|Customs?|Practices?|Rituals?|Ceremonies?|Events?|Occasions?|Gatherings?|Meetings?|Conferences?|Forums?|Workshops?|Seminars?|Lectures?|Presentations?|Exhibitions?|Displays?|Shows?|Performances?|Productions?|Festivals?|Celebrations?|Commemorations?|Observances?)$/i;
  return generic.test(target);
}

// Process
const removals = new Set();
const redirects = {};

for (const [target, count] of Object.entries(dead)) {
  // Try redirect first
  if (existingLower.has(target.toLowerCase()) && !existing.has(target)) {
    redirects[target] = existingLower.get(target.toLowerCase());
    continue;
  }
  const variations = [
    target + ' Kenya', target.replace(/ Kenya$/, ''),
    'The ' + target, target.replace(/^The /, ''),
    target.replace(/-/g, ' '), target.replace(/ /g, '-'),
  ];
  let found = false;
  for (const v of variations) {
    if (existing.has(v)) { redirects[target] = v; found = true; break; }
  }
  if (found) continue;

  // Remove if not worth keeping
  if (!shouldKeep(target, count)) {
    removals.add(target);
  }
}

console.log(`Redirects: ${Object.keys(redirects).length}`);
console.log(`Removals: ${removals.size}`);
console.log(`Remaining: ${Object.keys(dead).length - Object.keys(redirects).length - removals.size}`);

// Apply
let totalFixed = 0, filesFixed = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  for (const [from, to] of Object.entries(redirects)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\[\\[${escaped}((?:#[^\\]|]*)?(?:\\|[^\\]]+?)?)\\]\\]`, 'g');
    content = content.replace(re, (m, s) => { totalFixed++; return `[[${to}${s}]]`; });
  }

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

console.log(`Applied: ${totalFixed} refs across ${filesFixed} files`);

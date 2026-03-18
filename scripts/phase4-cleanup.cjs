const fs = require('fs');
const path = require('path');

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

const files = getAllMd('content');
const existingNotes = new Set();
const existingLower = new Map();
for (const f of files) {
  const name = path.basename(f, '.md');
  existingNotes.add(name);
  existingLower.set(name.toLowerCase(), name);
}

// Scan for all dead targets
const wikiRe = /\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|[^\]]+?)?\]\]/g;
const deadTargets = {};
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = wikiRe.exec(content)) !== null) {
    let target = match[1].trim();
    if (!existingNotes.has(target)) {
      if (!deadTargets[target]) deadTargets[target] = 0;
      deadTargets[target]++;
    }
  }
}

// Generic/vague terms that should have links REMOVED (not notes created)
const genericTerms = new Set([
  'Society', 'economy', 'Europeans', 'colonial', 'agriculture', 'colonialism',
  'Britain', 'British', 'English', 'identity', 'medicine', 'politics', 'Policy',
  'Research', 'Historians', 'settler', 'Middle East', 'China', 'UK', 'NATO',
  'elders', 'sacred', 'sub-groups', 'African', 'violence', 'real estate',
  'commerce', 'South Asia', 'intermarriage', 'accounting', 'Gujarati', 'government',
  'duka', 'Punjab', 'Sikhs', 'post-independence', 'Africa', 'Kericho', '2008',
  '2010', 'Ismaili', 'Maize', 'Turkana', 'Currency', 'social media',
  'Pastoralism', 'Climate Change', 'Habitat Fragmentation', 'Rainfall Patterns',
  'Vulnerable Populations', 'Data Analysis', 'Cybersecurity', 'Innovation Policy',
  'Logistics Innovation', 'Electoral Systems', 'Economic Resilience', 'Informal Lending',
  'Security Sector', 'Habitat fragmentation', 'Habitat Suitability', 'Predator-Prey Dynamics',
  'Wildlife Populations', 'Climate Change Impacts', 'Northern Kenya', 'Wildlife Kenya',
  'wildlife protection', 'Ecosystem Services Valuation', 'Drought Management',
  'Colonial Ideology', 'Missionisation and Colonialism', 'Missionisation',
  'Occupational Segregation', 'Colonial Surveillance', 'Colonial Commerce Control',
  'Colonial Environmental Policy', 'African Healers Traditional', 'bandwidth Kenya',
  'competition Kenya', 'systematic looting', 'Livelihood Diversification',
  'Formal Sector Employment', 'Income Generation', 'Early Independence',
  'political', 'National Parks', 'Energy Infrastructure', 'Government Land',
  'Sanitation Infrastructure', 'traditional banking', 'cross-ethnic cooperation',
  'devolved governance', 'Memorandum of Understanding', 'Memorandum of Understanding (MOU)',
  'endangered species', 'Endangered Species', 'currency Kenya',
  // Malformed wikilinks (start with [[)
]);

// Manual redirects for near-duplicates
const manualRedirects = {
  'Kenya Defence Forces': 'Kenya Defence Forces',  // already exists
  'Kenya Land Reform': 'Kenya Land Reform',
  'Turkana': 'Turkana',
  'Maize': 'Maize Production',
  'Climate Change Kenya': 'Climate Change Response',
  'International Monetary Fund Kenya': 'International Monetary Fund',
  'Water Resources Kenya': 'Water Resources Management',
  'Coffee Production Kenya': 'Coffee Industry Kenya',
  'KANU party history': 'KANU',
  'Kibaki Presidency': 'Mwai Kibaki',
  'Kenya Corruption': 'Corruption',
  "Kenyatta's presidency": 'Kenyatta Presidency',
  'Mau Mau Revolt': 'Mau Mau Uprising',
  'Anglo Leasing': 'Anglo-Leasing Scandal',
  'Ethnic violence Kenya': 'Post-Election Violence',
  'Ethnic Violence Kenya': 'Post-Election Violence',
  'Kenya 2007 Election Violence': '2007-2008 Post Election Violence',
  'Kenya 2007 Election': '2007-2008 Post Election Violence',
  '2013 Kenyan Election': '2013 Presidential Election',
  '2017 Kenyan Election': '2017 Presidential Election',
  'Kenya Constitutional Reform': 'Kenya Constitution 2010',
  'Constitutional Reform Kenya': 'Kenya Constitution 2010',
  'Political Parties Kenya': 'Elections',
  'Elections in Kenya': 'Elections',
  'Land Reform': 'Kenya Land Reform',
  'British colonial rule in Kenya': 'Colonial Administration',
  'Kenya Education System': 'Education',
  'Education Policy Kenya': 'Education',
  'Kenya Human Rights': 'Kenya Human Rights Commission',
  'International Criminal Court Kenya': 'ICC Cases Kenya',
  'Saba Saba Riots': 'Saba Saba 1990',
  'Kenya Opposition Politics': 'Multiparty Politics',
  'Political History': 'Kenya Political Economy',
  'Kenya Authoritarianism': 'Daniel arap Moi Era',
  'Kikuyu Opposition to Moi': 'Multiparty Politics',
  'Environmentalism': 'Wangari Maathai',
  'Music in Kenya': 'Kenyan Benga Music',
  'Kenya Press Freedom': 'State Censorship and Literature',
  'Indian Ocean Trade': 'Merchant Networks',
  'Black rhinoceros': 'black rhinoceros',
  'National Parks Kenya': 'Protected Areas Kenya',
  'Luo Culture and Identity': 'Luo People and Culture',
  'Samburu People': 'Samburu',
  'County Government Kenya': 'Devolution Kenya',
  'Regional Politics Kenya': 'Politics',
  'Democracy Kenya': 'Multiparty Politics',
  'Arab Trade': 'Merchant Networks',
  'Bantu languages': 'Gikuyu Language',
  'Cooperative Movement Kenya': 'Agricultural Marketing Systems',
  'Member-Based Organisations Kenya': 'Agricultural Marketing Systems',
  'Financial Systems Kenya': 'Financial Regulation Kenya',
  'Transport Infrastructure Kenya': 'Transportation',
  'Financial Services Kenya': 'Financial Inclusion Kenya',
  'Telecommunications Kenya': 'Digital Economy Kenya',
  'Sugar Industry Kenya': 'Agriculture',
  'Agricultural Production Kenya': 'Agriculture',
  'Land and Politics Kenya': 'Kenya Land Reform',
  'Land Rights and Tenure': 'Land Tenure Post Independence',
  'Land Tenure and Ownership': 'Land Tenure Post Independence',
  'Kwale Water': "Murang'a Water Resources",
  'Secondary Education Kenya': 'Education',
  'Single-Party State Kenya': 'KANU',
  'Rift Valley Politics': 'Kalenjin Political Identity',
  'Kenya National Identity': 'Indigenous Cultures',
  'Housing Kenya': 'Infrastructure',
  'Kibaki Cabinet and Government': 'Mwai Kibaki',
  'Kenya Cabinet System': 'Government',
  'Moi First Cabinet as President': 'Daniel arap Moi Era',
  'Kenya Vice Presidency': 'Government',
  'Moi and International Donors': 'Structural Adjustment Kenya',
  'Ruto Hustler Narrative': 'Ruto Economic Blueprint - Bottom-Up Economics',
  'Ruto and Raila Reconciliation': 'Handshake Politics Kenya',
  "Kenya's Energy Sector Under Uhuru": 'Energy Access',
  'Justice and Legal Reform Kenya': 'Kenya Constitution 2010',
  'Retail Revolution Kenya': 'Nairobi CBD Economy',
  'Trade Facilitation Kenya': 'Economy',
  'Trade Liberalisation Kenya': 'Economy',
  'Trade Policy Kenya': 'Economy',
  'Monetary Policy Kenya': 'Financial Regulation Kenya',
  'Import Substitution Kenya': 'Economy',
  'Parastatal Reform Kenya': 'Structural Adjustment Kenya',
  'Chinese Investment Kenya': 'Kenya Railways',
};

// Apply redirects
let redirectFixed = 0;
let redirectFiles = 0;
const appliedRedirects = {};

for (const [from, to] of Object.entries(manualRedirects)) {
  if (from === to && existingNotes.has(to)) continue; // already exists, skip
  if (existingNotes.has(to) || to === from) {
    appliedRedirects[from] = to;
  }
}

// Also remove generic term links
let genericRemoved = 0;
let genericFiles = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  let fixed = 0;

  // Apply redirects
  for (const [from, to] of Object.entries(appliedRedirects)) {
    if (from === to) continue;
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\[\\[${escaped}((?:#[^\\]|]*)?(?:\\|[^\\]]+?)?)\\]\\]`, 'g');
    content = content.replace(re, (match, suffix) => {
      fixed++;
      return `[[${to}${suffix}]]`;
    });
  }

  // Remove generic term links
  for (const term of genericTerms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // With alias
    const reAlias = new RegExp(`\\[\\[${escaped}\\|([^\\]]+?)\\]\\]`, 'g');
    content = content.replace(reAlias, (match, alias) => {
      fixed++;
      return alias;
    });
    // Without alias
    const reNoAlias = new RegExp(`\\[\\[${escaped}\\]\\]`, 'g');
    content = content.replace(reNoAlias, (match) => {
      fixed++;
      return term;
    });
  }

  // Fix malformed wikilinks that start with [[ inside another [[
  // e.g., [[[[Benga Music Origins]] -> [[Benga Music Origins]]
  content = content.replace(/\[\[\[\[/g, '[[');

  if (content !== original) {
    fs.writeFileSync(f, content);
    redirectFiles++;
    redirectFixed += fixed;
  }
}

console.log(`Phase 4 cleanup: ${redirectFixed} refs fixed/removed across ${redirectFiles} files`);

// Rescan
const files2 = getAllMd('content');
const existing2 = new Set();
for (const f2 of files2) existing2.add(path.basename(f2, '.md'));

const wikiRe2 = /\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|[^\]]+?)?\]\]/g;
let totalLinks = 0, deadLinks = 0;
const deadTargets2 = {};
for (const f2 of files2) {
  const content = fs.readFileSync(f2, 'utf8');
  let match;
  while ((match = wikiRe2.exec(content)) !== null) {
    totalLinks++;
    let target = match[1].trim();
    if (!existing2.has(target)) {
      deadLinks++;
      if (!deadTargets2[target]) deadTargets2[target] = 0;
      deadTargets2[target]++;
    }
  }
}

const sorted = Object.entries(deadTargets2).sort((a, b) => b[1] - a[1]);
console.log(`\nPost-cleanup: ${deadLinks} dead refs, ${sorted.length} unique targets`);

const refs10plus = sorted.filter(([, c]) => c >= 10);
const refs5to9 = sorted.filter(([, c]) => c >= 5 && c <= 9);
const refs2to4 = sorted.filter(([, c]) => c >= 2 && c <= 4);
const refs1 = sorted.filter(([, c]) => c === 1);
console.log(`>=10: ${refs10plus.length} targets, ${refs10plus.reduce((s, [, c]) => s + c, 0)} refs`);
console.log(`5-9: ${refs5to9.length} targets, ${refs5to9.reduce((s, [, c]) => s + c, 0)} refs`);
console.log(`2-4: ${refs2to4.length} targets, ${refs2to4.reduce((s, [, c]) => s + c, 0)} refs`);
console.log(`1: ${refs1.length} targets`);

// Save
const out = {};
for (const [t, c] of sorted) out[t] = c;
fs.writeFileSync('scripts/dead-targets-post-phase4.json', JSON.stringify(out, null, 2));

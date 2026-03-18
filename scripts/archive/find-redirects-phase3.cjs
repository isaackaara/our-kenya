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

// Phase 3 targets (5-9 refs) that might have near-matches
const phase3Targets = [
  'International Monetary Fund', 'Directorate of Criminal Investigations', 'Monsoon Winds',
  'Ivory Trade Networks', 'Defence Committee of Parliament', '2017 Presidential Election',
  'Cultural Heritage', 'Policy', 'Colonial Knowledge Production', 'Financial Inclusion Kenya',
  'Kilifi Creek', "Murang'a Water Resources", 'Maasai People and Culture',
  'Seasonal Trading Patterns', 'Digo', 'Rabai', 'Nyanza Province',
  'Voice of Kenya and Music Policy', 'Finance Bill 2023 Kenya', 'Climate Change Response',
  'Constitutional Rights Kenya', 'Regional Integration', 'Financial Regulation Kenya',
  'Nutritional Status Kenya', 'Language Preservation', 'Pastoral Societies Kenya',
  'Trading Colonies', 'GEMA', 'Kenya 2022 Election', 'Kenya Anti-Corruption Commission',
  'Foreign Policy', 'Impunity in Kenya', 'Jubilee Party', 'Darod clan family',
  'Traffic Management', 'Aga Khan', 'Research', 'Transportation', 'Wildlife Protection',
  'black rhinoceros', 'Political Patronage Networks', 'Swahili People', 'Ethiopia Kenya',
  'EAC Expansion', 'Parliament of Kenya', 'Tourism', 'Agricultural Marketing Systems',
  'Gusii', 'Non-Communicable Diseases', 'Compass Use', 'Star Navigation',
  'Indian Merchants Networks', 'Daughter of Mumbi', 'University of Nairobi Literary Culture',
  'A Grain of Wheat', 'Grace Ogot', 'Tigania', 'South Sudan', 'Nairobi Army Hospital',
  'Infrastructure Access', 'Truth and Reconciliation', 'Multiparty Transition',
  'Kikuyu-Kalenjin Alliance', 'Asians', 'Land Tenure', 'retail',
  'Ismaili Muslims', 'Anti-Colonial Resistance', 'Colonial Economic Integration',
  'Black Rhinoceros Kenya', 'Inflation Kenya', 'Digital Economy Kenya', 'white Kenyans',
  'Party of National Unity (PNU)', 'Orange Democratic Movement (ODM)',
  'Marketing Communications', 'Naval Defense', 'Warehouse Storage',
  'Seventh-day Adventist Church', 'Catholic Church', 'The Trial of Dedan Kimathi',
  'Mau Mau Emergency Narratives', 'Literary Culture Kenya', 'Food Security Kenya',
  'State Censorship and Literature', 'Social Media Kenya', 'Meru Economic Development',
  'Burundi', 'Moi Presidency', 'Moi and Human Rights', 'Kenya Elections',
  'Kenyatta and Kikuyu Society', 'Human Rights Refugee Camps', 'Energy Access', 'Health Systems'
];

const redirects = {};
const toGenerate = [];

for (const target of phase3Targets) {
  // Case-insensitive match
  const lower = target.toLowerCase();
  if (existingNotes.has(target)) {
    continue; // already exists
  }
  if (existingLower.has(lower) && !existingNotes.has(target)) {
    redirects[target] = existingLower.get(lower);
    continue;
  }

  // Common variations
  const variations = [
    target.replace(/ and /g, ' & '),
    target.replace(/ & /g, ' and '),
    target.replace(/-/g, ' '),
    target.replace(/ /g, '-'),
    target + ' Kenya',
    target.replace(/ Kenya$/, ''),
    target.replace(/^The /, ''),
    'The ' + target,
  ];

  let found = false;
  for (const v of variations) {
    if (existingNotes.has(v) && v !== target) {
      redirects[target] = v;
      found = true;
      break;
    }
  }
  if (!found) {
    toGenerate.push(target);
  }
}

// Manual known redirects
const manualRedirects = {
  'black rhinoceros': 'Black Rhinoceros',
  'Moi Presidency': 'Daniel arap Moi Era',
  'Kenya Elections': 'Elections',
  'Jubilee Party': 'Jubilee Party',
  'Orange Democratic Movement (ODM)': 'ODM',
  'Asians': 'Indian Communities Kenya',
  'Land Tenure': 'Land Tenure Post Independence',
  'retail': 'Nairobi CBD Economy',
  'Gusii': 'Kisii People',
};

for (const [from, to] of Object.entries(manualRedirects)) {
  if (existingNotes.has(to) && !existingNotes.has(from)) {
    redirects[from] = to;
    // Remove from toGenerate
    const idx = toGenerate.indexOf(from);
    if (idx >= 0) toGenerate.splice(idx, 1);
  }
}

console.log('Phase 3 redirects found:', Object.keys(redirects).length);
for (const [from, to] of Object.entries(redirects)) {
  console.log('  ' + JSON.stringify(from) + ' -> ' + JSON.stringify(to));
}

console.log('\nPhase 3 notes to generate:', toGenerate.length);
for (const t of toGenerate) {
  console.log('  ' + t);
}

fs.writeFileSync('scripts/phase3-redirects.json', JSON.stringify(redirects, null, 2));
fs.writeFileSync('scripts/phase3-to-generate.json', JSON.stringify(toGenerate, null, 2));

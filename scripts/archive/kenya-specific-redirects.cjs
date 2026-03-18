// Redirect Kenya-specific dead targets to existing or newly-created notes
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

// Manual redirects for Kenya-specific dead targets
const manualRedirects = {
  // Near-duplicates
  'Sisal Industry Kenya': 'Sisal Industry Kenya',
  'Single-Party State Kenya': 'KANU',
  'Rift Valley Politics': 'Politics',
  'KANU party history': 'KANU',
  'Constitutional Reform Kenya': 'Constitutional Reform 2010',
  'Kenya Constitutional Reform': 'Constitutional Reform 2010',
  'Kenya Post-Colonial Politics': 'Politics',
  'Kenya Human Rights': 'Kenya Human Rights Commission',
  'Kenya Press Freedom': 'State Censorship and Literature',
  'Kenya-China Relations': 'Kenya Railways', // SGR context
  "Kenya's Energy Sector Under Uhuru": 'Energy Access',
  'Ruto and Raila Reconciliation': 'The Handshake 2018',
  'Horticultural Exports Kenya': 'Horticultural Export Growth',
  'Land and Politics Kenya': 'Kenya Land Reform',
  'Chinese Investment Kenya': 'Kenya Railways',
  'Transport Infrastructure Kenya': 'Transportation',
  'Telecommunications Kenya': 'Digital Economy Kenya',
  'Financial Services Kenya': 'Financial Inclusion Kenya',
  'Cooperative Movement Kenya': 'Agricultural Marketing Systems',
  'Member-Based Organisations Kenya': 'Agricultural Marketing Systems',
  'Electoral Violence Kenya': 'Post-Election Violence',
  'Electoral Violence in Kenya': 'Post-Election Violence',
  'Coalition Formation Kenya': 'Politics',
  'Kikuyu Economic Dominance': 'Kikuyu Business Elite',
  'Democratic Transition Kenya': 'Multiparty Politics',
  'Kenya Democratic Transition': 'Multiparty Politics',
  'Pastoralist Communities Kenya': 'Pastoral Societies Kenya',
  'Press Freedom Kenya History': 'State Censorship and Literature',
  'Youth Activism Kenya': 'Gen Z Protests 2024',
  'IMF and Kenya': 'International Monetary Fund',
  'Ethnic voting in Kenya': 'Elections',
  'Ethnic Voting Kenya': 'Elections',
  'Constitutional reform Kenya': 'Constitutional Reform 2010',
  'Kenyan Constitution (2010)': 'Kenya Constitution 2010',
  'Kenya Constitution (2010)': 'Kenya Constitution 2010',
  'Kenya Devolution': 'Devolution Kenya',
  'Devolved government in Kenya': 'Devolution Kenya',
  'Kenya Tea Development Agency': 'Tea Industry Kenya',
  'Tea farming in Kenya': 'Tea Industry Kenya',
  'Kalenjin people': 'Kalenjin Political Identity',
  'Moi Era': 'Daniel arap Moi Era',
  'Giriama Resistance': 'Giriama Resistance',
  'White Kenyans': 'white Kenyans',
  'Tsavo': 'Tsavo Ecosystem',
  'Meru society': 'Meru People',
  'Meru History': 'Meru People',
  'Meru territory': 'Meru People',
  'Meru Social Organization': 'Meru People',
  'Meru Njuri Ncheke Council': 'Meru Njuri Ncheke',
  'Kikuyu Culture and Identity': 'Kikuyu People and Culture',
  'Kikuyu History Social Structure': 'Kikuyu People and Culture',
  'Kikuyu and the Land': 'Kikuyu Origins',
  'Kikuyu Land Grievances': 'Land Alienation',
  'Kikuyu Displacement in Rift Valley': '2007-2008 Post Election Violence',
  'Kikuyu-Kalenjin Relations': 'Kikuyu-Kalenjin Alliance',
  'Kikuyu Elite Under Moi': 'Kikuyu Political Elite',
  'Kiambu Elite': 'Kikuyu Political Elite',
  'Kenya Independence 1963': 'Kenya Independence',
  'Kenya 2013 Election': '2013 Presidential Election',
  'Kenya 2002 Election': '2002 Presidential Election',
  'Kenya Economic Growth': 'Economy',
  'Kenya Foreign Relations': 'Foreign Policy',
  'Kenya United States Relations': 'Foreign Policy',
  'Kenya Agricultural Policy': 'Agriculture',
  'Smallholder Farming Kenya': 'Smallholder Agriculture',
  'Kenya Transitional Justice': 'Truth and Reconciliation',
  'Opposition Politics in Kenya': 'Multiparty Politics',
  'Moi and Robert Ouko': 'Daniel arap Moi Era',
  'Kenya Rule of Law': 'Kenya Constitution 2010',
  'Kenya Education History': 'Education',
  'Somalia Kenya Border Dispute': 'North Eastern Province',
  'Kenya Somalia Border': 'North Eastern Province',
  'Kenya Nation-Building': 'Kenya History',
  'Kenya Electoral Politics': 'Elections',
  'Kenya Political Coalitions': 'Politics',
  'Supreme Court of Kenya': 'Kenya Constitution 2010',
  'Kalenjin Economy and Agriculture': 'Kalenjin Political Identity',
  'Ruto and the Kalenjin Community': 'William Ruto Presidency',
  'Kenya 2023 Protests': 'Gen Z Protests 2024',
  'Kenya Kwanza Coalition': 'William Ruto Presidency',
  'Kenya Post-2022 Politics': 'William Ruto Presidency',
  'Kenya Political Realignment': 'Politics',
  'Ruto and Media': 'William Ruto Presidency',
  'Samburu History': 'Samburu',
  'Somali Diaspora Global': 'Diaspora Communities',
  'Taita History': 'Taita Culture',
  'Safaricom History': 'M-Pesa',
  'Safaricom and Kenya Telecommunications': 'M-Pesa',
  'Turkana Culture': 'Turkana',
  'Religion in Kenya': 'Churches Kenya',
  'Media and Press Kenya': 'Social Media Kenya',
  'Regional Inequality Kenya': 'Devolution Kenya',
  'Kalenjin Dominance in Security Forces': 'Kenya Defence Forces',
  'Kalenjin Political Ascendancy': 'Kalenjin Political Identity',
  'Kalenjin Warrior Culture': 'Kalenjin Political Identity',
  'HIV AIDS in Kenya': 'AIDS Epidemic Kenya',
  'AIDS in Luo Community': 'AIDS Epidemic Kenya',
  'AIDS Awareness Kenya': 'AIDS Epidemic Kenya',
  'Kenya Justice and Accountability': 'Impunity in Kenya',
  'Northern Kenya Development': 'North Eastern Province',
  'Luhya Political Leadership': 'Luhya Cultural Identity',
  'Luhya languages': 'Luhya Cultural Identity',
  'Urban Planning Kenya': 'Nairobi History',
  'Nairobi Urban Refugees': 'Human Rights Refugee Camps',
  'Swahili Language and Identity': 'Swahili Culture',
  'Women in Kenyan Politics': 'Female Leadership Kenya',
  'Meru Marriage and Gender': 'Meru People',
  'Meru Education and Schools': 'Education',
  'National Identity Kenya': 'Indigenous Cultures',
  'Organized Crime Kenya': 'Kenya Police History',
  'Violent Crime Kenya': 'Kenya Police History',
  'Diaspora Engagement Policy Kenya': 'Diaspora Communities',
  'Cinema of Kenya': 'Literary Culture Kenya',
  'Democratic Party (Kenya)': 'Multiparty Politics',
  'Ngai and Mount Kenya': 'Ngai',
  'Rift Valley region': 'Rift Valley',
  'Laikipia': 'Laikipia County',
  'Energy Sector Kenya': 'Energy Access',
  'Insurance Industry Kenya': 'Economy',
  'Water Kenya': 'Water Resources Management',
  'Semi-Arid Lands Kenya': 'North Eastern Province',
  'Indigenous Minorities Kenya': 'Indigenous Cultures',
  'Swahili Development': 'Swahili Culture',
  'Kenya Cultural Heritage': 'Cultural Heritage',
  'Kenya Penal Code': 'Government',
  'Kamba and the Land': 'Kamba Culture and Identity',
  'Kamba Environment': 'Kamba Culture and Identity',
  'Kwale Water': "Murang'a Water Resources",
  'Public Health Kenya': 'Health Services',
  'Kikuyu Independent Schools Association': 'Kikuyu People and Culture',
  'Kenya Media Ownership': 'Social Media Kenya',
  'Kenya Ordnance Factory': 'Kenya Defence Forces',
  'Kenya Police Forensic Services Bureau': 'Kenya Police History',
  'KEMRI Kenya': 'Disease Surveillance Kenya',
  'Vector-Borne Diseases Kenya': 'Disease Surveillance Kenya',
  'Cosmopolitan Kenyans': 'Nairobi Urban Identity',
  'American Influence Kenya': 'Foreign Policy',
  'Electoral Mathematics Kenya': 'Elections',
  'Religious Transformation': 'Churches Kenya',
  'Livelihood Diversification in Samburu': 'Samburu County Agriculture',
  'Youth Development in Samburu': 'Samburu County Education',
  'Professional Networks Kenya': 'Entrepreneurship Kenya',
  'Wajir Commerce': 'North Eastern Province',
  'Consumer Goods Kenya': 'Economy',
  'Manufacturing Sector Kenya': 'Economy',
  'Internet Development Kenya': 'Digital Economy Kenya',
  'Painting Traditions Kenya': 'Cultural Heritage',
  'Weaving Traditions Kenya': 'Cultural Heritage',
  'Sculpture Practice Kenya': 'Cultural Heritage',
  'Colonial Education Kenya': 'Colonial Administration',
  'Cultural Exchange in Colonial Kenya': 'Colonial Administration',
  'Comcraft Group Kenya': 'Indian Communities Kenya',
  'Conservation Effectiveness Kenya': 'Conservation',
  'Northern Kenya Poaching Crisis': 'Wildlife Protection',
  'Taita Culture': 'Mijikenda',
  'Family-Owned Conglomerates Kenya': 'Kikuyu Business Elite',
  'Female Leadership Kenya': 'Women in Kenyan Politics',
  'Tsavo River': 'Tsavo Ecosystem',
  'Kenya 2022 Election': '2022 Presidential Election',
};

// Filter to only apply redirects where target exists
const validRedirects = {};
for (const [from, to] of Object.entries(manualRedirects)) {
  if (from === to) continue; // skip self-references
  if (existing.has(to)) {
    validRedirects[from] = to;
  }
}

console.log('Valid redirects:', Object.keys(validRedirects).length);

// Apply
let totalFixed = 0, filesFixed = 0;
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  for (const [from, to] of Object.entries(validRedirects)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\[\\[${escaped}((?:#[^\\]|]*)?(?:\\|[^\\]]+?)?)\\]\\]`, 'g');
    content = content.replace(re, (m, s) => { totalFixed++; return `[[${to}${s}]]`; });
  }

  if (content !== original) {
    fs.writeFileSync(f, content);
    filesFixed++;
  }
}

console.log(`Applied ${totalFixed} redirects across ${filesFixed} files`);

// Show which redirects failed (target doesn't exist)
const failed = Object.entries(manualRedirects).filter(([from, to]) => from !== to && !existing.has(to));
if (failed.length > 0) {
  console.log('\nFailed redirects (target missing):');
  for (const [from, to] of failed) {
    console.log(`  "${from}" -> "${to}"`);
  }
}

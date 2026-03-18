const fs = require('fs');

const replacements = {
  'Asians/Tsavo Man-Eaters': 'Counties/Taita-Taveta/Tsavo Man-Eaters',
  'Conservation/Samburu National Reserve': 'Samburu/Samburu National Reserve',
  'Conservation/The Great Migration': 'Counties/Narok/The Great Migration',
  'Counties/Homa Bay/Homa Bay County': 'Luo/Homa Bay County',
  'Counties/Laikipia/Lewa Wildlife Conservancy': 'Conservation/Lewa Wildlife Conservancy',
  'Counties/Laikipia/Ol Pejeta Conservancy': 'Conservation/Ol Pejeta Conservancy',
  'Counties/Meru/Meru National Park': 'Conservation/Meru National Park',
  "Counties/Murang'a/Murang'a County": "Kikuyu/Murang'a County",
  "Counties/Nakuru/Hell's Gate National Park": "Conservation/Hell's Gate National Park",
  'Counties/Narok/Maasai Mara National Reserve': 'Conservation/Maasai Mara National Reserve',
  'Counties/Samburu County/Samburu National Reserve County': 'Counties/Samburu/Samburu National Reserve County',
  'Counties/Siaya/Siaya County': 'Luo/Siaya County',
  'Counties/Turkana County/Lake Turkana': 'Turkana/Lake Turkana',
  'Counties/Turkana County/Turkana Boy': 'Turkana/Turkana Boy',
  'Counties/Turkana County/Turkana Fishing': 'Turkana/Turkana Fishing',
  'Kikuyu/Dedan Kimathi': 'Counties/Nyeri/Dedan Kimathi',
  'Kikuyu/Githunguri Teachers College': 'Education/Githunguri Teachers College',
  'Kikuyu/Kenya Land and Freedom Army': 'Cross-Ethnic/Kenya Land and Freedom Army',
  'Kikuyu/Kenyatta Detention Legacy': 'Presidencies/Jomo Kenyatta Presidency/Kenyatta Detention Legacy',
  'Kikuyu/Kenyatta Family Business': 'Corporate Kenya/Kenyatta Family Business',
  'Kikuyu/Kikuyu Central Association': 'Religion/Kikuyu Central Association',
  'Kikuyu/Kikuyu Independent Schools': 'Education/Kikuyu Independent Schools',
  'Kikuyu/Kikuyu Traditional Music': 'Music/Kikuyu Traditional Music',
  'Kikuyu/Wangari Maathai': 'Conservation/Wangari Maathai',
  'Luo/Kisumu Massacre 1969': 'Presidencies/Jomo Kenyatta Presidency/Kisumu Massacre 1969',
  'Maasai/Samburu Early Marriage': 'Samburu/Samburu Early Marriage',
  'Music/D.O. Misiani': 'Luo/D.O. Misiani',
  'Political Movements/Kenneth Matiba': 'Kikuyu/Kenneth Matiba',
  'Political Movements/Raila Odinga': 'Luo/Raila Odinga',
  'Political Movements/Saba Saba 1990': 'Kikuyu/Saba Saba 1990',
  'Political Movements/The Lancaster House Conferences': 'Europeans/The Lancaster House Conferences',
  'Political Movements/The Second Liberation': 'Cross-Ethnic/The Second Liberation',
  'Political Movements/Tom Mboya': 'Luo/Tom Mboya',
  'Political Movements/Wangari Maathai': 'Conservation/Wangari Maathai',
  'Somali/Dadaab Refugee Complex': 'Counties/Garissa/Dadaab Refugee Complex',
  'Somali/Garissa University Attack 2015': 'Presidencies/Uhuru Kenyatta Presidency/Garissa University Attack 2015',
};

let content = fs.readFileSync('quartz/trails.ts', 'utf8');
let count = 0;

for (const [from, to] of Object.entries(replacements)) {
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`"${escaped}"`, 'g');
  const matches = content.match(re);
  if (matches) {
    content = content.replace(re, `"${to}"`);
    count += matches.length;
    console.log(`${from} -> ${to} (${matches.length} occurrences)`);
  }
}

fs.writeFileSync('quartz/trails.ts', content);
console.log(`\nFixed ${count} trail slug references`);

const fs = require('fs');

// 1. Recreate deleted explore stubs
const stubs = {
  'Kikuyu': 'Kikuyu',
  'Luo': 'Luo',
  'Maasai': 'Maasai',
  'Swahili': 'Swahili',
  'Sports': 'Sports',
  'Legacy': 'Legacy',
  'Kalenjin': 'Kalenjin',
  'Corruption': 'Corruption',
  'Conservation': 'Conservation',
};

let created = 0;
for (const [name, root] of Object.entries(stubs)) {
  const filePath = `content/explore/${name}.md`;
  if (!fs.existsSync(filePath)) {
    const content = `---
title: Explore ${name}
---

<div class="ok-explore-tree" data-root="${root}"></div>

[← Back to Explore Hub](/Explore)
`;
    fs.writeFileSync(filePath, content);
    created++;
    console.log(`Created: ${filePath}`);
  } else {
    console.log(`Exists: ${filePath}`);
  }
}

console.log(`\nCreated ${created} explore stubs`);

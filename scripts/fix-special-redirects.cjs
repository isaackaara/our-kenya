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
let totalFixed = 0;
let filesFixed = 0;

// Special redirects
const specialRedirects = {
  "Ngugi wa Thiong\u2019o": "Ngugi wa Thiong o",  // right single quote
  "Ngugi wa Thiong'o": "Ngugi wa Thiong o",  // regular apostrophe
};

// Generic targets to remove (not real topics)
const removeTargets = ['Related Topics', 'Other Connections'];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  let fileFixed = 0;

  // Apply special redirects
  for (const [from, to] of Object.entries(specialRedirects)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\[\\[${escaped}((?:#[^\\]|]*)?(?:\\|[^\\]]+?)?)\\]\\]`, 'g');
    content = content.replace(re, (match, suffix) => {
      fileFixed++;
      return `[[${to}${suffix}]]`;
    });
  }

  // Remove generic dead links - replace [[Target]] with just Target, [[Target|alias]] with alias
  for (const target of removeTargets) {
    const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // With alias: [[Related Topics|Display Text]] -> Display Text
    const reAlias = new RegExp(`\\[\\[${escaped}\\|([^\\]]+?)\\]\\]`, 'g');
    content = content.replace(reAlias, (match, alias) => {
      fileFixed++;
      return alias;
    });
    // Without alias: [[Related Topics]] -> Related Topics
    const reNoAlias = new RegExp(`\\[\\[${escaped}\\]\\]`, 'g');
    content = content.replace(reNoAlias, (match) => {
      fileFixed++;
      return target;
    });
    // Also remove lines that are just "- [[Related Topics]]" or "## Related Topics" with dead link
    // Actually, some of these might be section headers that are fine as plain text
  }

  if (content !== original) {
    fs.writeFileSync(f, content);
    filesFixed++;
    totalFixed += fileFixed;
  }
}

console.log(`Special fixes: ${totalFixed} refs fixed in ${filesFixed} files`);

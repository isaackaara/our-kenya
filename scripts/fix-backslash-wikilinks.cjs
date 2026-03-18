const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "..", "content");

function walk(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(full));
    } else if (entry.name.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

// Match wikilinks that contain at least one backslash
const wikiRe = /\[\[([^\]]*\\[^\]]*)\]\]/g;

let totalFixed = 0;
let filesFixed = 0;
const details = [];

for (const file of walk(contentDir)) {
  const original = fs.readFileSync(file, "utf8");
  let changed = false;

  const updated = original.replace(wikiRe, (match, inner) => {
    // Remove all backslashes from the wikilink content
    const fixed = inner.replace(/\\/g, "");
    changed = true;
    totalFixed++;
    return `[[${fixed}]]`;
  });

  if (changed) {
    filesFixed++;
    const rel = path.relative(contentDir, file);
    const count = (updated !== original) ? (original.match(wikiRe) || []).length : 0;
    details.push(`  ${rel}: ${count} link(s)`);
    fs.writeFileSync(file, updated, "utf8");
  }
}

console.log(`Fixed ${totalFixed} backslash wikilinks across ${filesFixed} files.\n`);
if (details.length) {
  console.log("Files modified:");
  details.forEach((d) => console.log(d));
}

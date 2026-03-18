const fs = require('fs');
const path = require('path');

let deleted = 0, moved = 0;

function rm(f) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    deleted++;
    console.log(`  DEL: ${f}`);
  }
}

// === 1. Delete 22 root stubs ===
console.log('\n=== Deleting root stubs ===');
const rootStubs = [
  'Anglo Leasing Scandal', 'Colonial Road Construction', 'County Governments First Term',
  'Electoral Commission of Kenya', 'Export Processing Zones', 'Judicial Service Commission',
  'Kenya Commercial Bank History', 'Kenya News Agency', 'Kenya Ports Authority',
  'Kenya Power and Lighting Company', 'Malaria Control Programs', 'Mental Health Services',
  'Mombasa Water Supply', 'National Social Security Fund', 'Public Procurement Corruption',
  'Standard Chartered Kenya', 'Standard Gauge Railway', 'State House Administration',
  'Swahili Architecture', 'Teacher Training Colleges', 'Transparency International Kenya',
  'University of Nairobi Founding'
];
for (const name of rootStubs) {
  rm(`content/${name}.md`);
}

// === 2. Delete General Topics duplicates ===
console.log('\n=== Deleting General Topics duplicates ===');
const gtDupes = [
  '2010-constitution', 'diaspora-communities', 'eac-history',
  'european-settlers-kenya', 'financial-inclusion', 'international-monetary-fund',
  'kenyan-somali', 'land-distribution-kenya', 'water-resources-management'
];
for (const name of gtDupes) {
  rm(`content/General Topics/${name}.md`);
}

// === 3. Delete all quoted West Pokot files ===
console.log('\n=== Deleting quoted West Pokot directory ===');
const quotedWP = 'content/Counties/"West Pokot"';
if (fs.existsSync(quotedWP)) {
  for (const f of fs.readdirSync(quotedWP)) {
    rm(path.join(quotedWP, f));
  }
  fs.rmdirSync(quotedWP);
  console.log(`  RMDIR: ${quotedWP}`);
}

// === 4. Handle quoted Samburu County ===
console.log('\n=== Handling quoted Samburu County ===');
const quotedSamburu = 'content/Counties/"Samburu County"';
const unquotedSamburu = 'content/Counties/Samburu';

// Ensure unquoted dir exists
if (!fs.existsSync(unquotedSamburu)) {
  fs.mkdirSync(unquotedSamburu, { recursive: true });
}

if (fs.existsSync(quotedSamburu)) {
  for (const f of fs.readdirSync(quotedSamburu)) {
    const src = path.join(quotedSamburu, f);
    const dst = path.join(unquotedSamburu, f);
    if (fs.existsSync(dst)) {
      // Both exist - keep the larger one
      const srcSize = fs.statSync(src).size;
      const dstSize = fs.statSync(dst).size;
      if (srcSize > dstSize) {
        // Quoted version is larger, overwrite
        fs.copyFileSync(src, dst);
        console.log(`  OVERWRITE: ${dst} (quoted was larger: ${srcSize} > ${dstSize})`);
      }
      rm(src);
    } else {
      // Move to unquoted
      fs.renameSync(src, dst);
      moved++;
      console.log(`  MOVE: ${src} -> ${dst}`);
    }
  }
  fs.rmdirSync(quotedSamburu);
  console.log(`  RMDIR: ${quotedSamburu}`);
}

// === 5. Delete malformed loose samburu files ===
console.log('\n=== Deleting malformed Samburu files ===');
const malformed = [
  'content/Counties/samburu-county"-agriculture.md',
  'content/Counties/samburu-county"-county.md',
  'content/Counties/samburu-county"-education.md',
  'content/Counties/samburu-county"-politics.md',
];
for (const f of malformed) {
  rm(f);
}

// === 6. Merge Samburu County/ (1 file) into Samburu/ ===
console.log('\n=== Merging Samburu County/ into Samburu/ ===');
const samburuCountyDir = 'content/Counties/Samburu County';
if (fs.existsSync(samburuCountyDir)) {
  for (const f of fs.readdirSync(samburuCountyDir)) {
    const src = path.join(samburuCountyDir, f);
    const dst = path.join(unquotedSamburu, f);
    if (!fs.existsSync(dst)) {
      fs.renameSync(src, dst);
      moved++;
      console.log(`  MOVE: ${src} -> ${dst}`);
    } else {
      rm(src);
    }
  }
  fs.rmdirSync(samburuCountyDir);
  console.log(`  RMDIR: ${samburuCountyDir}`);
}

console.log(`\n=== Summary: ${deleted} files deleted, ${moved} files moved ===`);

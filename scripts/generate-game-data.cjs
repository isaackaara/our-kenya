#!/usr/bin/env node

/**
 * Generate game data for Our Kenya games.
 * Reads scores.json + content files → outputs static JSON for daily trivia & timeline.
 * Run after quartz build: node scripts/generate-game-data.cjs
 */

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "../content");
const SCORES_FILE = path.join(__dirname, "../quartz/static/scores.json");
const OUTPUT_DIR = path.join(__dirname, "../public/static/games");

// Seeded PRNG (same as daily-note.inline.ts)
function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function slugToTitle(slug) {
  const parts = slug.split("/");
  const name = parts[parts.length - 1] || parts[0];
  return name.replace(/-/g, " ").replace(/%20/g, " ");
}

function slugToCategory(slug) {
  const parts = slug.split("/");
  return parts.length > 1 ? parts[0] : "General";
}

function slugToFilePath(slug) {
  // Slugs use hyphens, filenames use spaces
  const parts = slug.split("/");
  const resolved = parts.map((p) => p.replace(/-/g, " ").replace(/%20/g, " ")).join("/");
  return path.join(CONTENT_DIR, resolved + ".md");
}

function readFirstParagraph(slug) {
  const filePath = slugToFilePath(slug);
  try {
    const content = fs.readFileSync(filePath, "utf8");
    // Strip frontmatter
    let text = content;
    if (text.startsWith("---")) {
      const end = text.indexOf("---", 3);
      if (end !== -1) text = text.slice(end + 3);
    }
    // Find first substantial paragraph
    const lines = text.split("\n");
    let para = "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("<") || trimmed.startsWith("!")) continue;
      // Strip wikilinks for display
      para = trimmed
        .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
        .replace(/\[\[([^\]]+)\]\]/g, "$1");
      if (para.length > 40) break;
    }
    return para.length > 200 ? para.slice(0, 200).trimEnd() + "..." : para;
  } catch {
    return "";
  }
}

// Extract a year from note content (for timeline game)
function extractYear(slug) {
  const filePath = slugToFilePath(slug);
  try {
    const content = fs.readFileSync(filePath, "utf8");
    // Look for years in the first 1500 chars (most relevant)
    const text = content.slice(0, 1500);
    // Match years like 1895, 1963, 2007 etc.
    const yearMatches = text.match(/\b(1[5-9]\d{2}|20[0-2]\d)\b/g);
    if (yearMatches && yearMatches.length > 0) {
      // Return the first year found
      return parseInt(yearMatches[0], 10);
    }
    return null;
  } catch {
    return null;
  }
}

function main() {
  // Load scores
  if (!fs.existsSync(SCORES_FILE)) {
    console.error("scores.json not found at", SCORES_FILE);
    process.exit(1);
  }
  const scores = JSON.parse(fs.readFileSync(SCORES_FILE, "utf8"));

  // Filter high-wonder notes (w >= 7)
  const highWonder = Object.keys(scores).filter((k) => scores[k].w >= 7);
  console.log(`Found ${highWonder.length} high-wonder notes (w >= 7)`);

  // Build category index
  const byCategory = {};
  for (const slug of highWonder) {
    const cat = slugToCategory(slug);
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(slug);
  }

  // Filter to categories with 4+ notes (needed for distractor generation)
  const usableCategories = Object.keys(byCategory).filter((c) => byCategory[c].length >= 4);
  const usableSlugs = usableCategories.flatMap((c) => byCategory[c]);
  console.log(`${usableCategories.length} categories with 4+ notes, ${usableSlugs.length} usable slugs`);

  // Pre-read excerpts for all usable slugs
  const excerpts = {};
  for (const slug of usableSlugs) {
    excerpts[slug] = readFirstParagraph(slug);
  }

  // ── Generate Daily Trivia (365 days) ──────────────────────────

  const triviaData = [];
  for (let dayOfYear = 0; dayOfYear < 365; dayOfYear++) {
    const rng = mulberry32(dayOfYear * 7919 + 2026);

    // Pick 5 questions for this day
    const dayPool = shuffle(usableSlugs, rng);
    const questions = [];
    const usedSlugs = new Set();

    for (let q = 0; q < 5 && dayPool.length > 0; q++) {
      const slug = dayPool.find((s) => !usedSlugs.has(s));
      if (!slug) break;
      usedSlugs.add(slug);

      const cat = slugToCategory(slug);
      const title = slugToTitle(slug);
      const excerpt = excerpts[slug] || "";

      // Generate question based on type rotation
      const qType = q % 3;
      let question, options, correctIdx;

      if (qType === 0 && excerpt.length > 50) {
        // Type: "What is this excerpt about?"
        const truncExcerpt = excerpt.length > 150 ? excerpt.slice(0, 150) + "..." : excerpt;
        question = `"${truncExcerpt}" — What is this about?`;

        // Correct answer + 3 distractors from different categories
        const distractors = shuffle(
          usableSlugs.filter((s) => s !== slug && slugToCategory(s) !== cat),
          rng
        ).slice(0, 3);
        const allOptions = shuffle([slug, ...distractors], rng);
        options = allOptions.map(slugToTitle);
        correctIdx = allOptions.indexOf(slug);
      } else if (qType === 1) {
        // Type: "Which of these belongs to [category]?"
        question = `Which of these is related to ${cat.replace(/-/g, " ")}?`;

        const sameCategory = byCategory[cat].filter((s) => s !== slug);
        const correctOption = slug;
        const distractors = shuffle(
          usableSlugs.filter((s) => slugToCategory(s) !== cat),
          rng
        ).slice(0, 3);
        const allOptions = shuffle([correctOption, ...distractors], rng);
        options = allOptions.map(slugToTitle);
        correctIdx = allOptions.indexOf(correctOption);
      } else {
        // Type: "What category does [title] belong to?"
        question = `What topic area does "${title}" fall under?`;

        const distractorCats = shuffle(
          usableCategories.filter((c) => c !== cat),
          rng
        ).slice(0, 3);
        const allOptions = shuffle([cat, ...distractorCats], rng);
        options = allOptions.map((c) => c.replace(/-/g, " "));
        correctIdx = allOptions.indexOf(cat);
      }

      questions.push({
        q: question,
        options,
        answer: correctIdx,
        slug,
        title,
      });
    }

    triviaData.push(questions);
  }

  // ── Generate Timeline Data ────────────────────────────────────

  // Collect notes with extractable years
  const datedNotes = [];
  for (const slug of highWonder) {
    const year = extractYear(slug);
    if (year && year >= 1500 && year <= 2025) {
      datedNotes.push({
        slug,
        title: slugToTitle(slug),
        year,
      });
    }
  }
  console.log(`Found ${datedNotes.length} notes with extractable dates for timeline`);

  // Sort by year for tier assignment
  datedNotes.sort((a, b) => a.year - b.year);

  const timelineData = { daily: [], freeplay: [] };

  for (let dayOfYear = 0; dayOfYear < 365; dayOfYear++) {
    const rng = mulberry32(dayOfYear * 6271 + 1789);
    const set = generateTimelineSet(datedNotes, rng, 5);
    if (set.length === 5) {
      timelineData.daily.push(set);
    } else {
      // Fallback: just pick 5 random dated notes
      const fallback = shuffle(datedNotes, rng).slice(0, 5);
      timelineData.daily.push(fallback.map((n) => ({ slug: n.slug, title: n.title, year: n.year })));
    }
  }

  // Free play pool: 50 sets
  for (let i = 0; i < 50; i++) {
    const rng = mulberry32(i * 3571 + 9973);
    const set = shuffle(datedNotes, rng).slice(0, 5);
    timelineData.freeplay.push(set.map((n) => ({ slug: n.slug, title: n.title, year: n.year })));
  }

  // ── Write output ──────────────────────────────────────────────

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, "daily-trivia.json"), JSON.stringify(triviaData));
  console.log(`Wrote daily-trivia.json (${triviaData.length} days, ~${(JSON.stringify(triviaData).length / 1024).toFixed(0)}KB)`);

  fs.writeFileSync(path.join(OUTPUT_DIR, "timeline.json"), JSON.stringify(timelineData));
  console.log(`Wrote timeline.json (${timelineData.daily.length} daily + ${timelineData.freeplay.length} freeplay, ~${(JSON.stringify(timelineData).length / 1024).toFixed(0)}KB)`);
}

function generateTimelineSet(datedNotes, rng, count) {
  if (datedNotes.length < count) return [];

  // Pick notes with spread-out years
  const picked = [];
  const pool = shuffle(datedNotes, rng);

  for (const note of pool) {
    if (picked.length >= count) break;
    // Ensure at least 5 years apart from all picked notes
    const tooClose = picked.some((p) => Math.abs(p.year - note.year) < 5);
    if (!tooClose) {
      picked.push(note);
    }
  }

  return picked.map((n) => ({ slug: n.slug, title: n.title, year: n.year }));
}

main();

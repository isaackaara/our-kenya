/**
 * pull-contributions.cjs
 * Fetches new contributions from the Our Kenya API and writes them
 * to plans/contributions-inbox.md. Skips submissions that already
 * have a plan file in plans/contributions/.
 *
 * Usage:
 *   node scripts/pull-contributions.cjs
 *
 * Requires PROXY_AUTH_TOKEN env var (or set in .env).
 */

const fs = require("fs");
const path = require("path");

const API_URL =
  process.env.OK_CONTRIBUTIONS_API ||
  "https://openclaw-api-proxy-production.up.railway.app/api/contributions";
const AUTH_TOKEN = process.env.PROXY_AUTH_TOKEN;

const PLANS_DIR = path.join(__dirname, "..", "plans", "contributions");
const INBOX_FILE = path.join(__dirname, "..", "plans", "contributions-inbox.md");

async function main() {
  if (!AUTH_TOKEN) {
    console.error("Error: PROXY_AUTH_TOKEN environment variable is required.");
    console.error("Set it to your Railway proxy auth token.");
    process.exit(1);
  }

  // Fetch submissions from API
  console.log("Fetching contributions...");
  const resp = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
  });

  if (!resp.ok) {
    console.error(`API error: ${resp.status} ${resp.statusText}`);
    const body = await resp.text();
    console.error(body.slice(0, 500));
    process.exit(1);
  }

  const data = await resp.json();
  const submissions = data.submissions || [];
  console.log(`Found ${submissions.length} total submissions.`);

  // Get existing plan files to detect already-planned submissions
  const existingPlans = new Set();
  if (fs.existsSync(PLANS_DIR)) {
    for (const file of fs.readdirSync(PLANS_DIR)) {
      if (file.endsWith(".md")) {
        existingPlans.add(file.replace(".md", ""));
      }
    }
  }

  // Filter: keep only submissions without a matching plan file
  // Match by slugified topic name
  function slugify(topic) {
    return topic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const newSubmissions = submissions.filter((s) => {
    const slug = slugify(s.topic);
    return !existingPlans.has(slug);
  });

  console.log(
    `${newSubmissions.length} new (no plan file), ${submissions.length - newSubmissions.length} already planned.`
  );

  if (newSubmissions.length === 0) {
    // Write empty inbox
    fs.writeFileSync(
      INBOX_FILE,
      `# Contributions Inbox\n\n_No new submissions. All ${submissions.length} contributions have plan files._\n\nLast checked: ${new Date().toISOString()}\n`
    );
    console.log("Inbox is empty — all submissions have plans.");
    return;
  }

  // Build inbox markdown
  const lines = [
    "# Contributions Inbox",
    "",
    `_${newSubmissions.length} new submission(s) awaiting review. Last pulled: ${new Date().toISOString()}_`,
    "",
  ];

  for (const s of newSubmissions) {
    lines.push(`## ${s.topic}`);
    lines.push("");
    lines.push(`- **Submitted:** ${s.timestamp}`);
    lines.push(`- **Why it matters:** ${s.why}`);
    lines.push(`- **Sources:** ${s.sources || "(none provided)"}`);
    lines.push(`- **Email:** ${s.email || "(anonymous)"}`);
    lines.push(`- **Status:** ${s.status}`);
    lines.push(`- **Slug:** \`${slugify(s.topic)}\``);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  fs.writeFileSync(INBOX_FILE, lines.join("\n"));
  console.log(`Wrote ${newSubmissions.length} submissions to ${INBOX_FILE}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

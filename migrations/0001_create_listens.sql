CREATE TABLE IF NOT EXISTS listens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  listener_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_listens_slug ON listens(slug);
CREATE INDEX IF NOT EXISTS idx_listens_listener ON listens(slug, listener_id);

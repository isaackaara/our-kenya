-- 0005: index created_at on pageviews and listens.
--
-- Why: every aggregate endpoint filters or groups by time, and created_at had no
-- index, so each call full-scanned the table. On 2026-09-01 this blew the D1 free
-- tier: 112M rows read across 2,000 queries, about 56,000 rows scanned per query
-- on a 19MB database.
--
-- These are COVERING indexes. Listing slug and listener_id after created_at means
-- the trending and daily-count queries can be answered from the index alone,
-- without reading the table at all. Column order matters: created_at must come
-- first because it is the range predicate.

CREATE INDEX IF NOT EXISTS idx_pageviews_created
  ON pageviews(created_at, slug, listener_id);

CREATE INDEX IF NOT EXISTS idx_listens_created
  ON listens(created_at, slug, listener_id);

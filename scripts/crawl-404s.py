#!/usr/bin/env python3
"""
crawl-404s.py — Playwright-based 404 crawler for the Quartz dev server.

Performs a BFS crawl of internal links starting from the base URL,
detecting pages that return 404 (either by HTTP status or by the
presence of the Quartz "doesn't exist" message).

Usage:
    python3 scripts/crawl-404s.py
    python3 scripts/crawl-404s.py --url http://localhost:8080 --max-pages 1000 --depth 5
"""

from __future__ import annotations

import argparse
import sys
from collections import deque
from typing import Optional
from urllib.parse import urljoin, urlparse, urldefrag

from playwright.sync_api import sync_playwright


QUARTZ_404_TEXT = "Either this page is private or doesn't exist"


def normalise_url(base: str, href: str) -> Optional[str]:
    """Resolve href against base, strip fragment, return None for external/non-http links."""
    url = urljoin(base, href)
    url, _ = urldefrag(url)
    # Strip trailing slash for consistency (but keep root "/")
    if url.endswith("/") and len(urlparse(url).path) > 1:
        url = url.rstrip("/")
    return url


def is_internal(url: str, base_origin: str) -> bool:
    """Check whether a URL belongs to the same origin as the base."""
    parsed = urlparse(url)
    return parsed.scheme in ("http", "https") and parsed.netloc == urlparse(base_origin).netloc


def is_crawlable(url: str) -> bool:
    """Skip obvious non-page resources."""
    path = urlparse(url).path.lower()
    skip_extensions = (
        ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico",
        ".css", ".js", ".woff", ".woff2", ".ttf", ".eot",
        ".pdf", ".zip", ".tar", ".gz", ".mp3", ".mp4", ".webm",
        ".json", ".xml", ".rss", ".atom",
    )
    return not path.endswith(skip_extensions)


def crawl(base_url: str, max_pages: int, max_depth: int) -> None:
    """Run the BFS crawl and print results."""
    base_origin = f"{urlparse(base_url).scheme}://{urlparse(base_url).netloc}"

    # BFS queue: (url, depth, referrer_url)
    queue: deque[tuple[str, int, str | None]] = deque()
    queue.append((base_url, 0, None))

    visited: set[str] = set()
    visited.add(base_url)

    pages_crawled = 0
    four_oh_fours: list[tuple[str, str | None]] = []  # (url, referrer)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="OurKenya-404-Crawler/1.0",
            java_script_enabled=True,
        )
        page = context.new_page()

        while queue and pages_crawled < max_pages:
            url, depth, referrer = queue.popleft()

            try:
                response = page.goto(url, wait_until="domcontentloaded", timeout=15000)
            except Exception as exc:
                print(f"  ERROR  {url}  ({exc})")
                continue

            pages_crawled += 1
            status = response.status if response else 0

            # Detect 404 by status code or page content
            is_404 = False
            if status == 404:
                is_404 = True
            else:
                try:
                    body_text = page.text_content("body") or ""
                    if QUARTZ_404_TEXT in body_text:
                        is_404 = True
                except Exception:
                    pass

            if is_404:
                four_oh_fours.append((url, referrer))
                label = "404"
            else:
                label = str(status)

            # Progress line
            print(f"  [{pages_crawled}/{max_pages}] {label}  depth={depth}  {url}")

            # If this page is a 404 or we've hit max depth, don't extract links from it
            if is_404 or depth >= max_depth:
                continue

            # Extract internal links
            try:
                anchors = page.query_selector_all("a[href]")
                for anchor in anchors:
                    href = anchor.get_attribute("href")
                    if not href:
                        continue

                    resolved = normalise_url(url, href)
                    if resolved is None:
                        continue
                    if not is_internal(resolved, base_origin):
                        continue
                    if not is_crawlable(resolved):
                        continue
                    if resolved in visited:
                        continue

                    visited.add(resolved)
                    queue.append((resolved, depth + 1, url))
            except Exception:
                pass

        browser.close()

    # --- Summary ---
    print("\n" + "=" * 72)
    print("CRAWL SUMMARY")
    print("=" * 72)
    print(f"  Base URL:       {base_url}")
    print(f"  Max depth:      {max_depth}")
    print(f"  Max pages:      {max_pages}")
    print(f"  Pages crawled:  {pages_crawled}")
    print(f"  404s found:     {len(four_oh_fours)}")

    if four_oh_fours:
        print(f"\n{'─' * 72}")
        print("404 URLs and their referrers:\n")
        for i, (bad_url, ref) in enumerate(four_oh_fours, 1):
            print(f"  {i:>4}. {bad_url}")
            print(f"        linked from: {ref or '(start URL)'}")
        print(f"\n{'─' * 72}")
    else:
        print("\n  No 404s found.")

    print()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Crawl the Quartz dev server for 404 pages using Playwright."
    )
    parser.add_argument(
        "--url",
        default="http://localhost:8080",
        help="Base URL to start crawling (default: http://localhost:8080)",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=500,
        help="Maximum number of pages to visit (default: 500)",
    )
    parser.add_argument(
        "--depth",
        type=int,
        default=3,
        help="Maximum crawl depth (default: 3)",
    )
    args = parser.parse_args()

    print(f"Starting 404 crawl: {args.url}  (max_pages={args.max_pages}, depth={args.depth})\n")
    crawl(args.url, args.max_pages, args.depth)


if __name__ == "__main__":
    main()

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { slugToTrails, stopHref } from "../trails"

interface TrailNavOptions {
  position?: "top" | "bottom"
}

export default ((opts?: TrailNavOptions) => {
  const position = opts?.position ?? "top"

  const TrailNav: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const slug = fileData.slug
    if (!slug) return null

    const trailMemberships = slugToTrails[slug]
    if (!trailMemberships || trailMemberships.length === 0) return null

    // Show first trail if note is in multiple
    const { trail, position: stopPosition } = trailMemberships[0]
    const totalStops = trail.stops.length
    const currentStop = stopPosition + 1
    const isLastStop = stopPosition === totalStops - 1

    const prevStop = stopPosition > 0 ? trail.stops[stopPosition - 1] : null
    const nextStop = stopPosition < totalStops - 1 ? trail.stops[stopPosition + 1] : null

    const otherTrailsCount = trailMemberships.length - 1

    // Get previous stops for history stack
    const previousStops = stopPosition > 0 ? trail.stops.slice(0, stopPosition) : []

    // Generate dot indicators
    const dots = Array.from({ length: totalStops }, (_, i) => {
      const isCurrent = i === stopPosition
      const isCompleted = i < stopPosition
      const dotClass = isCompleted ? "completed" : isCurrent ? "current" : "remaining"
      return (
        <span
          key={i}
          className={`trail-dot ${dotClass}`}
          aria-label={`Stop ${i + 1}${isCurrent ? " (current)" : ""}`}
        />
      )
    })

    if (position === "top") {
      return (
        <div className={`trail-nav trail-nav-top-container ${displayClass ?? ""}`}>
          <div className="trail-nav-top">
            {/* History stack - only show if position > 0 */}
            {previousStops.length > 0 && (
              <div className="trail-history-stack">
                {previousStops.map((stop, index) => {
                  const stopNumber = index + 1
                  const stackIndex = previousStops.length - 1 - index // Most recent at bottom
                  const opacity = 0.85 - (stackIndex * 0.08) // Subtle opacity layering
                  
                  return (
                    <a
                      key={index}
                      href={stopHref(stop)}
                      className="trail-history-strip"
                      style={{ opacity }}
                      title={`Jump to Stop ${stopNumber}: ${stop.title}`}
                    >
                      <span className="trail-history-number">{stopNumber}</span>
                      <span className="trail-history-text">{stop.title}</span>
                      <span className="trail-history-chevron">→</span>
                    </a>
                  )
                })}
              </div>
            )}

            {/* Main card content */}
            <div className="trail-card-main">
              <a href="/STORY-TRAILS" className="trail-back-link">← All Story Trails</a>
              <div className="trail-header">
                <a href="/STORY-TRAILS" className="trail-name">
                  Story Trail: {trail.name}
                </a>
              </div>
              <div className="trail-dots">{dots}</div>
              <span className="trail-position">Stop {currentStop} of {totalStops}</span>
              <div className="trail-top-nav">
                {prevStop
                  ? <a href={stopHref(prevStop)} className="trail-top-prev">← {prevStop.title}</a>
                  : <span className="trail-top-spacer" />
                }
                {nextStop
                  ? <a href={stopHref(nextStop)} className="trail-top-next">{nextStop.title} →</a>
                  : <a href="/STORY-TRAILS" className="trail-top-next">All trails →</a>
                }
              </div>
              {otherTrailsCount > 0 && (
                <div className="trail-other">
                  Also part of {otherTrailsCount} other trail{otherTrailsCount > 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    // Bottom position — clean minimal nav, no big blocks
    return (
      <div className={`trail-nav trail-nav-bottom-container ${displayClass ?? ""}`}>
        <div className="trail-nav-bottom">
          <div className="trail-nav-buttons">
            {prevStop ? (
              <a href={stopHref(prevStop)} className="trail-nav-prev">
                <span className="trail-nav-arrow">←</span>
                <span className="trail-nav-label">{prevStop.title}</span>
              </a>
            ) : <div />}
            {nextStop ? (
              <a href={stopHref(nextStop)} className="trail-nav-next">
                <span className="trail-nav-label">{nextStop.title}</span>
                <span className="trail-nav-arrow">→</span>
              </a>
            ) : isLastStop ? (
              <a href="/STORY-TRAILS" className="trail-nav-next trail-nav-done">
                <span className="trail-nav-label">All trails</span>
                <span className="trail-nav-arrow">→</span>
              </a>
            ) : <div />}
          </div>
        </div>
      </div>
    )
  }

  TrailNav.css = `
  .trail-nav {
    width: 100%;
    margin: 0;
  }

  .trail-nav-top-container {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .trail-nav-bottom-container {
    margin-top: 2rem;
  }

  .trail-nav-top {
    background: transparent;
    color: var(--lightgray);
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* History stack */
  .trail-history-stack {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .trail-history-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    padding: 0 1rem;
    background: var(--gray);
    color: rgba(255, 255, 255, 0.95);
    text-decoration: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    transition: filter 0.15s;
    box-shadow: 0 2px 4px rgba(0, 0, 6, 0.15);
  }

  .trail-history-strip:hover {
    filter: brightness(1.15);
  }

  .trail-history-number {
    font-size: 0.7rem;
    font-weight: 600;
    opacity: 0.75;
    flex-shrink: 0;
    margin-right: 0.5rem;
  }

  .trail-history-text {
    flex: 1;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .trail-history-chevron {
    font-size: 0.75rem;
    opacity: 0.6;
    flex-shrink: 0;
    margin-left: 0.5rem;
  }

  /* Main card content */
  .trail-card-main {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.6rem;
  }

  .trail-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .trail-icon {
    font-size: 1.1rem;
  }

  .trail-back-link {
    align-self: flex-start;
    font-size: 0.75rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: opacity 0.15s;
    margin-bottom: -0.2rem;
  }

  .trail-back-link:hover {
    opacity: 1;
  }

  .trail-name {
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: opacity 0.2s;
    white-space: normal;
    word-break: break-word;
    line-height: 1.35;
  }

  .trail-name:hover {
    opacity: 0.85;
  }

  .trail-dots {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .trail-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .trail-dot.completed {
    background: white;
  }

  .trail-dot.current {
    background: white;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
  }

  .trail-dot.remaining {
    background: transparent;
    border: 1px solid white;
  }

  .trail-position {
    font-size: 0.8rem;
    opacity: 0.85;
    letter-spacing: 0.03em;
  }

  .trail-other {
    font-size: 0.75rem;
    opacity: 0.75;
  }

  /* Top card inline nav */
  .trail-top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
    margin-top: 0.25rem;
    border-top: 1px solid rgba(255,255,255,0.2);
    padding-top: 0.6rem;
  }

  .trail-top-prev,
  .trail-top-next {
    color: white;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid rgba(255,255,255,0.3);
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    transition: background 0.15s;
    max-width: 45%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .trail-top-prev {
    text-align: left;
  }

  .trail-top-next {
    text-align: right;
  }

  .trail-top-prev:hover,
  .trail-top-next:hover {
    background: rgba(255,255,255,0.1);
  }

  .trail-top-spacer {
    flex: 1;
  }

  /* Bottom nav - clean, minimal */
  .trail-nav-bottom {
    padding-top: 2rem;
    border-top: 1px solid rgba(128,128,128,0.2);
  }

  .trail-nav-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .trail-nav-prev,
  .trail-nav-next {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: 1.5px solid var(--lightgray);
    color: var(--dark);
    text-decoration: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    min-height: 48px;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    background: transparent;
  }

  .trail-nav-prev:hover,
  .trail-nav-next:hover {
    background: var(--lightgray);
    border-color: var(--gray);
    color: var(--dark);
  }

  .trail-nav-prev {
    justify-content: flex-start;
  }

  .trail-nav-next {
    justify-content: flex-end;
  }

  .trail-nav-arrow {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .trail-nav-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Mobile responsive */
  @media (max-width: 600px) {
    .trail-nav-top-container {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .trail-card-main {
      padding: 1rem 1rem 0.875rem;
      gap: 0.5rem;
    }

    .trail-history-strip {
      height: 32px;
      padding: 0 0.75rem;
    }

    .trail-history-number {
      font-size: 0.65rem;
    }

    .trail-history-text {
      font-size: 0.7rem;
    }

    .trail-history-chevron {
      font-size: 0.7rem;
    }

    .trail-header {
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.35rem;
    }

    .trail-icon {
      font-size: 1rem;
    }

    .trail-name {
      font-size: 0.9rem;
      text-align: center;
      line-height: 1.35;
    }

    .trail-dots {
      gap: 0.55rem;
    }

    .trail-dot {
      width: 9px;
      height: 9px;
    }

    .trail-position {
      font-size: 0.75rem;
    }

    .trail-top-prev,
    .trail-top-next {
      font-size: 0.75rem;
      max-width: 44%;
    }

    .trail-nav-buttons {
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }

    .trail-nav-prev,
    .trail-nav-next {
      min-height: 52px;
      padding: 0.75rem 0.75rem;
      font-size: 0.8rem;
    }
  }

  /* Light mode overrides - all hardcoded white becomes readable */
  [saved-theme="light"] .trail-nav-top {
    border-color: #1a1a1a;
    background: #f5f0e8;
  }
  [saved-theme="light"] .trail-history-strip {
    background: #1a1a1a;
    color: #f5f0e8;
    border-bottom-color: rgba(0,0,0,0.15);
  }
  [saved-theme="light"] .trail-card-main { color: #111; }
  [saved-theme="light"] .trail-back-link { color: #1a1a1a; }
  [saved-theme="light"] .trail-name { color: #111; }
  [saved-theme="light"] .trail-dot.completed { background: #1a1a1a; }
  [saved-theme="light"] .trail-dot.current {
    background: #1a1a1a;
    box-shadow: 0 0 0 2px rgba(27,61,47,0.3);
  }
  [saved-theme="light"] .trail-dot.remaining { border-color: #1a1a1a; }
  [saved-theme="light"] .trail-position,
  [saved-theme="light"] .trail-other { color: #333; }
  [saved-theme="light"] .trail-top-nav { border-top-color: rgba(0,0,0,0.12); }
  [saved-theme="light"] .trail-top-prev,
  [saved-theme="light"] .trail-top-next {
    color: #111;
    border-color: rgba(0,0,0,0.25);
  }
  [saved-theme="light"] .trail-top-prev:hover,
  [saved-theme="light"] .trail-top-next:hover { background: rgba(0,0,0,0.06); }
  `

  return TrailNav
}) satisfies QuartzComponentConstructor<TrailNavOptions>

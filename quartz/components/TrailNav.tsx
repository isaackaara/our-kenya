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
            <a href="/STORY-TRAILS" className="trail-back-link">← All Story Trails</a>
            <div className="trail-header">
              <span className="trail-icon">📖</span>
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
    background: linear-gradient(135deg, #006B3F 0%, #008751 100%);
    color: white;
    padding: 1.25rem 1.5rem 1rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.6rem;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
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
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: color 0.15s;
    margin-bottom: -0.2rem;
  }

  .trail-back-link:hover {
    color: white;
  }

  .trail-name {
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
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
    gap: 0.65rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .trail-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .trail-dot.completed {
    background: rgba(255, 255, 255, 0.6);
  }

  .trail-dot.current {
    background: white;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
  }

  .trail-dot.remaining {
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.4);
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
    color: rgba(255,255,255,0.85);
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    transition: color 0.15s;
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
    color: white;
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
    border: 1.5px solid #006B3F;
    color: #006B3F;
    text-decoration: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    min-height: 48px;
    transition: background 0.15s, color 0.15s;
    background: transparent;
  }

  .trail-nav-prev:hover,
  .trail-nav-next:hover {
    background: #006B3F;
    color: white;
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

    .trail-nav-top {
      padding: 1rem 1rem 0.875rem;
      gap: 0.5rem;
      border-radius: 6px;
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
  `

  return TrailNav
}) satisfies QuartzComponentConstructor<TrailNavOptions>

export const TrailHistoryRail: QuartzComponentConstructor = () => {
  const TrailHistoryRail: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const slug = fileData.slug
    if (!slug) return null

    const trailMemberships = slugToTrails[slug]
    if (!trailMemberships || trailMemberships.length === 0) return null

    const { trail, position: stopPosition } = trailMemberships[0]
    
    // Only render if we're past the first stop
    if (stopPosition === 0) return null

    const previousStops = trail.stops.slice(0, stopPosition)
    const tabCount = previousStops.length

    // Inject body margin to offset content
    if (typeof document !== "undefined") {
      const style = document.createElement("style")
      style.id = "trail-history-rail-offset"
      style.textContent = `
        @media (min-width: 768px) {
          body.trail-has-history {
            margin-left: ${tabCount * 40}px !important;
          }
        }
        @media (max-width: 767px) {
          body.trail-has-history {
            margin-left: ${Math.min(tabCount, 3) * 28}px !important;
          }
        }
      `
      const existing = document.getElementById("trail-history-rail-offset")
      if (existing) {
        existing.remove()
      }
      document.head.appendChild(style)
      document.body.classList.add("trail-has-history")
    }

    return (
      <div className="trail-history-rail">
        {previousStops.map((stop, index) => {
          const stopNumber = index + 1
          const isMostRecent = index === previousStops.length - 1
          const tabClass = isMostRecent ? "trail-history-tab recent" : "trail-history-tab"
          
          return (
            <a
              key={index}
              href={stopHref(stop)}
              className={tabClass}
              title={`Stop ${stopNumber}: ${stop.title}`}
            >
              <span className="trail-history-badge">{stopNumber}</span>
              <span className="trail-history-title">{stop.title}</span>
            </a>
          )
        })}
      </div>
    )
  }

  TrailHistoryRail.css = `
    .trail-history-rail {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      display: flex;
      flex-direction: row;
      z-index: 50;
    }

    .trail-history-tab {
      width: 40px;
      height: 100vh;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
      background: #d1fae5;
      color: #065f46;
      text-decoration: none;
      transition: background 0.2s, filter 0.2s;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }

    .trail-history-tab.recent {
      background: #006B3F;
      color: white;
    }

    .trail-history-tab:hover {
      filter: brightness(1.1);
    }

    .trail-history-badge {
      position: absolute;
      top: 12px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: currentColor;
      color: #d1fae5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: 700;
    }

    .trail-history-tab.recent .trail-history-badge {
      background: white;
      color: #006B3F;
    }

    .trail-history-title {
      transform: rotate(-90deg);
      white-space: nowrap;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: none;
    }

    @media (max-width: 767px) {
      .trail-history-rail {
        /* Show only the 3 most recent previous stops on mobile */
      }

      .trail-history-tab {
        width: 28px;
      }

      .trail-history-tab:not(.recent):nth-last-child(n+4) {
        display: none;
      }

      .trail-history-badge {
        width: 16px;
        height: 16px;
        font-size: 0.6rem;
        top: 8px;
      }

      .trail-history-title {
        font-size: 0.65rem;
        max-width: 120px;
      }
    }
  `

  return TrailHistoryRail
}

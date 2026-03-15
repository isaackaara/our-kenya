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
      const completed = i < stopPosition
      return (
        <span
          key={i}
          className={`trail-dot ${completed ? "completed" : "remaining"}`}
          aria-label={`Stop ${i + 1}${i === stopPosition ? " (current)" : ""}`}
        />
      )
    })

    if (position === "top") {
      return (
        <div className={`trail-nav trail-nav-top-container ${displayClass ?? ""}`}>
          <div className="trail-nav-top">
            <div className="trail-header">
              <span className="trail-icon">📖</span>
              <a href="/STORY-TRAILS" className="trail-name">
                Story Trail: {trail.name}
              </a>
            </div>
            <div className="trail-progress">
              <div className="trail-dots">{dots}</div>
              <span className="trail-position">
                Stop {currentStop} of {totalStops}
              </span>
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

    // Bottom position
    return (
      <div className={`trail-nav trail-nav-bottom-container ${displayClass ?? ""}`}>
        <div className="trail-nav-bottom">
          <div className="trail-nav-buttons">
            {prevStop && (
              <a href={stopHref(prevStop)} className="trail-nav-prev">
                ← {prevStop.title}
              </a>
            )}
            {!prevStop && <div className="trail-nav-spacer" />}

            {nextStop && (
              <a href={stopHref(nextStop)} className="trail-nav-next">
                {nextStop.title} →
              </a>
            )}
          </div>

          {isLastStop ? (
            <div className="trail-complete">
              <p className="trail-complete-text">✓ Trail complete</p>
              <a href="/STORY-TRAILS" className="trail-new">
                Start a new trail →
              </a>
            </div>
          ) : (
            <div className="trail-continue">
              Continue: {trail.name} ({currentStop} of {totalStops})
            </div>
          )}
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
    margin-bottom: 1.5rem;
  }

  .trail-nav-bottom-container {
    margin-top: 2rem;
  }

  .trail-nav-top {
    background: linear-gradient(135deg, #006B3F 0%, #008751 100%);
    color: white;
    padding: 1rem 1.25rem;
    border-radius: 8px;
  }

  .trail-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .trail-icon {
    font-size: 1.25rem;
  }

  .trail-name {
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: opacity 0.2s;
  }

  .trail-name:hover {
    opacity: 0.85;
  }

  .trail-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .trail-dots {
    display: flex;
    gap: 0.4rem;
    align-items: center;
  }

  .trail-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .trail-dot.completed {
    background: white;
  }

  .trail-dot.remaining {
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.5);
  }

  .trail-position {
    font-size: 0.875rem;
    opacity: 0.95;
    white-space: nowrap;
  }

  .trail-other {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .trail-nav-bottom {
    padding-top: 2rem;
    border-top: 2px solid #e0e0e0;
  }

  .trail-nav-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .trail-nav-prev,
  .trail-nav-next {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 1.5rem;
    background: #006B3F;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    min-height: 44px;
    text-align: center;
    transition: background 0.2s;
  }

  .trail-nav-prev:hover,
  .trail-nav-next:hover {
    background: #008751;
  }

  .trail-nav-prev {
    justify-self: start;
    max-width: 300px;
  }

  .trail-nav-next {
    justify-self: end;
    max-width: 300px;
  }

  .trail-nav-spacer {
    grid-column: span 1;
  }

  .trail-continue {
    text-align: center;
    color: #006B3F;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 0.5rem;
  }

  .trail-complete {
    text-align: center;
    padding: 1rem;
  }

  .trail-complete-text {
    color: #006B3F;
    font-weight: 600;
    font-size: 1.1rem;
    margin: 0 0 0.75rem 0;
  }

  .trail-new {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #006B3F;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    transition: background 0.2s;
  }

  .trail-new:hover {
    background: #008751;
  }

  /* Mobile responsive */
  @media (max-width: 600px) {
    .trail-nav-top {
      padding: 0.875rem 1rem;
    }
    
    .trail-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.375rem;
    }
    
    .trail-name {
      font-size: 0.95rem;
    }
    
    .trail-progress {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .trail-dot {
      width: 8px;
      height: 8px;
    }
    
    .trail-position {
      font-size: 0.8rem;
    }
    
    .trail-nav-buttons {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    
    .trail-nav-prev,
    .trail-nav-next {
      max-width: 100%;
      width: 100%;
      padding: 0.875rem 1rem;
      font-size: 0.9rem;
    }
    
    .trail-nav-prev {
      order: 1;
    }
    
    .trail-nav-next {
      order: 2;
    }
    
    .trail-nav-spacer {
      display: none;
    }
  }
  `

  return TrailNav
}) satisfies QuartzComponentConstructor<TrailNavOptions>

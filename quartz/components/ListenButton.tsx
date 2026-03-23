import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import listenScript from "./scripts/listen.inline"
import styles from "./styles/listen.scss"

const ListenButton: QuartzComponent = () => {
  return (
    <div id="ok-listen" class="ok-listen" style="display:none">
      {/* Initial pill button */}
      <button class="ok-listen-btn" aria-label="Listen to this article">
        <svg
          class="ok-listen-icon-play"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <span class="ok-listen-label">Listen</span>
      </button>

      {/* Loading state (hidden until generating) */}
      <div class="ok-listen-loading" style="display:none">
        <svg
          class="ok-listen-spinner"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        <span class="ok-loading-text">Generating audio<br/>This can take up to 30 seconds</span>
      </div>

      {/* Expanded player controls (hidden until audio loads) */}
      <div class="ok-listen-player" style="display:none">
        <button class="ok-player-play" aria-label="Play">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
        <button class="ok-player-pause" aria-label="Pause" style="display:none">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="6" y1="4" x2="6" y2="20" />
            <line x1="18" y1="4" x2="18" y2="20" />
          </svg>
        </button>
        <button class="ok-player-back" aria-label="Rewind 10 seconds">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span class="ok-skip-label">10</span>
        </button>
        <button class="ok-player-fwd" aria-label="Forward 10 seconds">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
          </svg>
          <span class="ok-skip-label">10</span>
        </button>
        <div class="ok-player-track">
          <input type="range" class="ok-player-seek" min="0" max="100" value="0" step="0.1" aria-label="Seek" />
        </div>
        <span class="ok-player-time">0:00 / 0:00</span>
        <button class="ok-player-stop" aria-label="Stop and close player">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Resume prompt (hidden by default) */}
      <div class="ok-listen-resume" style="display:none">
        <span class="ok-resume-text"></span>
        <button class="ok-resume-yes">Resume</button>
        <button class="ok-resume-no">Start over</button>
      </div>

      <audio class="ok-listen-audio" preload="none"></audio>
    </div>
  )
}

ListenButton.afterDOMLoaded = listenScript
ListenButton.css = styles

export default (() => ListenButton) satisfies QuartzComponentConstructor

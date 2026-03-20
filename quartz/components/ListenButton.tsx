import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import listenScript from "./scripts/listen.inline"
import styles from "./styles/listen.scss"

const ListenButton: QuartzComponent = () => {
  return (
    <div id="ok-listen" class="ok-listen" style="display:none">
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
        <svg
          class="ok-listen-icon-pause"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="display:none"
        >
          <line x1="6" y1="4" x2="6" y2="20" />
          <line x1="18" y1="4" x2="18" y2="20" />
        </svg>
        <span class="ok-listen-label">Listen</span>
      </button>
      <button class="ok-listen-stop" aria-label="Stop listening" style="display:none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      </button>
    </div>
  )
}

ListenButton.afterDOMLoaded = listenScript
ListenButton.css = styles

export default (() => ListenButton) satisfies QuartzComponentConstructor

// @ts-ignore
import shareScript from "./scripts/share.inline"
import styles from "./styles/share.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface Options {
  prominent?: boolean
  label?: string
}

export default ((opts?: Options) => {
  const ShareButton: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const prominent = opts?.prominent ?? false
    const label = opts?.label ?? "Share this note"
    
    const title = fileData.frontmatter?.title ?? "Our Kenya"
    const url = `https://ourkenya.com/${fileData.slug}`
    
    return (
      <div class={classNames(displayClass, "share-container", prominent ? "prominent" : "")}>
        <button 
          class="share-button" 
          data-title={title}
          data-url={url}
          aria-label={label}
        >
          <svg 
            class="share-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <span class="share-label">{label}</span>
        </button>
        <div class="share-fallback hidden">
          <button class="share-option copy-link" aria-label="Copy link">
            Copy link
          </button>
          <a class="share-option whatsapp" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a class="share-option twitter" target="_blank" rel="noopener noreferrer">
            X
          </a>
        </div>
        <div class="share-feedback hidden" aria-live="polite">
          Copied!
        </div>
      </div>
    )
  }

  ShareButton.beforeDOMLoaded = shareScript
  ShareButton.css = styles
  return ShareButton
}) satisfies QuartzComponentConstructor

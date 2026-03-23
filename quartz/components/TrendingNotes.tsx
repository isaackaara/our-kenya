import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/trending.inline"
import style from "./styles/trending.scss"

export default (() => {
  const TrendingNotes: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    // On non-homepage pages, render the sidebar container
    if (fileData.slug !== "index") {
      return <div id="ok-trending-sidebar"></div>
    }
    return null
  }
  TrendingNotes.afterDOMLoaded = script
  TrendingNotes.css = style
  return TrendingNotes
}) satisfies QuartzComponentConstructor

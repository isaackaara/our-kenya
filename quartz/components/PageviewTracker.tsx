import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/pageview.inline"

const PageviewTracker: QuartzComponent = () => {
  return null
}

PageviewTracker.afterDOMLoaded = script

export default (() => PageviewTracker) satisfies QuartzComponentConstructor

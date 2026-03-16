import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/trail-mood-filter.inline"

const TrailMoodFilter: QuartzComponent = () => null

TrailMoodFilter.afterDOMLoaded = script

export default (() => TrailMoodFilter) satisfies QuartzComponentConstructor

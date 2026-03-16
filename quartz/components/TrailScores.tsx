import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/trail-scores.inline"

const TrailScores: QuartzComponent = () => null

TrailScores.afterDOMLoaded = script

export default (() => TrailScores) satisfies QuartzComponentConstructor

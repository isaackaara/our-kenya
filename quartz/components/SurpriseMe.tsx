import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/surprise-me.inline"

const SurpriseMe: QuartzComponent = () => null

SurpriseMe.afterDOMLoaded = script

export default (() => SurpriseMe) satisfies QuartzComponentConstructor

import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/hidden-gem.inline"
import style from "./styles/hidden-gem.scss"

const HiddenGem: QuartzComponent = () => null
HiddenGem.afterDOMLoaded = script
HiddenGem.css = style

export default (() => HiddenGem) satisfies QuartzComponentConstructor

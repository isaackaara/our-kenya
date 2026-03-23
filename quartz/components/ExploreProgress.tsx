import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/explore-progress.inline"
import style from "./styles/explore-progress.scss"

const ExploreProgress: QuartzComponent = () => null
ExploreProgress.afterDOMLoaded = script
ExploreProgress.css = style

export default (() => ExploreProgress) satisfies QuartzComponentConstructor

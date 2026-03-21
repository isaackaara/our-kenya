import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/games-hub.inline"
import styles from "./styles/games.scss"

const GamesHub: QuartzComponent = () => null

GamesHub.afterDOMLoaded = script
GamesHub.css = styles

export default (() => GamesHub) satisfies QuartzComponentConstructor

import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/timeline-game.inline"
import styles from "./styles/games.scss"

const TimelineGame: QuartzComponent = () => null

TimelineGame.afterDOMLoaded = script
TimelineGame.css = styles

export default (() => TimelineGame) satisfies QuartzComponentConstructor

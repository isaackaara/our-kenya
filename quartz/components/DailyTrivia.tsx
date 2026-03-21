import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/daily-trivia.inline"
import styles from "./styles/games.scss"

const DailyTrivia: QuartzComponent = () => null

DailyTrivia.afterDOMLoaded = script
DailyTrivia.css = styles

export default (() => DailyTrivia) satisfies QuartzComponentConstructor

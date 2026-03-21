import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/stats-dashboard.inline"
import styles from "./styles/stats.scss"

const StatsDashboard: QuartzComponent = () => {
  return null
}

StatsDashboard.afterDOMLoaded = script
StatsDashboard.css = styles

export default (() => StatsDashboard) satisfies QuartzComponentConstructor

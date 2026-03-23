import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/analytics-dashboard.inline"
import style from "./styles/analytics-dashboard.scss"

const AnalyticsDashboard: QuartzComponent = () => null
AnalyticsDashboard.afterDOMLoaded = script
AnalyticsDashboard.css = style

export default (() => AnalyticsDashboard) satisfies QuartzComponentConstructor

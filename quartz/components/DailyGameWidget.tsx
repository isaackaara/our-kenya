import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/daily-game-widget.inline"

const DailyGameWidget: QuartzComponent = () => null

DailyGameWidget.afterDOMLoaded = script

export default (() => DailyGameWidget) satisfies QuartzComponentConstructor

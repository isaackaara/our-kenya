import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/daily-note.inline"

const DailyNote: QuartzComponent = () => null

DailyNote.afterDOMLoaded = script

export default (() => DailyNote) satisfies QuartzComponentConstructor

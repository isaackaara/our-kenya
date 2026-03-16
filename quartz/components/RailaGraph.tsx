import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/raila-graph.inline"

const RailaGraph: QuartzComponent = () => {
  return null
}

RailaGraph.afterDOMLoaded = script

export default (() => RailaGraph) satisfies QuartzComponentConstructor

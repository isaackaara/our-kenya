import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/knowledge-graphs.inline"

const KnowledgeGraphs: QuartzComponent = () => {
  return null
}

KnowledgeGraphs.afterDOMLoaded = script

export default (() => KnowledgeGraphs) satisfies QuartzComponentConstructor

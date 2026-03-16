import { QuartzComponent, QuartzComponentConstructor } from "./types"
import exploreTreeScript from "./scripts/explore-tree.inline"

const ExploreTree: QuartzComponent = () => {
  return <></>
}

ExploreTree.afterDOMLoaded = exploreTreeScript

export default (() => ExploreTree) satisfies QuartzComponentConstructor

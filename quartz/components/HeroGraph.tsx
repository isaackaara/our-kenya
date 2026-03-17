import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/hero-graph-component.inline"

const HeroGraph: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div
      class={displayClass}
      id="ok-hero-graph-root"
      style={{ width: "100%", margin: "2rem 0" }}
    ></div>
  )
}

HeroGraph.afterDOMLoaded = script

export default (() => HeroGraph) satisfies QuartzComponentConstructor

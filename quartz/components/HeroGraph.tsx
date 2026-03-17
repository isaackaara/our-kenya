import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/hero-graph.inline"
import style from "./styles/HeroGraph.scss"

const HeroGraph: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div
      class={displayClass}
      id="hero-graph-container"
      data-graph-url="/data/hero-graph.json"
    ></div>
  )
}

HeroGraph.afterDOMLoaded = script
HeroGraph.css = style

export default (() => HeroGraph) satisfies QuartzComponentConstructor

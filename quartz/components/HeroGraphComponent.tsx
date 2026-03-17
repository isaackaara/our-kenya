import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/hero-graph-component.inline"

const HeroGraphComponent: QuartzComponent = () => {
  return (
    <div id="ok-hero-graph-root" style={{ width: "100%", margin: "2rem 0" }}></div>
  )
}

HeroGraphComponent.afterDOMLoaded = script

export default (() => HeroGraphComponent) satisfies QuartzComponentConstructor

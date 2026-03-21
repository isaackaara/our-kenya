import { QuartzComponent, QuartzComponentConstructor } from "./types"

const navLinks = [
  { href: "/STORY-TRAILS", label: "Story Trails" },
  { href: "/games", label: "Games" },
  { href: "/contribute", label: "Add to the story" },
  { href: "/support", label: "Support Our Kenya" },
]

const SiteNav: QuartzComponent = () => {
  return (
    <nav class="ok-sitenav">
      {navLinks.map((l) => (
        <a href={l.href} class="ok-sitenav-link">
          {l.label}
        </a>
      ))}
    </nav>
  )
}

SiteNav.afterDOMLoaded = ``

export default (() => SiteNav) satisfies QuartzComponentConstructor

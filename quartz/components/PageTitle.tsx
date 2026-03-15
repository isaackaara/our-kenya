import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir} aria-label="Our Kenya - return to homepage">
        <span class="wm-our">Our</span>
        <span class="wm-kenya"> Kenya</span>
      </a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
  letter-spacing: -0.01em;
}

.page-title a {
  text-decoration: none;
  color: var(--dark);
}

.page-title a:hover {
  color: var(--kenya-green, #006B3F);
  text-decoration: none;
}

.wm-our {
  font-weight: 400;
  opacity: 0.6;
}

.wm-kenya {
  font-weight: 700;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor

import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.ExploreTree(),
    Component.FloatingContribute(),
    Component.KnowledgeGraphs(),
    Component.DailyThemeGrid(),
    Component.SurpriseMe(),
    Component.DailyNote(),
    Component.TrailScores(),
    Component.TrailMoodFilter(),
    Component.ConditionalRender({
      component: Component.ContributeForm(),
      condition: (page) => page.fileData.slug === "contribute",
    }),
    Component.ConditionalRender({
      component: Component.HeroGraph(),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.ShareButton({ 
        prominent: false, 
        label: "Share Our Kenya" 
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.ShareButton({ 
        prominent: false, 
        label: "Share this note" 
      }),
      condition: (page) => {
        const slug = page.fileData.slug || ""
        // Show on individual content notes, exclude folder indexes, tags, homepage, and STORY-TRAILS
        return !slug.startsWith("tags/") && slug !== "index" && slug !== "404" && slug !== "STORY-TRAILS"
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      "Story Trails": "/STORY-TRAILS",
      "Help write the rest": "/contribute",
      Support: "/support",
      "Built by Kaara.Works": "https://kaara.works",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.TrailNav(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
    Component.ConditionalRender({
      component: Component.TrailHub(),
      condition: (page) => page.fileData.slug === "STORY-TRAILS",
    }),
    Component.ConditionalRender({
      component: Component.ShareButton({ 
        prominent: true, 
        label: "Share these trails" 
      }),
      condition: (page) => page.fileData.slug === "STORY-TRAILS",
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.PagefindSearch(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.SiteNav(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    Component.TrailNav({ position: "bottom" }),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.PagefindSearch(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
  ],
  right: [],
}

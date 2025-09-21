import siteMetadata from "@/config/site-metadata.json"

export type SiteMetadata = typeof siteMetadata

export function getSiteMetadata(): SiteMetadata {
  return siteMetadata
}

export function getPageMetadata(pageKey: keyof SiteMetadata["pages"]) {
  return siteMetadata.pages[pageKey]
}

export function getNavigationData() {
  return siteMetadata.navigation
}

export function getComponentText(component: keyof SiteMetadata["components"]) {
  return siteMetadata.components[component]
}

export function getSiteInfo() {
  return siteMetadata.site
}

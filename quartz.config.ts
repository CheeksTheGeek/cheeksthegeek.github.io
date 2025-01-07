import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Chaitanya's Blog",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "chait.me",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    generateSocialImages: false,
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#EFE0EF", // Foreground
          lightgray: "#e5e0fF", // Bright Blue
          gray: "#A66CAF", // Bright Cyan
          darkgray: "#6272A4", // Bright Green
          dark: "#BF4FBF", // Bright Black
          secondary: "#E0787C", // Bright Purple
          tertiary: "#FF555588", // Bright Yellow
          highlight: "rgba(189, 147, 249, 0.15)", // Blue Highlight with transparency
          textHighlight: "#FFB86C88", // Yellow-Orange Highlight
        },
        darkMode: {
          light: "#282A36", // Background
          lightgray: "#44475A", // Selection Background
          gray: "#6272A4", // Bright Black
          darkgray: "#F8F8F2", // Foreground
          dark: "#BFEFEF", // Bright White
          secondary: "#BD93F9", // Blue
          tertiary: "#FFB86C", // Yellow-Orange
          highlight: "rgba(255, 121, 198, 0.15)", // Purple Highlight with transparency
          textHighlight: "#FF555588", // Red Highlight
        },
      }      
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config

// quartz/plugins/transformers/tikzjax.ts
//
// Single-file Quartz plugin for TikzJax support.
//
// Usage:
// 1. Copy this file to your Quartz repo under `quartz/plugins/transformers/tikzjax.ts`.
// 2. Re-export it in `quartz/plugins/transformers/index.ts` by adding:
//       export { TikzJax } from "./tikzjax"
// 3. In your quartz.config.ts, add TikzJax() to the list of transformers:
//       import { TikzJax } from "./plugins/transformers"
//       ...
//       transformers: [ ..., TikzJax({ invertColorsInDarkMode: true }) ],
//
// That’s it! Code blocks fenced as ```tikz will be converted into
// <script type="text/tikz">...</script>, and TikzJax will render them into SVG.
//
// If you enable `invertColorsInDarkMode`, this plugin will attempt to replace
// literal “black”/”white” with “currentColor”/“var(--background-primary)”
// in the final rendered SVG once “tikzjax-load-finished” fires. 
// You can toggle that on/off by passing an option to TikzJax() below.

import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import type { PluggableList } from "unified"
import { findAndReplace } from "mdast-util-find-and-replace"

// Some users like to invert black/white colors in dark mode
// to keep text/axes visible. We'll provide a switch for that.
interface Options {
  invertColorsInDarkMode?: boolean
}

// Minimal color transform
function colorSVGinDarkMode(svg: string): string {
  // Replace black (#000 or "black") with the current text color
  // Replace white (#fff or "white") with background color
  // So in dark mode, lines remain visible.
  return svg
    .replaceAll(/("#000"|'#000'|black)/g, "currentColor")
    .replaceAll(/("#fff"|'#fff'|white)/g, "var(--background-primary)")
}

/**
 * Optional “optimizeSVG” routine. In Obsidian, the plugin used SVGO. 
 * For a minimal example here, we simply return the original SVG. 
 * If you want to integrate SVGO, you can inline or load it externally.
 */
function optimizeSVG(svg: string): string {
  // no-op or do your own minifications
  return svg
}

/**
 * Post-process function that listens for the "tikzjax-load-finished" event
 * on newly rendered <svg> elements. 
 * We'll do color inversions (if enabled) and minimal (dummy) optimization.
 */
function postProcessListener(invertColors: boolean) {
  return `
    (function() {
      function handleLoadFinished(e) {
        const svgEl = e.target;
        if (!svgEl || !svgEl.outerHTML) {
          return;
        }
        let svg = svgEl.outerHTML;
        ${invertColors ? "svg = (" + colorSVGinDarkMode.toString() + ")(svg);" : ""}
        svg = (${optimizeSVG.toString()})(svg);
        svgEl.outerHTML = svg;
      }
      document.addEventListener('tikzjax-load-finished', handleLoadFinished);
    })();
  `
}

/**
 * The main plugin function
 */
export const TikzJax: QuartzTransformerPlugin = (opts?: Options) => {
  const invertColors = opts?.invertColorsInDarkMode ?? false

  return {
    name: "TikzJax",

    // ----------------------------------------------------------------
    // Step 1: Turn ```tikz code blocks into <script type="text/tikz">.
    // ----------------------------------------------------------------
    markdownPlugins(): PluggableList {
      return [
        () => (tree) => {
          visit(tree, "code", (node: any) => {
            if (node.lang === "tikz") {
              // Optional: if your content might contain non-breaking spaces,
              // you can remove them here so TikzJax doesn't choke:
              const sanitized = (node.value as string)
                .replaceAll("&nbsp;", "")
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .join("\n")

              node.type = "html"
              node.value = `<script type="text/tikz" data-show-console="true">\n${sanitized}\n</script>`
            }
          })
        },
      ]
    },

    // ----------------------------------------------------------------
    // Step 2: Provide external resources. We'll load the TikzJax CSS
    //         for fonts, and the main TikzJax script from the CDN,
    //         plus an inline script that handles color/optimization.
    // ----------------------------------------------------------------
    externalResources() {
      return {
        css: [
          {
            // includes TikZ fonts so the math looks good
            content: "https://chait.me/static/fonts.css",
          },
        ],
        js: [
          {
            // load TikzJax from the official CDN
            src: "https://chait.me/static/tikzjax.js",
            loadTime: "afterDOMReady",
            contentType: "external",
          },
          {
            // attach our postProcess listener for color inversion & optimization
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: postProcessListener(invertColors),
          },
        ],
      }
    },
  }
}

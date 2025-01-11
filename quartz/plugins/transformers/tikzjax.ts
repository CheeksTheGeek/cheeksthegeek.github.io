import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"

/**
 * Inline (minified) TikzJax code. 
 * If you'd prefer to load from an external URL, 
 * simply replace the content below or point to a CDN 
 * in externalResources().js[0].src instead of using inline "content".
 */
const TIKZJAX_INLINE_SCRIPT = `
/* Example placeholder for a minimal TikzJax-like script.
   Replace this with the real code of tikzjax.js if desired. */
(function(){
  // Minimal placeholder: scan for <script type="text/tikz"> blocks and log them.
  document.addEventListener("DOMContentLoaded", () => {
    const scripts = document.querySelectorAll('script[type="text/tikz"]')
    scripts.forEach(script => {
      console.log("[TikzJax] Found a tikz block:", script.innerText)
      // Real TikzJax would parse the text, generate SVG, and replace script element with the SVG.
      // For now, just stub out a basic event so you can see how you'd handle post-processing.
      const fakeSvg = document.createElement("div")
      fakeSvg.innerHTML = "<p>[Placeholder for TikzJax-rendered SVG]</p>"
      fakeSvg.dispatchEvent(new CustomEvent("tikzjax-load-finished", { bubbles: true }))
      script.parentNode?.replaceChild(fakeSvg, script)
    })
  })
})();
`

export const TikzJax: QuartzTransformerPlugin = () => {
  return {
    name: "TikzJax",

    // We want to catch ```tikz code blocks in Markdown
    // and replace them with <script type="text/tikz">...</script>
    markdownPlugins() {
    interface CodeNode {
      type: string
      lang?: string
      value: string
    }

    interface HtmlNode {
      type: 'html'
      value: string
    }

    return [
      () => (tree: any): void => {
        visit(tree, "code", (node: CodeNode) => {
        if (node.lang === "tikz") {
          (node as HtmlNode).type = "html"
          node.value = `<script type="text/tikz" data-show-console="true">
${node.value}
</script>`
        }
        })
      },
    ]
    },

    // Provide the TikzJax logic as an inline script, loaded after the DOM is ready
    externalResources() {
      return {
        js: [
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: TIKZJAX_INLINE_SCRIPT,
          },
        ],
      }
    },
  }
}

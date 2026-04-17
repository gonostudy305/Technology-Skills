"use client";

import { useEffect, useRef, useMemo } from "react";
import DOMPurify from "dompurify";

/**
 * Renders trusted-but-raw HTML content safely.
 *
 * Security layers:
 *  1. DOMPurify sanitises the HTML before it's injected into the DOM,
 *     blocking XSS vectors (rogue <script>, event handlers, etc.).
 *  2. Inline scripts from the article are executed inside a sandboxed
 *     <iframe> so they cannot access the host page's cookies, DOM or JS.
 *
 * This replaces the earlier pattern of dangerouslySetInnerHTML +
 * appendChild(<script>), which was flagged as a security risk.
 */
export default function HtmlRenderer({
  html,
  scripts,
}: {
  html: string;
  scripts?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sanitise once per content change
  const sanitisedHtml = useMemo(() => {
    if (typeof window === "undefined") return html; // SSR pass-through
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ["style", "link", "iframe"],
      ADD_ATTR: [
        "target",
        "rel",
        "class",
        "id",
        "style",
        "href",
        "src",
        "allow",
        "allowfullscreen",
        "frameborder",
        "loading",
      ],
      ALLOW_DATA_ATTR: true,
      WHOLE_DOCUMENT: false,
    });
  }, [html]);

  // Execute inline scripts inside a sandboxed iframe
  useEffect(() => {
    if (!scripts || scripts.trim().length === 0) return;
    if (!containerRef.current) return;

    // Build a minimal HTML document for the iframe
    const iframeSrcDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html, body { margin: 0; padding: 0; font-family: sans-serif; }
          </style>
        </head>
        <body>
          <script>
            try {
              ${scripts}
            } catch (e) {
              console.warn("[Sandboxed script error]", e);
            }
          </script>
        </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute(
      "style",
      "display:none; width:0; height:0; border:none;",
    );
    iframe.srcdoc = iframeSrcDoc;

    containerRef.current.appendChild(iframe);
    iframeRef.current = iframe;

    return () => {
      iframe.remove();
      iframeRef.current = null;
    };
  }, [scripts]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: sanitisedHtml }}
    />
  );
}

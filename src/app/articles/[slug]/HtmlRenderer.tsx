"use client";

import { useEffect, useRef } from "react";

/**
 * Renders trusted HTML articles from the local content repository.
 *
 * Important: these content files intentionally contain inline handlers
 * and DOM scripts for simulations, so they must execute in-page.
 */
export default function HtmlRenderer({
  html,
  scripts,
}: {
  html: string;
  scripts?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Execute extracted inline scripts in page context so article simulations work.
  useEffect(() => {
    if (!scripts || scripts.trim().length === 0) return;
    if (!containerRef.current) return;

    const isModuleScript =
      /^\s*import\s.+from\s+["']/m.test(scripts) || /^\s*export\s/m.test(scripts);

    const scriptEl = document.createElement("script");
    scriptEl.type = isModuleScript ? "module" : "text/javascript";
    scriptEl.text = scripts;
    scriptEl.dataset.kbInjected = "true";

    containerRef.current.appendChild(scriptEl);

    return () => {
      scriptEl.remove();
    };
  }, [scripts, html]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />;
}

"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __kbLoadedExternalScripts?: Record<string, true>;
  }
}

function ensureExternalScriptLoaded(src: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const loadedScripts = (window.__kbLoadedExternalScripts ??= {});
  if (loadedScripts[src]) return Promise.resolve();

  const existingScript = Array.from(
    document.querySelectorAll<HTMLScriptElement>("script[src]"),
  ).find((scriptEl) => {
    const attrSrc = scriptEl.getAttribute("src") ?? "";
    return attrSrc === src || scriptEl.src === src;
  });

  if (existingScript) {
    loadedScripts[src] = true;
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const scriptEl = document.createElement("script");
    scriptEl.src = src;
    scriptEl.async = false;
    scriptEl.dataset.kbExternal = "true";
    scriptEl.onload = () => {
      loadedScripts[src] = true;
      resolve();
    };
    scriptEl.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.head.appendChild(scriptEl);
  });
}

/**
 * Renders trusted HTML articles from the local content repository.
 *
 * Important: these content files intentionally contain inline handlers
 * and DOM scripts for simulations, so they must execute in-page.
 */
export default function HtmlRenderer({
  html,
  scripts,
  externalScripts,
}: {
  html: string;
  scripts?: string;
  externalScripts?: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Load external dependencies first, then execute inline scripts in page context.
  useEffect(() => {
    if (!containerRef.current) return;
    let isCancelled = false;
    let inlineScriptEl: HTMLScriptElement | null = null;

    const runScripts = async () => {
      for (const src of externalScripts ?? []) {
        if (isCancelled) return;

        try {
          await ensureExternalScriptLoaded(src);
        } catch (error) {
          console.warn("[Article external script load error]", error);
        }
      }

      if (isCancelled) return;
      if (!scripts || scripts.trim().length === 0) return;

      const isModuleScript =
        /^\s*import\s.+from\s+["']/m.test(scripts) || /^\s*export\s/m.test(scripts);

      inlineScriptEl = document.createElement("script");
      inlineScriptEl.type = isModuleScript ? "module" : "text/javascript";
      inlineScriptEl.text = scripts;
      inlineScriptEl.dataset.kbInjected = "true";

      containerRef.current?.appendChild(inlineScriptEl);
    };

    void runScripts();

    return () => {
      isCancelled = true;
      inlineScriptEl?.remove();
    };
  }, [externalScripts, scripts, html]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />;
}

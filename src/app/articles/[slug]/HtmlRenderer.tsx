"use client";

import { useEffect, useRef } from "react";

export default function HtmlRenderer({ html, scripts }: { html: string; scripts?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scripts && scripts.trim().length > 0) {
      const scriptEl = document.createElement("script");
      scriptEl.type = "text/javascript";
      scriptEl.innerHTML = `try {\n${scripts}\n} catch (error) {\n  console.warn("Article inline script error:", error);\n}`;

      containerRef.current?.appendChild(scriptEl);

      return () => {
        scriptEl.remove();
      };
    }
  }, [scripts]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />;
}

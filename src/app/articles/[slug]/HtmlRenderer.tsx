"use client";

import { useEffect } from "react";

export default function HtmlRenderer({ html, scripts }: { html: string; scripts?: string }) {
  useEffect(() => {
    if (scripts && scripts.trim().length > 0) {
      const scriptEl = document.createElement("script");
      scriptEl.innerHTML = scripts;
      document.body.appendChild(scriptEl);

      return () => {
        document.body.removeChild(scriptEl);
      };
    }
  }, [scripts]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

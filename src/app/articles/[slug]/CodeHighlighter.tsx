"use client";

import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // A nice dark theme that matches Geist Mono nicely

export default function CodeHighlighter() {
    useEffect(() => {
        // We target all block code elements.
        const blocks = document.querySelectorAll("pre code");
        blocks.forEach((block) => {
            // Avoid re-highlighting
            if (block.classList.contains("hljs")) return;

            // Extract language and optional filename if user provided it in class like `language-js:filename.js`
            const langClass = Array.from(block.classList).find(c => c.startsWith("language-"));
            let filename = "";

            if (langClass && langClass.includes(":")) {
                const parts = langClass.split(":");
                filename = parts[1];
                block.classList.remove(langClass);
                block.classList.add(parts[0]); // keep only the language part
            }

            hljs.highlightElement(block as HTMLElement);

            // Add wrapper for custom styling
            const pre = block.parentElement;
            if (!pre) return;

            if (!pre.classList.contains("kb-code-block")) {
                pre.classList.add("kb-code-block", "relative", "group", "rounded-xl", "bg-[#0d1117]", "border", "border-zinc-800", "my-6", "overflow-hidden");

                const headerNode = document.createElement("div");
                headerNode.className = "flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-[#161b22] text-xs font-mono text-zinc-400";

                const fileSpan = document.createElement("span");
                fileSpan.textContent = filename || (langClass ? langClass.replace("language-", "").split(":")[0] : "Code");

                const copyBtn = document.createElement("button");
                copyBtn.className = "hover:text-zinc-100 transition-colors focus:outline-none";
                copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';

                copyBtn.addEventListener("click", () => {
                    navigator.clipboard.writeText(block.textContent || "");
                    copyBtn.innerHTML = '<i class="fa-solid fa-check text-green-400"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
                    }, 2000);
                });

                headerNode.appendChild(fileSpan);
                headerNode.appendChild(copyBtn);

                pre.insertBefore(headerNode, block);
                block.classList.add("!bg-transparent", "!px-4", "!py-4", "!text-sm");
            }
        });
    }, []);

    return null;
}

/**
 * Pre-build step: generate content-manifest.json
 *
 * Run this before `next build` to scan every article once and write a
 * lightweight JSON manifest. At runtime, the Home page and article pages
 * can optionally read this single file instead of re-parsing every .html/.md.
 *
 * Usage:
 *   node scripts/generate-manifest.mjs
 *
 * The output file is: .next/content-manifest.json (git-ignored).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const SKILL_DIR = path.join(ROOT, "skill");
const OUTPUT = path.join(ROOT, ".next", "content-manifest.json");

const ENABLED_SKILL_SLUGS = new Set(["seo-aeo-blog-writer"]);

function stripHtml(raw) {
    return raw
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+/g, " ")
        .trim();
}

function shortenText(raw, maxLength = 170) {
    const text = stripHtml(raw);
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trimEnd()}...`;
}

function scanDir(dir, source) {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".html") || f.endsWith(".md"))
        .map((f) => {
            const slug = f.replace(/\.(html|md)$/i, "");
            if (source === "skill" && !ENABLED_SKILL_SLUGS.has(slug)) return null;

            const filePath = path.join(dir, f);
            const content = fs.readFileSync(filePath, "utf-8");
            const stat = fs.statSync(filePath);
            const type = f.endsWith(".md") ? "md" : "html";

            let title = slug;
            let summary = "";
            let category = "";
            let author = "Minh Tuấn";

            if (type === "html") {
                const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
                const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
                const categoryMatch = content.match(
                    /<meta[^>]*name=["']category["'][^>]*content=["']([^"']+)["'][^>]*>/i,
                );
                const authorMatch = content.match(
                    /<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["'][^>]*>/i,
                );
                const descMatch = content.match(
                    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i,
                );

                if (titleMatch) title = titleMatch[1].trim();
                else if (h1Match) title = stripHtml(h1Match[1]);

                summary = descMatch ? shortenText(descMatch[1]) : "";
                if (categoryMatch) category = stripHtml(categoryMatch[1]);
                if (authorMatch) author = stripHtml(authorMatch[1]);
            } else {
                const { data, content: mdContent } = matter(content);
                if (data.title) title = data.title;
                else {
                    const m = mdContent.match(/^#\s+(.+)$/m);
                    if (m) title = m[1].trim();
                }
                summary = data.description ? shortenText(data.description) : "";
                if (data.category) category = data.category;
                if (data.author) author = data.author;
            }

            return {
                slug,
                title,
                type,
                summary: summary || undefined,
                category: category || undefined,
                author,
                source,
                updatedAt: stat.mtime.toISOString(),
            };
        })
        .filter(Boolean);
}

const manifest = [
    ...scanDir(CONTENT_DIR, "content"),
    ...scanDir(SKILL_DIR, "skill"),
];

// Ensure .next/ exists
const outDir = path.dirname(OUTPUT);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2), "utf-8");
console.log(
    `✓ Generated content-manifest.json with ${manifest.length} articles → ${OUTPUT}`,
);

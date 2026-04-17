import fs from "fs";
import path from "path";
import { cache } from "react";
import { marked } from "marked";
import matter from "gray-matter";

import {
  stripHtml,
  shortenText,
  slugifyHeading,
  withUniqueId,
  extractPrimaryHtmlContent,
  extractSummaryFromHtml,
  extractSummaryFromMarkdown,
} from "./utils";

// ---------------------------------------------------------------------------
// Directory paths
// ---------------------------------------------------------------------------

export const CONTENT_DIR = path.join(process.cwd(), "content");
export const SKILL_DIR = path.join(process.cwd(), "skill");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ArticleSource = "content" | "skill";

const ARTICLE_SOURCES: ReadonlyArray<{ name: ArticleSource; dir: string }> = [
  { name: "content", dir: CONTENT_DIR },
  { name: "skill", dir: SKILL_DIR },
];

const ENABLED_SKILL_SLUGS = new Set(["seo-aeo-blog-writer"]);

export interface ArticleInfo {
  slug: string;
  title: string;
  dateStr?: string;
  type: string;
  summary?: string;
  category?: string;
  updatedAt?: string;
  author?: string;
  viewCount?: number;
  source?: ArticleSource;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface ArticleContent {
  content: string;
  type: "md" | "html";
  scripts?: string;
  toc: TocItem[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FALLBACK_SUMMARY = "Kho tri thức công nghệ được biên soạn chuyên sâu.";

/** All valid category values that frontmatter/meta can specify. */
export const CATEGORY_VALUES = [
  "Nền tảng",
  "Sản phẩm",
  "Ứng dụng",
  "Kiến thức",
  "Kỹ năng",
] as const;

export type CategoryValue = (typeof CATEGORY_VALUES)[number];

// ---------------------------------------------------------------------------
// Tab ↔ category mapping (used by Home page)
// ---------------------------------------------------------------------------

export const TAB_CATEGORY_MAP: Record<string, CategoryValue | null> = {
  "Mới nhất": null, // show all, sorted by date
  "Môn Kỹ thuật": "Nền tảng",
  "Môn Dữ liệu": "Ứng dụng",
  "Môn Kinh doanh": "Sản phẩm",
  "Kỹ năng": "Kỹ năng",
};

export const HOME_TABS = Object.keys(TAB_CATEGORY_MAP);

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface ArticleFile {
  slug: string;
  type: "md" | "html";
  filePath: string;
  source: ArticleSource;
}

function injectHeadingIdsAndBuildToc(html: string): { html: string; toc: TocItem[] } {
  const usedIds = new Map<string, number>();
  const toc: TocItem[] = [];

  const htmlWithIds = html.replace(
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_, levelRaw: string, attrsRaw: string, innerHtml: string) => {
      const level = Number(levelRaw);
      const text = stripHtml(innerHtml);
      const existingId = attrsRaw.match(/\sid=(['"])(.*?)\1/i)?.[2];
      const uniqueId = withUniqueId(existingId ?? slugifyHeading(text), usedIds);

      if ((level === 2 || level === 3) && text) {
        toc.push({ id: uniqueId, text, level: level as 2 | 3 });
      }

      const attrsWithoutId = attrsRaw.replace(/\sid=(['"])(.*?)\1/i, "").trim();
      const attrsPrefix = attrsWithoutId ? ` ${attrsWithoutId}` : "";

      return `<h${level} id="${uniqueId}"${attrsPrefix}>${innerHtml}</h${level}>`;
    },
  );

  return { html: htmlWithIds, toc };
}

function shouldIncludeFile(source: ArticleSource, slug: string): boolean {
  if (source !== "skill") return true;
  return ENABLED_SKILL_SLUGS.has(slug);
}

function listArticleFiles(): ArticleFile[] {
  const bySlug = new Map<string, ArticleFile>();

  for (const source of ARTICLE_SOURCES) {
    if (!fs.existsSync(source.dir)) continue;

    const files = fs
      .readdirSync(source.dir)
      .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".html"));

    for (const fileName of files) {
      const slug = fileName.replace(/\.(html|md)$/i, "");
      if (!shouldIncludeFile(source.name, slug)) continue;
      if (bySlug.has(slug)) continue;

      bySlug.set(slug, {
        slug,
        type: fileName.endsWith(".md") ? "md" : "html",
        filePath: path.join(source.dir, fileName),
        source: source.name,
      });
    }
  }

  return Array.from(bySlug.values());
}

function resolveArticleFileBySlug(slug: string): ArticleFile | null {
  for (const source of ARTICLE_SOURCES) {
    if (!shouldIncludeFile(source.name, slug)) continue;

    const mdPath = path.join(source.dir, `${slug}.md`);
    if (fs.existsSync(mdPath)) {
      return { slug, type: "md", filePath: mdPath, source: source.name };
    }

    const htmlPath = path.join(source.dir, `${slug}.html`);
    if (fs.existsSync(htmlPath)) {
      return { slug, type: "html", filePath: htmlPath, source: source.name };
    }
  }

  return null;
}

/**
 * Fallback category inference.
 *
 * Kept only for backward-compat with content files that haven't been updated
 * yet. Prefer explicit `<meta name="category" content="...">` or
 * `category:` in frontmatter.
 */
function inferCategory(slug: string, title: string, type: string, source: ArticleSource): CategoryValue {
  if (source === "skill") return "Kỹ năng";

  const probe = `${slug} ${title}`.toLowerCase();

  if (/(data|warehouse|etl|bi|analytics|database)/.test(probe)) return "Nền tảng";
  if (/(ui|ux|design|product)/.test(probe)) return "Sản phẩm";
  if (/(deep|learning|ai|model|llm|prompt)/.test(probe)) return "Ứng dụng";
  if (/(network|internet|router|switch|gateway|firewall|device)/.test(probe)) return "Kiến thức";

  return type === "md" ? "Sản phẩm" : "Nền tảng";
}

function pseudoViewCount(slug: string): number {
  let hash = 0;
  for (const char of slug) {
    hash = (hash * 31 + char.charCodeAt(0)) % 10000;
  }
  return 150 + (hash % 4000);
}

// ---------------------------------------------------------------------------
// Public API – wrapped with React.cache() for request deduplication
// ---------------------------------------------------------------------------

async function _getArticlesList(): Promise<ArticleInfo[]> {
  try {
    const manifestPath = path.join(process.cwd(), ".next", "content-manifest.json");
    if (fs.existsSync(manifestPath)) {
      const manifestData = fs.readFileSync(manifestPath, "utf-8");
      const parsedManifest = JSON.parse(manifestData) as unknown;
      const manifest = Array.isArray(parsedManifest)
        ? (parsedManifest as Array<Record<string, unknown>>)
        : [];

      return manifest
        .filter(
          (item): item is Record<string, string> =>
            typeof item.slug === "string" &&
            typeof item.title === "string" &&
            typeof item.type === "string",
        )
        .map((item) => {
          const updatedAt = typeof item.updatedAt === "string" ? item.updatedAt : undefined;
          const summary = typeof item.summary === "string" ? item.summary : FALLBACK_SUMMARY;
          const category =
            typeof item.category === "string"
              ? item.category
              : inferCategory(item.slug, item.title, item.type, "content");
          const author = typeof item.author === "string" ? item.author : "Minh Tuấn";

          return {
            slug: item.slug,
            title: item.title,
            type: item.type,
            updatedAt,
            dateStr: updatedAt,
            summary,
            category,
            author,
            source: "content" as const,
            viewCount: pseudoViewCount(item.slug),
          };
        });
    }

    const files = listArticleFiles();
    if (files.length === 0) return [];

    return files.map((file) => {
      const { type, slug, filePath, source } = file;
      const content = fs.readFileSync(filePath, "utf-8");
      const fileStat = fs.statSync(filePath);
      const updatedAt = fileStat.mtime.toISOString();

      let title = slug;
      let summary = FALLBACK_SUMMARY;
      let category: string | undefined;
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

        if (titleMatch) title = titleMatch[1].trim();
        else if (h1Match) title = h1Match[1].replace(/<[^>]*>?/gm, "").trim();
        else title = slug.replace(/_/g, " ").replace(/-/g, " ");

        summary = extractSummaryFromHtml(extractPrimaryHtmlContent(content));
        if (categoryMatch) category = stripHtml(categoryMatch[1]);
        if (authorMatch) author = stripHtml(authorMatch[1]);
      } else {
        const { data, content: mdContent } = matter(content);
        if (typeof data.title === "string" && data.title.trim().length > 0) {
          title = data.title.trim();
        } else {
          const match = mdContent.match(/^#\s+(.+)$/m);
          if (match) title = match[1].trim();
          else if (typeof data.name === "string" && data.name.trim().length > 0) title = data.name.trim();
        }

        summary =
          typeof data.description === "string" && data.description.trim().length > 0
            ? shortenText(data.description)
            : extractSummaryFromMarkdown(mdContent);

        if (typeof data.category === "string") {
          category = stripHtml(data.category);
        }

        if (typeof data.author === "string" && data.author.trim().length > 0) {
          author = stripHtml(data.author);
        }
      }

      category = category ?? inferCategory(slug, title, type, source);

      return {
        slug,
        title,
        type,
        summary,
        category,
        updatedAt,
        dateStr: updatedAt,
        author,
        viewCount: pseudoViewCount(slug),
        source,
      };
    });
  } catch (error) {
    console.error("Error fetching list:", error);
    return [];
  }
}

async function _getArticleBySlug(slug: string): Promise<ArticleContent | null> {
  try {
    const articleFile = resolveArticleFileBySlug(slug);
    if (!articleFile) return null;

    if (articleFile.type === "md") {
      const rawContent = fs.readFileSync(articleFile.filePath, "utf-8");
      const { content } = matter(rawContent);
      const parsedHTML = await marked.parse(content);
      const mdResult = injectHeadingIdsAndBuildToc(parsedHTML);

      return { content: mdResult.html, type: "md", toc: mdResult.toc };
    }

    if (articleFile.type === "html") {
      const rawHTML = fs.readFileSync(articleFile.filePath, "utf-8");

      // Extract links
      const linksSet = new Set<string>();
      const linkRegex = /<link[^>]+(?:href="[^"]*")[^>]*>/gi;
      let match;
      while ((match = linkRegex.exec(rawHTML)) !== null) {
        linksSet.add(match[0]);
      }
      const links = Array.from(linksSet).join("\n");

      // Extract styles inside head
      const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
      const stylesList: string[] = [];
      let styleMatch;
      while ((styleMatch = styleRegex.exec(rawHTML)) !== null) {
        stylesList.push(styleMatch[0]);
      }
      const styles = stylesList.join("\n");

      // Safely extract inline scripts (drop external tailwind CDN)
      const scriptRegex =
        /<script(?![^>]*src="https:\/\/cdn\.tailwindcss\.com")[^>]*>([\s\S]*?)<\/script>/gi;
      const scriptsList: string[] = [];
      let scriptMatch;
      while ((scriptMatch = scriptRegex.exec(rawHTML)) !== null) {
        if (scriptMatch[1].trim()) {
          scriptsList.push(scriptMatch[1]);
        }
      }
      const scripts = scriptsList.join("\n");

      // Keep only the primary article area
      let bodyContent = extractPrimaryHtmlContent(rawHTML);

      // Clear out scripts from html
      bodyContent = bodyContent.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        "",
      );

      const htmlResult = injectHeadingIdsAndBuildToc(bodyContent);

      const finalHTML = `
        ${links}
        ${styles}
        <div class="canvas-html-wrapper canvas-html-article">
          ${htmlResult.html}
        </div>
      `;

      return { content: finalHTML, type: "html", scripts, toc: htmlResult.toc };
    }

    return null;
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

/**
 * React.cache() de-duplicates calls within the same server-request,
 * so multiple components calling `getArticlesList()` only hit the
 * filesystem once per render cycle.
 */
export const getArticlesList = cache(_getArticlesList);
export const getArticleBySlug = cache(_getArticleBySlug);

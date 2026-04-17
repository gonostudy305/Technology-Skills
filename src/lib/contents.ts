import fs from "fs";
import path from "path";
import { marked } from "marked";
import matter from "gray-matter";

// Define the content directory path
export const CONTENT_DIR = path.join(process.cwd(), "content");
export const SKILL_DIR = path.join(process.cwd(), "skill");

type ArticleSource = "content" | "skill";

const ARTICLE_SOURCES: ReadonlyArray<{ name: ArticleSource; dir: string }> = [
  { name: "content", dir: CONTENT_DIR },
  { name: "skill", dir: SKILL_DIR },
];

// Keep article discovery in skill/ explicit to avoid pulling unrelated internal docs.
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

const FALLBACK_SUMMARY = "Kho tri thức công nghệ được biên soạn chuyên sâu.";

interface ArticleFile {
  slug: string;
  type: "md" | "html";
  filePath: string;
  source: ArticleSource;
}

function normalizeText(raw: string): string {
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

function shortenText(raw: string, maxLength = 170): string {
  const text = normalizeText(raw);
  if (!text) return FALLBACK_SUMMARY;
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function slugifyHeading(text: string): string {
  const slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
}

function withUniqueId(baseId: string, usedIds: Map<string, number>): string {
  const key = baseId || "section";
  const count = usedIds.get(key) ?? 0;
  usedIds.set(key, count + 1);
  return count === 0 ? key : `${key}-${count + 1}`;
}

function injectHeadingIdsAndBuildToc(html: string): { html: string; toc: TocItem[] } {
  const usedIds = new Map<string, number>();
  const toc: TocItem[] = [];

  const htmlWithIds = html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_, levelRaw: string, attrsRaw: string, innerHtml: string) => {
    const level = Number(levelRaw);
    const text = normalizeText(innerHtml);
    const existingId = attrsRaw.match(/\sid=(["'])(.*?)\1/i)?.[2];
    const uniqueId = withUniqueId(existingId ?? slugifyHeading(text), usedIds);

    if ((level === 2 || level === 3) && text) {
      toc.push({ id: uniqueId, text, level: level as 2 | 3 });
    }

    const attrsWithoutId = attrsRaw.replace(/\sid=(["'])(.*?)\1/i, "").trim();
    const attrsPrefix = attrsWithoutId ? ` ${attrsWithoutId}` : "";

    return `<h${level} id="${uniqueId}"${attrsPrefix}>${innerHtml}</h${level}>`;
  });

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

    const files = fs.readdirSync(source.dir).filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".html"));

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

function extractPrimaryHtmlContent(rawHtml: string): string {
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : rawHtml;

  const mainMatch = bodyContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let content = mainMatch ? mainMatch[1] : bodyContent;

  content = content.replace(/<header[\s\S]*?<\/header>/gi, "");
  content = content.replace(/<aside[\s\S]*?<\/aside>/gi, "");

  return content;
}

function extractSummaryFromHtml(rawHtml: string): string {
  const metaDescription = rawHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1];
  if (metaDescription) return shortenText(metaDescription);

  const firstParagraph = rawHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1];
  if (firstParagraph) return shortenText(firstParagraph);

  const bodyContent = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? rawHtml;
  return shortenText(bodyContent);
}

function extractSummaryFromMarkdown(mdContent: string): string {
  const paragraphs = mdContent
    .split(/\n{2,}/)
    .map((section) =>
      section
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`]*`/g, " ")
        .replace(/^#+\s+/gm, "")
        .replace(/^>\s?/gm, "")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[\*_~]/g, " "),
    )
    .map((section) => normalizeText(section))
    .filter((section) => section.length > 20);

  return shortenText(paragraphs[0] ?? "");
}

function inferCategory(slug: string, title: string, type: string, source: ArticleSource): string {
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

export async function getArticlesList(): Promise<ArticleInfo[]> {
  try {
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
        const categoryMatch = content.match(/<meta[^>]*name=["']category["'][^>]*content=["']([^"']+)["'][^>]*>/i);
        const authorMatch = content.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["'][^>]*>/i);
        
        if (titleMatch) title = titleMatch[1].trim();
        else if (h1Match) title = h1Match[1].replace(/<[^>]*>?/gm, "").trim(); 
        else title = slug.replace(/_/g, " ").replace(/-/g, " ");

        summary = extractSummaryFromHtml(extractPrimaryHtmlContent(content));
        if (categoryMatch) category = normalizeText(categoryMatch[1]);
        if (authorMatch) author = normalizeText(authorMatch[1]);
      } else {
        const { data, content: mdContent } = matter(content);
        if (typeof data.title === "string" && data.title.trim().length > 0) {
          title = data.title.trim();
        } else {
          const match = mdContent.match(/^#\s+(.+)$/m);
          if (match) title = match[1].trim();
          else if (typeof data.name === "string" && data.name.trim().length > 0) title = data.name.trim();
        }

        summary = typeof data.description === "string" && data.description.trim().length > 0
          ? shortenText(data.description)
          : extractSummaryFromMarkdown(mdContent);

        if (typeof data.category === "string") {
          category = normalizeText(data.category);
        }

        if (typeof data.author === "string" && data.author.trim().length > 0) {
          author = normalizeText(data.author);
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

export async function getArticleBySlug(slug: string): Promise<ArticleContent | null> {
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
      const stylesList = [];
      let styleMatch;
      while ((styleMatch = styleRegex.exec(rawHTML)) !== null) {
        stylesList.push(styleMatch[0]);
      }
      const styles = stylesList.join("\n");

      // Safely extract inline scripts to execute manually (drop external tailwind CDN which we dont need since app router gives us TW)
      const scriptRegex = /<script(?![^>]*src="https:\/\/cdn\.tailwindcss\.com")[^>]*>([\s\S]*?)<\/script>/gi;
      const scriptsList = [];
      let scriptMatch;
      while ((scriptMatch = scriptRegex.exec(rawHTML)) !== null) {
        if (scriptMatch[1].trim()) {
            scriptsList.push(scriptMatch[1]);
        }
      }
      const scripts = scriptsList.join("\n");

      // Keep only the primary article area to avoid nested layout conflicts.
      let bodyContent = extractPrimaryHtmlContent(rawHTML);
      
      // Clear out scripts from html since NextJS dangerouslySetInnerHTML wont run them anyway
      bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

      const htmlResult = injectHeadingIdsAndBuildToc(bodyContent);

      // Return combined safe HTML
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


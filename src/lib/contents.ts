import fs from "fs";
import path from "path";
import { marked } from "marked";
import matter from "gray-matter";

// Define the content directory path
export const CONTENT_DIR = path.join(process.cwd(), "content");

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
}

const FALLBACK_SUMMARY = "Kho tri thức công nghệ được biên soạn chuyên sâu.";

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

function inferCategory(slug: string, title: string, type: string): string {
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
    if (!fs.existsSync(CONTENT_DIR)) return [];
    
    const files = fs.readdirSync(CONTENT_DIR);
    const validFiles = files.filter(file => file.endsWith(".html") || file.endsWith(".md"));
    
    return validFiles.map(filename => {
      const type = filename.endsWith(".md") ? "md" : "html";
      const slug = filename.replace(/\.(html|md)$/, "");
      const filePath = path.join(CONTENT_DIR, filename);
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

        summary = extractSummaryFromHtml(content);
        if (categoryMatch) category = normalizeText(categoryMatch[1]);
        if (authorMatch) author = normalizeText(authorMatch[1]);
      } else {
        const { data, content: mdContent } = matter(content);
        if (data.name) title = data.name;
        else if (data.title) title = data.title;
        else {
          const match = mdContent.match(/^#\s+(.+)$/m);
          if (match) title = match[1].trim();
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

      category = category ?? inferCategory(slug, title, type);
      
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
      };
    });
  } catch (error) {
    console.error("Error fetching list:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<{content: string, type: string, scripts?: string} | null> {
  try {
    let filePath = path.join(CONTENT_DIR, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      const rawContent = fs.readFileSync(filePath, "utf-8");
      const { content } = matter(rawContent);
      const parsedHTML = await marked.parse(content);
      return { content: parsedHTML, type: "md" };
    }
    
    filePath = path.join(CONTENT_DIR, `${slug}.html`);
    if (fs.existsSync(filePath)) {
      const rawHTML = fs.readFileSync(filePath, "utf-8");
      
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

      // Extract body
      const bodyMatch = rawHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      let bodyContent = bodyMatch ? bodyMatch[1] : rawHTML;
      
      // Clear out scripts from html since NextJS dangerouslySetInnerHTML wont run them anyway
      bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

      // Return combined safe HTML
      const finalHTML = `
        ${links}
        ${styles}
        <div class="canvas-html-wrapper">
          ${bodyContent}
        </div>
      `;

      return { content: finalHTML, type: "html", scripts };
    }
    
    return null;
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}


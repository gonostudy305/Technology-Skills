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
}

export async function getArticlesList(): Promise<ArticleInfo[]> {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return [];
    }
    
    const files = fs.readdirSync(CONTENT_DIR);
    const validFiles = files.filter(file => file.endsWith(".html") || file.endsWith(".md"));
    
    return validFiles.map(filename => {
      const type = filename.endsWith(".md") ? "md" : "html";
      const slug = filename.replace(/\.(html|md)$/, "");
      const filePath = path.join(CONTENT_DIR, filename);
      const content = fs.readFileSync(filePath, "utf-8");
      
      let title = slug;
      if (type === "html") {
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) title = titleMatch[1].trim();
      } else {
        const { data, content: mdContent } = matter(content);
        if (data.name) title = data.name;
        else if (data.title) title = data.title;
        else {
          const match = mdContent.match(/^#\s+(.+)$/m);
          if (match) title = match[1].trim();
        }
      }
      
      return {
        slug,
        title,
        type
      };
    });
  } catch (error) {
    console.error("Error fetching articles list:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<{content: string, type: string} | null> {
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
      return { content: fs.readFileSync(filePath, "utf-8"), type: "html" };
    }
    
    return null;
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

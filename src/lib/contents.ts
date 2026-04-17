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
    if (!fs.existsSync(CONTENT_DIR)) return [];
    
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
        const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        
        if (titleMatch) title = titleMatch[1].trim();
        else if (h1Match) title = h1Match[1].replace(/<[^>]*>?/gm, "").trim(); 
        else title = slug.replace(/_/g, " ").replace(/-/g, " ");
      } else {
        const { data, content: mdContent } = matter(content);
        if (data.name) title = data.name;
        else if (data.title) title = data.title;
        else {
          const match = mdContent.match(/^#\s+(.+)$/m);
          if (match) title = match[1].trim();
        }
      }
      
      return { slug, title, type };
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


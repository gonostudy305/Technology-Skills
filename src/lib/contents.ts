import fs from 'fs';
import path from 'path';

// Define the content directory path
export const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface ArticleInfo {
  slug: string;
  title: string;
  dateStr?: string;
}

/**
 * Retrieves a list of all available HTML files in the content directory.
 */
export async function getArticlesList(): Promise<ArticleInfo[]> {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return [];
    }
    
    const files = fs.readdirSync(CONTENT_DIR);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    return htmlFiles.map(filename => {
      const slug = filename.replace(/\.html$/, '');
      const filePath = path.join(CONTENT_DIR, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Simple regex to extract <title>...</title> tag from the HTML file
      // If none found, fallback to slug
      const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : slug;
      
      return {
        slug,
        title,
      };
    });
  } catch (error) {
    console.error('Error fetching articles list:', error);
    return [];
  }
}

/**
 * Reads a specific HTML article by its slug.
 */
export async function getArticleBySlug(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.html`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

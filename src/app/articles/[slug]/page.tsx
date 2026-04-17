import { notFound } from "next/navigation";
import { getArticleBySlug, getArticlesList } from "@/lib/contents";
import Link from "next/link";
import HtmlRenderer from "./HtmlRenderer";

export async function generateStaticParams() {
  const articles = await getArticlesList();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-zinc-500 hover:text-zinc-900 flex items-center gap-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:underline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Quay lại danh mục
          </Link>
          <div className="font-mono text-xs font-semibold tracking-wider text-zinc-400 bg-zinc-100 px-2 py-1 rounded">
            {params.slug}.{article.type}
          </div>
        </div>
      </nav>

      {/* Reading Content Area */}
      <main className="flex-1 w-full bg-white pb-24 shadow-sm border-x border-zinc-100 max-w-4xl mx-auto">
        <article>
          {article.type === "md" ? (
            <div className="px-6 py-12 sm:px-12 sm:py-20 max-w-[700px] mx-auto prose prose-academic w-full">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />     
            </div>
          ) : (
            <div className="w-full">
               <HtmlRenderer html={article.content} scripts={article.scripts} />
            </div>
          )}
        </article>
      </main>

      <footer className="w-full max-w-4xl mx-auto py-10 px-4 text-center">      
        <p className="text-xs text-zinc-400 font-mono">End of document. Knowledge is power.</p>
      </footer>
    </div>
  );
}

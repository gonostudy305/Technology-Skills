import { notFound } from "next/navigation";
import { getArticleBySlug, getArticlesList } from "@/lib/contents";
import Link from "next/link";

export async function generateStaticParams() {
  const articles = await getArticlesList();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const content = await getArticleBySlug(params.slug);

  if (!content) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b border-slate-200 py-4 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm relative">
        <Link href="/" className="text-blue-500 hover:text-blue-700 flex items-center gap-2 font-medium transition-colors bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm hover:shadow border border-slate-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Quay lại danh sách
        </Link>
        <span className="text-slate-400 font-mono text-sm hidden md:inline-flex px-3 py-1 bg-slate-100 rounded-lg">{params.slug}.html</span>
      </div>
      
      {/* We render the raw HTML directly */}
      <div 
        className="w-full"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </main>
  );
}

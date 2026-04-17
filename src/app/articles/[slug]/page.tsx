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
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-4 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm relative">
        <Link href="/" className="text-blue-500 hover:text-blue-700 flex items-center gap-2 font-medium transition-colors bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm hover:shadow border border-slate-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Quay lại trang chủ
        </Link>
        <span className="text-slate-400 font-mono text-sm hidden md:inline-flex px-3 py-1 bg-slate-100 rounded-lg">
          {params.slug}.{article.type}
        </span>
      </div>
      
      <div className={`w-full ${article.type === "md" ? "max-w-4xl mx-auto p-8 prose prose-slate prose-img:rounded-xl prose-a:text-blue-600 bg-white shadow-sm mt-8 mb-8 rounded-xl" : ""}`}
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />
    </main>
  );
}

import Link from "next/link";
import { getArticlesList } from "@/lib/contents";

export default async function Home() {
  const articles = await getArticlesList();
  const sortedArticles = articles.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="min-h-screen bg-[#F8F9FA] px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="border-b border-zinc-200 pb-10">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-4 transition-all">
            Tech Directory
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">
            Kho lưu trữ tài nguyên chuyên sâu. Đồng bộ trực tiếp từ các file HTML và Markdown qua Github Repo.
          </p>
        </header>

        {/* Content Directory */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-zinc-400">
              Nội dung ({articles.length} bài)
            </h2>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20 px-6 border border-dashed border-zinc-200 bg-white rounded-2xl shadow-sm">
              <p className="text-zinc-500 font-medium">Chưa có bài viết nào học thuật ở đây.</p>
              <p className="text-sm text-zinc-400 mt-2">Kéo file .md hoặc .html vào thư mục content/</p>
            </div>
          ) : (
            <ul className="grid gap-4">
              {sortedArticles.map((article) => (
                <li key={article.slug} className="group relative">
                  {/* Clean, minimalist card style */}
                  <Link prefetch href={`/articles/${article.slug}`} className="block p-6 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all duration-300 bg-white/50 hover:bg-white overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-zinc-800 group-hover:text-indigo-700 transition-colors">
                        {article.title}
                      </h3>
                      
                      <span className="shrink-0 flex items-center justify-center font-mono text-[10px] tracking-wider uppercase px-2 py-1 bg-zinc-100 text-zinc-500 rounded border border-zinc-200">
                        .{article.type}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center text-sm text-zinc-400 gap-2">
                      <span className="font-mono opacity-80 shrink-0 truncate max-w-full">
                        {article.slug}
                      </span>
                    </div>
                    
                    {/* Interaction Indicator */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-indigo-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </main>
  );
}

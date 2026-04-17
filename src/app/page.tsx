import Link from "next/link";
import { getArticlesList } from "@/lib/contents";

export default async function Home() {
  const articles = await getArticlesList();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8 border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          📚 Knowledge Base
          <span className="text-blue-500 font-light text-xl mt-1">(File-based)</span>
        </h1>
        
        <p className="text-slate-500 mb-8 border-b pb-6">
          Kéo thả các file HTML xuất ra từ Gemini vào thư mục <code className="bg-slate-100 px-2 py-1 rounded text-sm text-pink-600">content/</code> (nằm ngay mục gốc của source code) để trang web tự động cập nhật danh sách!
        </p>

        {articles.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p>Chưa có bài viết nào! Hãy thêm file <code className="text-black text-sm">.html</code> vào thư mục <code className="text-black text-sm">content/</code></p>
          </div>
        ) : (
          <ul className="grid gap-4 mt-6">
            {articles.map((article) => (
              <li key={article.slug} className="group">
                <Link prefetch href={`/articles/${article.slug}`} className="block p-5 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-slate-50 hover:bg-white relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                  <h2 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-sm text-slate-400 mt-2 font-mono">
                    /{article.slug}.html
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

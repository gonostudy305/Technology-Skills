import Link from "next/link";
import { getArticlesList } from "@/lib/contents";
import { formatDateVi } from "@/lib/utils";
import {
  buildSubjectDirectory,
  getCanonicalArticlePath,
  getSubjectStatusMeta,
} from "@/lib/subjects";

// ---------------------------------------------------------------------------
// ISR – rebuild Home at most once every 60 seconds
// ---------------------------------------------------------------------------
export const revalidate = 60;

// ---------------------------------------------------------------------------
// Gradients & helpers
// ---------------------------------------------------------------------------

function getTypeLabel(type: string): string {
  return type === "md" ? "Markdown" : "HTML";
}

function getArticleHref(slug: string): string {
  return getCanonicalArticlePath(slug) ?? `/articles/${slug}`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function Home() {
  const articles = await getArticlesList();
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    if (dateA !== dateB) return dateB - dateA;
    return a.title.localeCompare(b.title, "vi");
  });

  const subjectDirectory = buildSubjectDirectory(sortedArticles);
  const featuredSubjects = subjectDirectory.slice(0, 8);

  const listArticles = sortedArticles;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pb-20 pt-6">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        {listArticles.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              HTTT UEL Hub
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-[var(--color-text-secondary)]">
              Đang chuẩn bị lộ trình học tập và tài nguyên mô phỏng. Hãy quay lại sau!
            </p>
          </section>
        ) : (
          <div className="flex flex-col gap-12">
            {/* Hero Bento Section */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-[var(--color-surface)] p-8 shadow-xl shadow-sky-900/5 lg:p-12 xl:p-16 border border-[var(--color-border)]">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:gap-16">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-700 border border-sky-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                    Kỷ nguyên tri thức mới
                  </div>
                  <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-5xl xl:text-7xl">
                    Lộ trình <span className="text-[var(--color-accent)]">Hệ thống</span> cho sinh viên UEL.
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
                    Không chỉ là bài viết, chúng tôi xây dựng các thực thể tri thức tương tác giúp bạn làm chủ Hệ thống Thông tin Quản lý.
                  </p>

                  <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <Link
                      href="/curriculum"
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--color-accent)] px-8 text-sm font-bold text-white transition hover:brightness-110 active:scale-95 shadow-lg shadow-sky-500/25"
                    >
                      Bắt đầu lộ trình
                    </Link>
                    <form action="/curriculum" className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-1 pl-4 focus-within:border-[var(--color-accent)] focus-within:ring-4 focus-within:ring-sky-100 transition-all">
                      <i className="fa-solid fa-magnifying-glass text-zinc-400 text-sm" />
                      <input
                        name="q"
                        placeholder="Tìm học phần..."
                        className="h-10 w-full bg-transparent text-sm text-[var(--color-text-primary)] outline-none"
                      />
                    </form>
                  </div>
                </div>

                {/* Right side teaser - Bento style */}
                <div className="mt-12 grid grid-cols-2 gap-4 lg:mt-0 lg:w-[400px]">
                  <div className="rounded-2xl bg-orange-50 p-6 border border-orange-100 flex flex-col justify-between h-40 group hover:bg-orange-100 transition-colors">
                    <i className="fa-solid fa-cube text-orange-500 text-xl group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-orange-700 uppercase">Simulations</span>
                  </div>
                  <div className="rounded-2xl bg-sky-50 p-6 border border-sky-100 flex flex-col justify-between h-40 group hover:bg-sky-100 transition-colors">
                    <i className="fa-solid fa-book-open text-sky-500 text-xl group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-sky-700 uppercase">Articles</span>
                  </div>
                  <div className="col-span-2 rounded-2xl bg-zinc-900 p-6 flex items-center justify-between group hover:bg-black transition-colors">
                    <div className="text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Resource Count</p>
                      <p className="mt-1 text-2xl font-bold">+{articles.length} Units</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-700 transition-colors">
                      <i className="fa-solid fa-arrow-right" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Absolutes */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-sky-500/5 to-transparent pointer-events-none" />
            </section>

            {/* Featured Subjects / Bento Grid */}
            <section>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                    Bản đồ học phần
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)] font-medium">Chọn môn học để xem tài nguyên tương ứng</p>
                </div>
                <Link
                  href="/curriculum"
                  className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--color-accent)]"
                >
                  Xem toàn bộ
                  <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredSubjects.map((subject) => {
                  const statusMeta = getSubjectStatusMeta(subject.status);

                  return (
                    <Link
                      key={subject.slug}
                      href={`/curriculum/${subject.slug}`}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-lg hover:shadow-sky-500/5"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Năm {subject.year}</span>
                          <span className={`h-2 w-2 rounded-full ${statusMeta.tone === 'teal' ? 'bg-teal-400' : statusMeta.tone === 'amber' ? 'bg-amber-400' : 'bg-zinc-300'}`} />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-[var(--color-text-primary)] transition group-hover:text-[var(--color-accent)]">
                          {subject.name}
                        </h3>
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-zinc-50 pt-4">
                        <span className="text-xs font-semibold text-zinc-500">{subject.resourceCount} tài nguyên</span>
                        <i className="fa-solid fa-chevron-right text-[10px] text-zinc-300 transition-colors group-hover:text-[var(--color-accent)]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Latest Articles */}
            <section id="latest-articles">
              <div className="mb-8 flex items-end justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                  Mới cập nhật
                </h2>
                <span className="h-0.5 flex-1 mx-8 bg-zinc-100 hidden md:block" />
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Feed kiến thức</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {listArticles.slice(0, 4).map((article) => (
                  <Link
                    key={article.slug}
                    href={getArticleHref(article.slug)}
                    className="group flex flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:shadow-xl hover:shadow-sky-900/5 hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                          {article.category}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-zinc-200" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                          {getTypeLabel(article.type)}
                        </span>
                      </div>
                      <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-tight text-[var(--color-text-primary)] transition group-hover:text-[var(--color-accent)]">
                        {article.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {article.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-50 px-6 py-4 bg-zinc-50/50 rounded-b-3xl">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{article.author}</span>
                      <span className="text-[10px] font-medium text-zinc-400">{formatDateVi(article.updatedAt, "Gần đây")}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

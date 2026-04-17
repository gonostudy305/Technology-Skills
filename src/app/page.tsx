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

const TONE_CLASS_MAP = {
  teal: "border-teal-200 bg-teal-50 text-teal-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
} as const;

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
    <main className="min-h-screen bg-[#f3f4f6] px-3 pb-14 pt-6 sm:px-5 lg:px-0">
      <div className="mx-auto w-full max-w-[1180px]">
        {sortedArticles.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center shadow-sm">
            <h1 className="text-3xl font-semibold text-zinc-900">
              HTTT UEL Resources
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-zinc-500">
              Đang chuẩn bị nội dung và simulation tương tác cho sinh viên
              HTTT. Hãy quay lại sau!
            </p>
          </section>
        ) : (
          <>
            <section className="mb-8 mt-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                Module-first Homepage
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Bạn đang học môn nào ở HTTT UEL?
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-600">
                Tìm học phần trước, đọc nội dung sau. Chọn đúng môn để vào ngay
                bài viết hoặc simulation phù hợp cho việc học và ôn thi.
              </p>

              <form action="/hoc-phan" className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  name="q"
                  placeholder="Ví dụ: Cơ sở dữ liệu, Kỹ thuật lập trình, Phân tích dữ liệu..."
                  className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-teal-100"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Tìm học phần
                </button>
              </form>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {featuredSubjects.map((subject) => {
                  const statusMeta = getSubjectStatusMeta(subject.status);

                  return (
                    <Link
                      key={subject.slug}
                      href={`/hoc-phan/${subject.slug}`}
                      className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                          Năm {subject.year}
                        </span>
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TONE_CLASS_MAP[statusMeta.tone]}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <h2 className="mt-2 text-base font-semibold leading-tight text-zinc-900 transition group-hover:text-[var(--color-accent)]">
                        {subject.name}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-600">
                        {subject.resourceCount} tài nguyên khả dụng
                      </p>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link
                  href="/hoc-phan"
                  className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
                >
                  Xem toàn bộ map học phần
                </Link>
                <Link
                  href="#latest-articles"
                  className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
                >
                  Xem feed bài viết phía dưới
                </Link>
              </div>
            </section>

            <section className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                  Mới cập nhật
                </h2>
                <Link
                  href="/hoc-phan"
                  className="text-sm font-medium text-[var(--color-accent)] hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {listArticles.slice(0, 4).map((article) => (
                  <Link
                    key={article.slug}
                    prefetch
                    href={getArticleHref(article.slug)}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  >
                    <div className="p-4 sm:p-5 flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                          {article.category}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                          {getTypeLabel(article.type)}
                        </span>
                      </div>
                      <h3 className="home-line-clamp-2 text-lg font-bold leading-tight text-zinc-900 transition group-hover:text-[var(--color-accent)]">
                        {article.title}
                      </h3>
                      <p className="mt-2 home-line-clamp-3 text-sm leading-relaxed text-zinc-600">
                        {article.summary}
                      </p>
                    </div>
                    <div className="border-t border-zinc-100 bg-zinc-50 px-4 sm:px-5 py-3 mt-auto flex items-center justify-between text-xs text-zinc-500">
                      <span>{article.author}</span>
                      <span>{formatDateVi(article.updatedAt, "Gần đây")}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

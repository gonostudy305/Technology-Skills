import Link from "next/link";
import {
  type ArticleInfo,
  getArticlesList,
  HOME_TABS,
  TAB_CATEGORY_MAP,
} from "@/lib/contents";
import { formatDateVi, formatNumberVi } from "@/lib/utils";
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

const HERO_GRADIENTS = [
  "from-sky-300 via-blue-600 to-slate-950",
  "from-cyan-200 via-blue-500 to-indigo-900",
  "from-slate-200 via-zinc-400 to-zinc-800",
  "from-amber-200 via-orange-500 to-stone-900",
  "from-emerald-200 via-teal-500 to-slate-900",
];

const CARD_GRADIENTS = [
  "from-sky-100 via-blue-200 to-indigo-200",
  "from-orange-100 via-amber-200 to-red-200",
  "from-emerald-100 via-teal-200 to-cyan-200",
  "from-rose-100 via-pink-200 to-purple-200",
  "from-zinc-100 via-slate-200 to-stone-200",
];

function getHeroGradient(index: number): string {
  return HERO_GRADIENTS[index % HERO_GRADIENTS.length];
}

function getCardGradient(index: number): string {
  return CARD_GRADIENTS[index % CARD_GRADIENTS.length];
}

function getTypeLabel(type: string): string {
  return type === "md" ? "Markdown" : "HTML";
}

function getArticleHref(slug: string): string {
  return getCanonicalArticlePath(slug) ?? `/articles/${slug}`;
}

const TONE_CLASS_MAP = {
  teal: "border-teal-200 bg-teal-50 text-teal-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
} as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function renderSecondaryHeroCard(
  article: ArticleInfo | undefined,
  index: number,
) {
  if (!article) return null;

  const articleHref = getArticleHref(article.slug);

  return (
    <Link
      key={article.slug}
      prefetch
      href={articleHref}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900 p-5 text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getHeroGradient(index + 1)} opacity-90`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(255,255,255,0.25),transparent_35%)]" />

      <div className="relative flex min-h-[154px] flex-col justify-end">
        <span className="inline-flex w-fit items-center rounded-full border border-white/30 bg-black/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90">
          {article.category}
        </span>
        <h3 className="mt-3 home-line-clamp-2 text-xl font-semibold leading-tight text-white transition group-hover:text-cyan-100">
          {article.title}
        </h3>
        <p className="mt-2 home-line-clamp-2 text-sm leading-relaxed text-white/80">
          {article.summary}
        </p>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function Home({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const articles = await getArticlesList();
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    if (dateA !== dateB) return dateB - dateA;
    return a.title.localeCompare(b.title, "vi");
  });

  // -----------------------------------------------------------------------
  // Tab filtering via searchParams (?tab=...)
  // -----------------------------------------------------------------------
  const activeTab = searchParams.tab ?? HOME_TABS[0];
  const activeCategory = TAB_CATEGORY_MAP[activeTab] ?? null;

  const filteredArticles = activeCategory
    ? sortedArticles.filter((a) => a.category === activeCategory)
    : sortedArticles;

  const subjectDirectory = buildSubjectDirectory(sortedArticles);
  const featuredSubjects = subjectDirectory.slice(0, 8);

  const heroArticle = sortedArticles[0];
  const secondaryHeroArticles = sortedArticles.slice(1, 3);
  const spotlightArticle = sortedArticles[3] ?? sortedArticles[0];
  const listArticles = filteredArticles;

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

            <section className="grid gap-4 lg:grid-cols-[2.1fr_1fr_1fr]">
              {heroArticle ? (
                <Link
                  prefetch
                  href={getArticleHref(heroArticle.slug)}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:p-8"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getHeroGradient(0)} opacity-95`}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_15%,rgba(255,255,255,0.33),transparent_38%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(8,47,73,0.2),rgba(2,6,23,0.9))]" />

                  <div className="relative flex min-h-[300px] flex-col justify-end sm:min-h-[340px]">
                    <span className="inline-flex w-fit items-center rounded-full border border-white/35 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/90">
                      {heroArticle.category}
                    </span>

                    <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white transition group-hover:text-cyan-100 sm:text-[2.15rem]">
                      {heroArticle.title}
                    </h1>

                    <p className="mt-4 max-w-2xl home-line-clamp-3 text-sm leading-relaxed text-white/80 sm:text-base">
                      {heroArticle.summary}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/80 sm:text-sm">
                      <span>{heroArticle.author}</span>
                      <span>
                        {formatDateVi(heroArticle.updatedAt, "Khong ro ngay")}
                      </span>
                      <span>
                        {formatNumberVi(heroArticle.viewCount)} luot xem
                      </span>
                    </div>
                  </div>
                </Link>
              ) : null}

              <div className="grid gap-4">
                {secondaryHeroArticles.map((article, index) =>
                  renderSecondaryHeroCard(article, index),
                )}
              </div>

              <aside className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <span className="inline-flex rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  Noi bat
                </span>

                {spotlightArticle ? (
                  <Link
                    prefetch
                    href={getArticleHref(spotlightArticle.slug)}
                    className="group mt-4 block overflow-hidden rounded-xl border border-zinc-200"
                  >
                    <div
                      className={`flex h-[150px] items-center justify-center bg-gradient-to-br ${getCardGradient(1)} p-4`}
                    >
                      <div className="rounded-full border border-white/60 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-700">
                        {getTypeLabel(spotlightArticle.type)}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="home-line-clamp-2 text-xl font-semibold leading-tight text-zinc-900 transition group-hover:text-sky-700">
                        {spotlightArticle.title}
                      </h3>
                      <p className="mt-3 home-line-clamp-3 text-sm leading-relaxed text-zinc-600">
                        {spotlightArticle.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                        <span>{spotlightArticle.author}</span>
                        <span>{spotlightArticle.category}</span>
                      </div>
                    </div>
                  </Link>
                ) : null}
              </aside>
            </section>

            {/* ─── Filterable Tabs ─── */}
            <section
              id="latest-articles"
              className="mt-12 rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="no-scrollbar overflow-x-auto px-4">
                <ul className="flex min-w-max items-center gap-7 py-3.5 text-sm">
                  {HOME_TABS.map((tab) => {
                    const isActive = tab === activeTab;
                    const href =
                      tab === HOME_TABS[0]
                        ? "/"
                        : `/?tab=${encodeURIComponent(tab)}`;
                    return (
                      <li key={tab}>
                        <Link
                          href={href}
                          scroll={false}
                          className={
                            isActive
                              ? "font-semibold text-orange-600"
                              : "font-medium text-zinc-500 transition hover:text-zinc-900"
                          }
                        >
                          {tab}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <ul className="space-y-3">
                {listArticles.length === 0 ? (
                  <li className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center shadow-sm">
                    <p className="text-zinc-500">
                      Không có bài viết nào trong danh mục &ldquo;
                      {activeTab}&rdquo;.
                    </p>
                  </li>
                ) : (
                  listArticles.map((article, index) => (
                    <li key={article.slug}>
                      <Link
                        prefetch
                        href={getArticleHref(article.slug)}
                        className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-start sm:p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                      >
                        <div
                          className={`flex h-[108px] w-full shrink-0 items-center justify-center rounded-xl border border-white/40 bg-gradient-to-br ${getCardGradient(index)} sm:w-[170px]`}
                        >
                          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700">
                            {getTypeLabel(article.type)}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h2 className="home-line-clamp-2 text-[1.62rem] font-semibold leading-tight text-zinc-900 transition group-hover:text-sky-700 sm:text-[1.95rem]">
                            {article.title}
                          </h2>

                          <p className="mt-2 home-line-clamp-2 text-base leading-relaxed text-zinc-600">
                            {article.summary}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                            <span>{article.author}</span>
                            <span>
                              {formatDateVi(
                                article.updatedAt,
                                "Khong ro ngay",
                              )}
                            </span>
                            <span>
                              {formatNumberVi(article.viewCount)} luot xem
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-zinc-600">
                              {article.category}
                            </span>
                            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-zinc-600">
                              {article.slug}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))
                )}
              </ul>

              <aside className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                  <div className="bg-[radial-gradient(circle_at_top_left,#fed7aa,#ea580c)] p-5 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
                      Su kien
                    </span>
                    <h3 className="mt-2 text-2xl font-semibold leading-tight">
                      Nam tay dat nhau cung lam chu Claude AI
                    </h3>
                    <p className="mt-2 text-sm text-white/85">
                      Offline/Online workshop voi lo trinh prompt va automation
                      thuc chien.
                    </p>
                  </div>
                  <div className="space-y-3 p-4 text-sm text-zinc-600">
                    <p className="font-medium text-zinc-800">18/04/2026</p>
                    <p>Online (Lark/Zoom) + Offline: TP.HCM</p>
                    <p className="font-semibold text-orange-600">
                      2,092 nguoi da dang ky
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.11em] text-zinc-500">
                    Chu de nhanh
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "Prompt Engineering",
                      "AI Product",
                      "Automation",
                      "Data Stack",
                      "UX Writing",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </aside>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

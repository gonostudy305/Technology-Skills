import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  type ArticleInfo,
  getArticleBySlug,
  getArticlesList,
} from "@/lib/contents";
import {
  formatDateVi,
  formatNumberVi,
  readingTimeInMinutes,
  titleFromSlug,
} from "@/lib/utils";
import { getCanonicalArticlePath } from "@/lib/subjects";
import Link from "next/link";
import HtmlRenderer from "./HtmlRenderer";
import ReadingProgressBar from "./ReadingProgressBar";
import CodeHighlighter from "./CodeHighlighter";
import SimulationControls from "./SimulationControls";

export const revalidate = 60;

function normalizeCategoryLabel(category?: string): string {
  if (!category) return "Kiến thức";

  const probe = category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (probe.includes("nen tang")) return "Nền tảng";
  if (probe.includes("san pham")) return "Sản phẩm";
  if (probe.includes("ung dung")) return "Ứng dụng";
  if (probe.includes("kien thuc")) return "Kiến thức";

  return category;
}

export async function generateArticleMetadataBySlug(
  slug: string,
): Promise<Metadata> {
  const articles = await getArticlesList();
  const meta = articles.find((a) => a.slug === slug);

  const title = meta?.title ?? titleFromSlug(slug);
  const description =
    meta?.summary ??
    "Bài viết chia sẻ góc nhìn chuyên sâu và kinh nghiệm thực chiến.";
  const category = normalizeCategoryLabel(meta?.category);

  return {
    title: `${title} | HTTT UEL Hub`,
    description,
    keywords: [category, "UEL", "HTTT", "Knowledge Base", slug],
    authors: [{ name: meta?.author ?? "Minh Tuấn" }],
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "HTTT UEL Knowledge Base",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateArticleSlugStaticParams() {
  const articles = await getArticlesList();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

function articleTimeValue(article: ArticleInfo): number {
  const dateValue = article.updatedAt ?? article.dateStr;
  if (!dateValue) return 0;
  const parsed = new Date(dateValue).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default async function ArticlePageContent({ slug }: { slug: string }) {
  const [article, articles] = await Promise.all([
    getArticleBySlug(slug),
    getArticlesList(),
  ]);

  if (!article) {
    notFound();
  }

  const articleMeta = articles.find((item) => item.slug === slug);

  const articleTitle = articleMeta?.title ?? titleFromSlug(slug);
  const articleSummary =
    articleMeta?.summary ??
    "Bài viết chia sẻ góc nhìn chuyên sâu và kinh nghiệm thực chiến.";
  const articleCategory = normalizeCategoryLabel(articleMeta?.category);
  const articleAuthor = articleMeta?.author ?? "Ban biên tập";
  const articleUpdatedAt = formatDateVi(
    articleMeta?.updatedAt ?? articleMeta?.dateStr,
  );
  const articleViews = formatNumberVi(articleMeta?.viewCount);
  const readingMinutes = readingTimeInMinutes(article.content);
  const authorInitial = articleAuthor.trim().charAt(0).toUpperCase() || "T";
  const articleToc = article.toc ?? [];
  const embeddedLayoutMarker =
    /(docker-sim-shell|dl-shell|id=["']tab-list["']|class=["'][^"']*tab-btn|id=["']local-graph-container["']|id=["']roleRadarChart["'])/i;
  const hasEmbeddedSidebarLayout =
    article.type === "html" && embeddedLayoutMarker.test(article.content);
  const isReadingLayout = !hasEmbeddedSidebarLayout;

  const sameCategoryArticles = articles
    .filter(
      (item) =>
        item.slug !== slug &&
        normalizeCategoryLabel(item.category) === articleCategory,
    )
    .sort((a, b) => articleTimeValue(b) - articleTimeValue(a));

  const fallbackArticles = articles
    .filter(
      (item) =>
        item.slug !== slug &&
        !sameCategoryArticles.some((related) => related.slug === item.slug),
    )
    .sort((a, b) => articleTimeValue(b) - articleTimeValue(a));

  const relatedArticles = [...sameCategoryArticles, ...fallbackArticles].slice(0, 3);

  const pageContainerClassName = hasEmbeddedSidebarLayout
    ? "mx-auto w-full max-w-[1540px] px-2 sm:px-4 lg:px-6"
    : "mx-auto w-full max-w-[1200px] px-3 sm:px-5 lg:px-8";

  const tocTopClassName =
    "mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:hidden";

  const articleGridClassName = hasEmbeddedSidebarLayout
    ? "mt-6 grid gap-4"
    : articleToc.length > 0
      ? "mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,720px)] lg:justify-center xl:grid-cols-[240px_minmax(0,720px)]"
      : "mt-6 grid gap-6 lg:grid-cols-[minmax(0,720px)] lg:justify-center";

  const htmlContentPaddingClassName = hasEmbeddedSidebarLayout
    ? "article-rich-content px-1 py-1 sm:px-2 sm:py-2"
    : "article-rich-content article-reading px-3 py-4 sm:px-6 sm:py-7";

  return (
    <div className="min-h-screen bg-[#f5f1ea] pb-14 pt-5 sm:pt-7">
      {isReadingLayout ? <ReadingProgressBar /> : null}

      <div className={pageContainerClassName}>
        <section className="rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <Link
              href="/"
              className="font-medium text-zinc-600 transition hover:text-zinc-900"
            >
              Trang chủ
            </Link>
            <span aria-hidden="true">/</span>
            <span>{articleCategory}</span>
            <span aria-hidden="true">/</span>
            <span className="home-line-clamp-1 max-w-[460px] text-zinc-700">
              {articleTitle}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-zinc-900 sm:text-[2.5rem]">
            {articleTitle}
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            {articleSummary}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-200 text-base font-semibold text-orange-800">
              {authorInitial}
            </div>

            <div className="min-w-0">
              <p className="font-medium text-zinc-800">{articleAuthor}</p>
              <p className="text-sm text-zinc-500">
                {articleUpdatedAt} · {readingMinutes} phút đọc · {articleViews}{" "}
                lượt xem
              </p>
            </div>

            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
              <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                Học phần liên quan: {articleCategory}
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                {article.type.toUpperCase()}
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                {slug}
              </span>
            </div>
          </div>
        </section>

        {articleToc.length > 0 && isReadingLayout ? (
          <section className={tocTopClassName}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Mục lục nội dung
            </h2>
            <nav className="mt-3" aria-label="Mục lục bài viết">
              <ul className="grid gap-2 sm:grid-cols-2">
                {articleToc.map((item) => (
                  <li
                    key={item.id}
                    className={item.level === 3 ? "pl-3" : ""}
                  >
                    <a
                      href={`#${item.id}`}
                      className="block rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 transition hover:border-sky-200 hover:text-sky-700"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        ) : null}

        <section className={articleGridClassName}>
          {isReadingLayout && articleToc.length > 0 ? (
            <aside className="hidden self-start rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:block">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Mục lục nội dung
              </h2>
              <nav className="mt-3" aria-label="Mục lục bài viết">
                <ul className="space-y-1.5">
                  {articleToc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
                      <a
                        href={`#${item.id}`}
                        className="block rounded-md px-2 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          ) : null}

          <article id="article-content-container" className="min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300">
            <CodeHighlighter />
            {article.type === "md" ? (
              <div className="article-rich-content article-reading prose prose-academic max-w-none px-5 py-9 sm:px-8 lg:px-10">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            ) : (
              <>
                {hasEmbeddedSidebarLayout && <SimulationControls />}
                <div className={htmlContentPaddingClassName}>
                  <HtmlRenderer
                    html={article.content}
                    scripts={article.scripts}
                  />
                </div>
              </>
            )}
          </article>
        </section>

        <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-zinc-900">
              Bài liên quan trong cùng học phần
            </h2>
            <Link
              href="/hoc-phan"
              className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
            >
              Xem tất cả
            </Link>
          </div>

          {relatedArticles.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">
              Chưa có bài viết liên quan trong kho nội dung.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {relatedArticles.map((relatedArticle) => {
                const relatedHref =
                  getCanonicalArticlePath(relatedArticle.slug) ??
                  `/articles/${relatedArticle.slug}`;

                return (
                  <li key={relatedArticle.slug}>
                    <Link
                      prefetch
                      href={relatedHref}
                      className="group block rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                        {normalizeCategoryLabel(relatedArticle.category)}
                      </span>
                      <h3 className="mt-2 home-line-clamp-2 text-lg font-semibold leading-tight text-zinc-900 transition group-hover:text-sky-700">
                        {relatedArticle.title}
                      </h3>
                      <p className="mt-2 home-line-clamp-2 text-sm leading-relaxed text-zinc-600">
                        {relatedArticle.summary}
                      </p>
                      <p className="mt-3 text-xs text-zinc-500">
                        {formatDateVi(
                          relatedArticle.updatedAt ?? relatedArticle.dateStr,
                        )}{" "}
                        · {formatNumberVi(relatedArticle.viewCount)} lượt xem
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

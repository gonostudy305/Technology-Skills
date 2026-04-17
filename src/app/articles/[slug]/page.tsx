import { notFound } from "next/navigation";
import { type ArticleInfo, getArticleBySlug, getArticlesList } from "@/lib/contents";
import Link from "next/link";
import HtmlRenderer from "./HtmlRenderer";

function formatDate(dateValue?: string): string {
  if (!dateValue) return "Chưa cập nhật";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatViews(value?: number): string {
  return new Intl.NumberFormat("vi-VN").format(value ?? 0);
}

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

function titleFromSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function readingTimeInMinutes(html: string): number {
  const plainText = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!plainText) return 1;

  const wordCount = plainText.split(" ").length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

function articleTimeValue(article: ArticleInfo): number {
  const dateValue = article.updatedAt ?? article.dateStr;
  if (!dateValue) return 0;
  const parsed = new Date(dateValue).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export async function generateStaticParams() {
  const articles = await getArticlesList();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, articles] = await Promise.all([getArticleBySlug(params.slug), getArticlesList()]);

  if (!article) {
    notFound();
  }

  const articleMeta = articles.find((item) => item.slug === params.slug);
  const relatedArticles = articles
    .filter((item) => item.slug !== params.slug)
    .sort((a, b) => articleTimeValue(b) - articleTimeValue(a))
    .slice(0, 3);

  const articleTitle = articleMeta?.title ?? titleFromSlug(params.slug);
  const articleSummary = articleMeta?.summary ?? "Bài viết chia sẻ góc nhìn chuyên sâu và kinh nghiệm thực chiến.";
  const articleCategory = normalizeCategoryLabel(articleMeta?.category);
  const articleAuthor = articleMeta?.author ?? "Ban biên tập";
  const articleUpdatedAt = formatDate(articleMeta?.updatedAt ?? articleMeta?.dateStr);
  const articleViews = formatViews(articleMeta?.viewCount);
  const readingMinutes = readingTimeInMinutes(article.content);
  const authorInitial = articleAuthor.trim().charAt(0).toUpperCase() || "T";
  const articleToc = article.toc ?? [];
  const hasEmbeddedSidebarLayout = article.type === "html" && /(docker-sim-shell|dl-shell)/.test(article.content);

  const pageContainerClassName = hasEmbeddedSidebarLayout
    ? "mx-auto w-full max-w-[1540px] px-2 sm:px-4 lg:px-6"
    : "mx-auto w-full max-w-[1180px] px-3 sm:px-5 lg:px-8";

  const tocTopClassName = hasEmbeddedSidebarLayout
    ? "mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
    : "mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:hidden";

  const articleGridClassName = hasEmbeddedSidebarLayout
    ? "mt-4 grid gap-4"
    : "mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]";

  const htmlContentPaddingClassName = hasEmbeddedSidebarLayout
    ? "article-rich-content px-1 py-1 sm:px-2 sm:py-2"
    : "article-rich-content px-2 py-2 sm:px-4 sm:py-4";

  return (
    <div className="min-h-screen bg-[#f5f1ea] pb-14 pt-5 sm:pt-7">
      <div className={pageContainerClassName}>
        <section className="rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="font-medium text-zinc-600 transition hover:text-zinc-900">
              Trang chủ
            </Link>
            <span aria-hidden="true">/</span>
            <span>{articleCategory}</span>
            <span aria-hidden="true">/</span>
            <span className="home-line-clamp-1 max-w-[460px] text-zinc-700">{articleTitle}</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-zinc-900 sm:text-[2.5rem]">
            {articleTitle}
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-zinc-600 sm:text-lg">{articleSummary}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-200 text-base font-semibold text-orange-800">
              {authorInitial}
            </div>

            <div className="min-w-0">
              <p className="font-medium text-zinc-800">{articleAuthor}</p>
              <p className="text-sm text-zinc-500">{articleUpdatedAt} · {readingMinutes} phút đọc · {articleViews} lượt xem</p>
            </div>

            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                {articleCategory}
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                {article.type.toUpperCase()}
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                {params.slug}
              </span>
            </div>
          </div>
        </section>

        {articleToc.length > 0 ? (
          <section className={tocTopClassName}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">Mục lục nội dung</h2>
            <nav className="mt-3" aria-label="Mục lục bài viết">
              <ul className="grid gap-2 sm:grid-cols-2">
                {articleToc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
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
          <article className="min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            {article.type === "md" ? (
              <div className="article-rich-content prose prose-academic max-w-none px-4 py-9 sm:px-8 lg:px-10">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            ) : (
              <div className={htmlContentPaddingClassName}>
                <HtmlRenderer html={article.content} scripts={article.scripts} />
              </div>
            )}
          </article>

          {!hasEmbeddedSidebarLayout ? (
            <aside className="space-y-4 self-start lg:sticky lg:top-20">
            {articleToc.length > 0 ? (
              <section className="hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:block">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">Mục lục nội dung</h2>
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
              </section>
            ) : null}

            <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                AI Mới Nhất
              </span>
              <h2 className="mt-3 text-xl font-semibold leading-tight text-zinc-900">
                Claude Skills giúp bạn tăng tốc quy trình viết và nghiên cứu
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Tận dụng bộ kỹ năng theo ngữ cảnh để tạo bài viết, chuẩn hóa cấu trúc và tự động hóa thao tác lặp lại.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center rounded-lg bg-[#c7662d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b35a26]"
              >
                Dùng thử ngay
              </button>
            </section>

            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="bg-[radial-gradient(circle_at_top_left,#fed7aa,#ea580c)] p-4 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">Sự kiện</span>
                <h2 className="mt-2 text-lg font-semibold leading-tight">Workshop Claude AI dành cho đội ngũ nội dung</h2>
              </div>
              <div className="space-y-2 p-4 text-sm text-zinc-600">
                <p className="font-medium text-zinc-800">18/04/2026</p>
                <p>Online (Lark/Zoom) + Offline: TP.HCM</p>
                <p className="font-semibold text-orange-600">2.092 người đã đăng ký</p>
              </div>
            </section>
            </aside>
          ) : null}
        </section>

        <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-zinc-900">Bài viết liên quan</h2>
            <Link href="/" className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900">
              Xem tất cả
            </Link>
          </div>

          {relatedArticles.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">Chưa có bài viết liên quan trong kho nội dung.</p>
          ) : (
            <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <li key={relatedArticle.slug}>
                  <Link
                    prefetch
                    href={`/articles/${relatedArticle.slug}`}
                    className="group block rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      {normalizeCategoryLabel(relatedArticle.category)}
                    </span>
                    <h3 className="mt-2 home-line-clamp-2 text-lg font-semibold leading-tight text-zinc-900 transition group-hover:text-sky-700">
                      {relatedArticle.title}
                    </h3>
                    <p className="mt-2 home-line-clamp-2 text-sm leading-relaxed text-zinc-600">{relatedArticle.summary}</p>
                    <p className="mt-3 text-xs text-zinc-500">
                      {formatDate(relatedArticle.updatedAt ?? relatedArticle.dateStr)} · {formatViews(relatedArticle.viewCount)} lượt xem
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold text-zinc-900">Thảo luận</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Khu vực này dùng để ghi chú nhanh, đặt câu hỏi và trao đổi thêm về nội dung bài viết.
          </p>
          <textarea
            className="mt-4 min-h-28 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Viết bình luận của bạn tại đây..."
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-[#c7662d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b35a26]"
            >
              Gửi bình luận
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

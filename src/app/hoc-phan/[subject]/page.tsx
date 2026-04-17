import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticlesList } from "@/lib/contents";
import {
  buildSubjectDirectory,
  getSubjectBySlug,
  getSubjectStaticParamsFromDirectory,
  getSubjectStatusMeta,
} from "@/lib/subjects";
import { formatDateVi } from "@/lib/utils";

const TONE_CLASS_MAP = {
  teal: "border-teal-200 bg-teal-50 text-teal-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
} as const;

export async function generateMetadata({
  params,
}: {
  params: { subject: string };
}): Promise<Metadata> {
  const subject = getSubjectBySlug(params.subject);

  if (!subject) {
    return {
      title: "Học phần | HTTT UEL Hub",
      description: "Danh sách học phần dành cho sinh viên HTTT UEL.",
    };
  }

  return {
    title: `${subject.name} | Học phần HTTT UEL`,
    description: subject.description,
  };
}

export async function generateStaticParams() {
  const articles = await getArticlesList();
  const directory = buildSubjectDirectory(articles);
  return getSubjectStaticParamsFromDirectory(directory);
}

export default async function SubjectPage({
  params,
}: {
  params: { subject: string };
}) {
  const subjectMeta = getSubjectBySlug(params.subject);
  if (!subjectMeta) notFound();

  const articles = await getArticlesList();
  const subjectDirectory = buildSubjectDirectory(articles);
  const subject = subjectDirectory.find((item) => item.slug === params.subject);

  if (!subject) notFound();

  const statusMeta = getSubjectStatusMeta(subject.status);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1080px] space-y-6">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]">
            <Link href="/" className="hover:text-[var(--color-text-primary)] transition">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/hoc-phan" className="hover:text-[var(--color-text-primary)] transition">
              Học phần
            </Link>
            <span>/</span>
            <span className="text-[var(--color-text-primary)]">{subject.name}</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-[var(--color-text-primary)]">
            {subject.name}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            {subject.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${TONE_CLASS_MAP[statusMeta.tone]}`}>
              {statusMeta.label}
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              Năm {subject.year}
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              {subject.resourceCount} tài nguyên
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Nội dung trong học phần</h2>

          {subject.resources.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
              Học phần này đang được biên soạn. Nội dung sẽ được cập nhật sớm.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {subject.resources.map((resource) => (
                <li key={resource.slug}>
                  <Link
                    href={resource.routePath}
                    className="group block rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      <span>{resource.kind === "sim" ? "Simulation" : "Bài viết"}</span>
                      <span>•</span>
                      <span>{resource.category ?? "Kiến thức"}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold leading-tight text-[var(--color-text-primary)] transition group-hover:text-[var(--color-accent)]">
                      {resource.title}
                    </h3>
                    <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                      Cập nhật: {formatDateVi(resource.updatedAt)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

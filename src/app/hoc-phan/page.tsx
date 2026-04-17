import type { Metadata } from "next";
import Link from "next/link";
import { getArticlesList } from "@/lib/contents";
import {
  buildSubjectDirectory,
  getSubjectStatusMeta,
  type SubjectDirectoryItem,
} from "@/lib/subjects";
import { formatDateVi } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Học phần | HTTT UEL Hub",
  description: "Tra cứu học phần HTTT UEL và mở rộng nội dung theo từng môn học.",
};

const TONE_CLASS_MAP = {
  teal: "border-teal-200 bg-teal-50 text-teal-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
} as const;

function groupByYear(subjects: SubjectDirectoryItem[]) {
  return [1, 2, 3, 4]
    .map((year) => ({
      year,
      subjects: subjects.filter((subject) => subject.year === year),
    }))
    .filter((group) => group.subjects.length > 0);
}

export default async function CurriculumPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q ?? "").trim().toLowerCase();
  const articles = await getArticlesList();
  const subjectDirectory = buildSubjectDirectory(articles);

  const filteredSubjects = query
    ? subjectDirectory.filter((subject) => {
        const inSubject = `${subject.name} ${subject.description}`.toLowerCase();
        const inResources = subject.resources
          .map((resource) => resource.title)
          .join(" ")
          .toLowerCase();
        return inSubject.includes(query) || inResources.includes(query);
      })
    : subjectDirectory;

  const groupedSubjects = groupByYear(filteredSubjects);

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Học phần HTTT UEL
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--color-text-secondary)]">
          Tìm theo đúng môn học trong thời khóa biểu và mở nội dung ngay tại chỗ.
          Mỗi học phần hiển thị trạng thái rõ ràng: Có blog, Có simulation,
          Đang viết hoặc Chưa có.
        </p>

        <form action="/hoc-phan" className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            name="q"
            defaultValue={searchParams.q ?? ""}
            placeholder="Tìm học phần, ví dụ: Cơ sở dữ liệu, Kỹ thuật lập trình..."
            className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-teal-100"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Tìm học phần
          </button>
        </form>
      </section>

      {groupedSubjects.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-zinc-600">Không tìm thấy học phần phù hợp với từ khóa.</p>
        </section>
      ) : (
        <section className="mt-8 space-y-8">
          {groupedSubjects.map((group) => (
            <div key={group.year}>
              <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                Năm {group.year}
              </h2>

              <div className="space-y-3">
                {group.subjects.map((subject) => {
                  const statusMeta = getSubjectStatusMeta(subject.status);
                  const shouldOpen = Boolean(query) || subject.resourceCount > 0;

                  return (
                    <details
                      key={subject.slug}
                      open={shouldOpen}
                      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm"
                    >
                      <summary className="cursor-pointer list-none p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                            {subject.name}
                          </h3>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${TONE_CLASS_MAP[statusMeta.tone]}`}
                          >
                            {statusMeta.label}
                          </span>
                          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                            {subject.resourceCount} tài nguyên
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                          {subject.description}
                        </p>
                      </summary>

                      <div className="border-t border-zinc-200 px-5 py-4">
                        {subject.resources.length === 0 ? (
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            Học phần này đang trong hàng đợi biên soạn.
                          </p>
                        ) : (
                          <ul className="space-y-3">
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
                                  <h4 className="mt-2 text-base font-semibold leading-tight text-[var(--color-text-primary)] transition group-hover:text-[var(--color-accent)]">
                                    {resource.title}
                                  </h4>
                                  <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                                    Cập nhật: {formatDateVi(resource.updatedAt)}
                                  </p>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="mt-4">
                          <Link
                            href={`/hoc-phan/${subject.slug}`}
                            className="text-sm font-medium text-[var(--color-accent)] hover:underline"
                          >
                            Xem trang học phần riêng
                          </Link>
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

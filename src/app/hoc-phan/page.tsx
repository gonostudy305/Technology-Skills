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
    <div className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Bento Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0369a1] to-[#075985] p-8 text-white shadow-2xl lg:p-12">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
            Bản đồ tri thức
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Học phần HTTT UEL
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sky-100/90 sm:text-xl">
            Lộ trình học tập tinh gọn, từ nền tảng đến chuyên sâu. Khám phá các bài viết, mô phỏng trực quan và tài nguyên số chuẩn Academic.
          </p>

          <form action="/hoc-phan" className="mt-10 flex max-w-xl items-center gap-3 overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg shadow-sky-950/20">
            <i className="fa-solid fa-magnifying-glass ml-4 text-zinc-400" />
            <input
              name="q"
              defaultValue={searchParams.q ?? ""}
              placeholder="Tìm theo môn học hoặc tài nguyên..."
              className="h-10 w-full bg-transparent px-2 text-sm text-zinc-800 outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-sky-700 px-6 text-sm font-bold text-white transition hover:bg-sky-800 active:scale-95"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl transition-all" />
      </section>

      {groupedSubjects.length === 0 ? (
        <section className="mt-12 rounded-[2rem] border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <i className="fa-solid fa-ghost text-2xl" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-zinc-800">Không tìm thấy kết quả</h3>
          <p className="mt-1 text-sm text-zinc-500">Hãy thử tìm kiếm với từ khóa khác như "Cơ sở dữ liệu" hoặc "Python".</p>
        </section>
      ) : (
        <section className="mt-12 space-y-16">
          {groupedSubjects.map((group) => (
            <div key={group.year}>
              <div className="mb-8 flex items-end justify-between border-b border-zinc-200 pb-4">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                    Năm học {group.year}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-zinc-500">Gồm {group.subjects.length} học phần then chốt</p>
                </div>
                <div className="h-0.5 flex-1 mx-8 bg-zinc-100 hidden md:block" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">HTTT UEL</span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {group.subjects.map((subject) => {
                  const statusMeta = getSubjectStatusMeta(subject.status);

                  return (
                    <div
                      key={subject.slug}
                      className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-sm transition-all hover:border-sky-200 hover:shadow-xl hover:shadow-sky-500/5"
                    >
                      <div className="flex-1 p-6 lg:p-8">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TONE_CLASS_MAP[statusMeta.tone]}`}>
                              {statusMeta.label}
                            </span>
                            {subject.resourceCount > 0 && (
                              <span className="rounded-lg border border-orange-100 bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                                {subject.resourceCount} TÀI NGUYÊN
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/hoc-phan/${subject.slug}`}
                            className="text-zinc-400 hover:text-sky-600"
                            title="Xem trang riêng"
                          >
                            <i className="fa-solid fa-arrow-up-right-from-square text-sm" />
                          </Link>
                        </div>

                        <h3 className="mt-4 text-xl font-bold text-zinc-900 transition-colors group-hover:text-sky-700">
                          {subject.name}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                          {subject.description}
                        </p>

                        <div className="mt-8 space-y-3">
                          {subject.resources.slice(0, 3).map((resource) => (
                            <Link
                              key={resource.slug}
                              href={resource.routePath}
                              className="flex items-center justify-between rounded-xl bg-zinc-50 p-3 transition hover:bg-sky-50 hover:text-sky-700"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${resource.kind === "sim" ? "bg-orange-100 text-orange-600" : "bg-sky-100 text-sky-600"}`}>
                                  <i className={`fa-solid ${resource.kind === "sim" ? "fa-cube" : "fa-file-lines"} text-xs`} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold leading-none">{resource.title}</h4>
                                  <p className="mt-1 text-[10px] text-zinc-400 font-medium">Cập nhật: {formatDateVi(resource.updatedAt)}</p>
                                </div>
                              </div>
                              <i className="fa-solid fa-chevron-right text-[10px] opacity-0 transition group-hover/link:opacity-100" />
                            </Link>
                          ))}
                          {subject.resourceCount > 3 && (
                            <Link
                              href={`/hoc-phan/${subject.slug}`}
                              className="block py-1 text-center text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-sky-600"
                            >
                              Xem tất cả {subject.resourceCount} tài nguyên
                            </Link>
                          )}
                          {subject.resourceCount === 0 && (
                            <div className="flex items-center gap-2 py-3 text-xs italic text-zinc-400">
                              <i className="fa-solid fa-clock-rotate-left opacity-50" />
                              Học phần đang được biên soạn...
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-zinc-50 bg-zinc-50/50 px-6 py-3">
                        <Link
                          href={`/hoc-phan/${subject.slug}`}
                          className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 transition hover:text-sky-700"
                        >
                          Mở chi tiết học phần
                          <i className="fa-solid fa-chevron-down text-[8px]" />
                        </Link>
                      </div>
                    </div>
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

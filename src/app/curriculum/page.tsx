import type { Metadata } from "next";
import Link from "next/link";
import { getArticlesList } from "@/lib/contents";
import {
  buildSubjectDirectory,
  getSubjectStatusMeta,
} from "@/lib/subjects"; export const metadata: Metadata = {
  title: "Học phần | HTTT UEL Hub",
  description: "Tra cứu học phần HTTT UEL và mở rộng nội dung theo từng môn học.",
};



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

  // Rather than rigid groupings, let's just show a flat list that the user can filter.
  // Coursera style: Title block -> Filter block -> Flat grid of courses

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">

        {/* Breadcrumb & Simple Title Block (Coursera style) */}
        <section className="mb-10">
          <div className="text-sm font-medium text-zinc-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:underline text-blue-600">Trang chủ</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-zinc-900">Danh mục học phần HTTT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
            Khám phá các học phần và chứng chỉ hệ thống
          </h1>
          <p className="max-w-4xl text-base leading-relaxed text-zinc-700">
            Khám phá kiến thức chuyên ngành thông qua các tài liệu học tập, mô phỏng trực quan và bài viết chuyên sâu. Các học phần được thiết kế để trang bị cho bạn tư duy phân tích, thiết kế, triển khai và quản trị hệ thống thông tin chuyên nghiệp chuẩn Academic.
          </p>
        </section>

        {/* Filter Section  */}
        <section className="mb-8 border-b border-zinc-200 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              <span className="flex-shrink-0 px-4 py-2 bg-zinc-900 text-white rounded-full text-sm font-bold cursor-pointer">Tất cả</span>
              {[1, 2, 3, 4].map(year => (
                <span key={year} className="flex-shrink-0 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-full text-sm font-semibold hover:bg-zinc-50 cursor-pointer">
                  Năm {year}
                </span>
              ))}
            </div>

            <form action="/curriculum" className="relative w-full max-w-sm">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                name="q"
                defaultValue={searchParams.q ?? ""}
                placeholder="Khám phá môn học..."
                className="h-11 w-full rounded border border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </form>
          </div>
        </section>

        {/* Course Grid */}
        {filteredSubjects.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-4">
              <i className="fa-solid fa-ghost text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-zinc-800">Không tìm thấy kết quả</h3>
            <p className="mt-1 text-sm text-zinc-500">Hãy thử tìm kiếm với từ khóa khác như &quot;Cơ sở dữ liệu&quot; hoặc &quot;Python&quot;.</p>
          </div>
        ) : (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSubjects.map((subject) => {
                const statusMeta = getSubjectStatusMeta(subject.status);

                // Simulate Coursera's abstract cover image using gradients
                const colorMaps: Record<number, string> = {
                  1: "from-blue-600 to-sky-400",
                  2: "from-emerald-600 to-teal-400",
                  3: "from-purple-600 to-indigo-400",
                  4: "from-orange-500 to-rose-400",
                };
                const topGradient = colorMaps[subject.year] || "from-zinc-600 to-zinc-400";

                // Rating mock
                const mockRating = (4 + (Math.random() * 1)).toFixed(1);

                return (
                  <Link
                    key={subject.slug}
                    href={`/curriculum/${subject.slug}`}
                    className="group flex flex-col h-full bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-xl transition-all duration-300 relative focus-visible:outline-blue-600"
                  >
                    {/* Coursera-like Image Region */}
                    <div className={`h-36 bg-gradient-to-r ${topGradient} relative p-4 flex flex-col justify-between`}>
                      {/* Floating badge top-left */}
                      <div className="self-start bg-white/90 backdrop-blur text-blue-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Học phần năm {subject.year}
                      </div>

                      {/* Center abstract pattern or icon placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                        <i className="fa-solid fa-network-wired text-white text-6xl" />
                      </div>
                    </div>

                    {/* Meta info & Univ logo area */}
                    <div className="px-5 pt-4 pb-2 flex-1 flex flex-col relative">
                      {/* University logo block (pushed up a bit) */}
                      <div className="absolute -top-6 left-5 h-12 w-12 bg-white rounded shadow-md border border-zinc-100 flex items-center justify-center p-1">
                        <img src="https://it.uel.edu.vn/wp-content/uploads/2021/04/Logo-Khoa-HTTT.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>

                      <div className="mt-6 flex flex-col h-full">
                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
                          Trường Đại học Kinh tế – Luật
                        </span>

                        <h3 className="mt-1 text-[17px] font-bold text-zinc-900 leading-snug line-clamp-2">
                          {subject.name}
                        </h3>

                        <div className="mt-2 text-sm text-zinc-600 line-clamp-1">
                          <span className="font-semibold text-zinc-800">Tài nguyên:</span> {subject.resourceCount} • {statusMeta.label}
                        </div>

                        <div className="mt-auto pt-3 flex items-center gap-1.5 align-bottom">
                          <span className="font-bold text-sm text-zinc-900">{mockRating}</span>
                          <div className="flex text-amber-500 text-[11px]">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star-half-stroke"></i>
                          </div>
                          <span className="text-xs text-zinc-500 ml-1">({subject.resources.length * 120 + 42} học viên)</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

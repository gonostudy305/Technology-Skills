import type { ArticleInfo } from "@/lib/contents";

export type SubjectStatus =
  | "co-blog"
  | "co-simulation"
  | "blog-va-simulation"
  | "dang-viet"
  | "chua-co";

export type SubjectResourceKind = "article" | "sim";

export interface SubjectDefinition {
  slug: string;
  name: string;
  year: 1 | 2 | 3 | 4;
  description: string;
  defaultStatus?: SubjectStatus;
}

interface SubjectResourceLink {
  slug: string;
  kind: SubjectResourceKind;
}

export interface SubjectResourceResolved {
  slug: string;
  kind: SubjectResourceKind;
  routePath: string;
  title: string;
  category?: string;
  updatedAt?: string;
}

export interface SubjectDirectoryItem extends SubjectDefinition {
  status: SubjectStatus;
  resources: SubjectResourceResolved[];
  resourceCount: number;
}

export interface SubjectStatusMeta {
  label: string;
  tone: "teal" | "cyan" | "amber" | "zinc";
}

const SUBJECT_DEFINITIONS: SubjectDefinition[] = [
  {
    slug: "tu-duy-lap-trinh",
    name: "Tư duy lập trình",
    year: 1,
    description: "Thuật toán nền tảng, mô hình hóa tư duy và recursion trực quan.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "nen-tang-cong-nghe-cho-httt",
    name: "Nền tảng công nghệ cho HTTT",
    year: 1,
    description: "Thiết bị mạng, TCP/IP và request lifecycle trong hạ tầng số.",
  },
  {
    slug: "ky-thuat-lap-trinh",
    name: "Kỹ thuật lập trình",
    year: 1,
    description: "Git workflow, Docker lifecycle và release flow thực chiến.",
  },
  {
    slug: "co-so-du-lieu",
    name: "Cơ sở dữ liệu",
    year: 2,
    description: "SQL, data warehouse, indexing và tư duy thiết kế truy vấn.",
  },
  {
    slug: "phan-tich-du-lieu",
    name: "Phân tích dữ liệu",
    year: 2,
    description: "Từ dữ liệu thô đến insight với pipeline xử lý rõ ràng.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "hoc-may-trong-phan-tich-kinh-doanh",
    name: "Học máy trong phân tích kinh doanh",
    year: 3,
    description: "Direct compare mô hình và trực quan hóa kiến trúc học sâu.",
  },
  {
    slug: "phat-trien-web-kinh-doanh",
    name: "Phát triển web kinh doanh",
    year: 3,
    description: "Xây dựng sản phẩm web thực chiến cho ngữ cảnh doanh nghiệp.",
  },
  {
    slug: "cong-nghe-marketing",
    name: "Công nghệ marketing",
    year: 3,
    description: "SEO, tracking và tự động hóa nội dung trong martech stack.",
  },
  {
    slug: "thiet-ke-do-hoa-va-da-phuong-tien",
    name: "Thiết kế đồ họa và đa phương tiện",
    year: 4,
    description: "UI/UX hệ thống, guideline và design workflow cho web/app.",
  },
  {
    slug: "phuong-phap-nghien-cuu-lien-nganh",
    name: "Phương pháp nghiên cứu liên ngành",
    year: 4,
    description: "Viết nghiên cứu ứng dụng và triển khai case học thuật vào dự án.",
    defaultStatus: "dang-viet",
  },
];

const SUBJECT_RESOURCE_MAP: Record<string, SubjectResourceLink[]> = {
  "nen-tang-cong-nghe-cho-httt": [{ slug: "internet_devices", kind: "article" }],
  "ky-thuat-lap-trinh": [
    { slug: "git_visualizer", kind: "sim" },
    { slug: "docker", kind: "sim" },
    { slug: "release_software", kind: "sim" },
  ],
  "co-so-du-lieu": [{ slug: "data_warehouse", kind: "sim" }],
  "hoc-may-trong-phan-tich-kinh-doanh": [{ slug: "deeplearning", kind: "sim" }],
  "phat-trien-web-kinh-doanh": [{ slug: "obsidan", kind: "article" }],
  "cong-nghe-marketing": [{ slug: "seo-aeo-blog-writer", kind: "article" }],
  "thiet-ke-do-hoa-va-da-phuong-tien": [{ slug: "ui_ux_pro_max", kind: "article" }],
};

const STATUS_META: Record<SubjectStatus, SubjectStatusMeta> = {
  "co-blog": { label: "Có blog", tone: "teal" },
  "co-simulation": { label: "Có simulation", tone: "cyan" },
  "blog-va-simulation": { label: "Blog + simulation", tone: "teal" },
  "dang-viet": { label: "Đang viết", tone: "amber" },
  "chua-co": { label: "Chưa có", tone: "zinc" },
};

function inferStatus(
  resourceLinks: SubjectResourceLink[],
  resources: SubjectResourceResolved[],
  defaultStatus: SubjectStatus | undefined,
): SubjectStatus {
  const hasBlog = resources.some((item) => item.kind === "article");
  const hasSimulation = resources.some((item) => item.kind === "sim");

  if (hasBlog && hasSimulation) return "blog-va-simulation";
  if (hasSimulation) return "co-simulation";
  if (hasBlog) return "co-blog";

  if (resourceLinks.length > 0) return "dang-viet";
  return defaultStatus ?? "chua-co";
}

export function getSubjects(): SubjectDefinition[] {
  return SUBJECT_DEFINITIONS;
}

export function getSubjectBySlug(subjectSlug: string): SubjectDefinition | null {
  return SUBJECT_DEFINITIONS.find((item) => item.slug === subjectSlug) ?? null;
}

export function getSubjectStatusMeta(status: SubjectStatus): SubjectStatusMeta {
  return STATUS_META[status];
}

export function getPrimarySubjectForArticle(articleSlug: string): string | null {
  for (const subject of SUBJECT_DEFINITIONS) {
    const links = SUBJECT_RESOURCE_MAP[subject.slug] ?? [];
    if (links.some((item) => item.slug === articleSlug)) {
      return subject.slug;
    }
  }
  return null;
}

export function getArticleRouteKind(articleSlug: string): SubjectResourceKind {
  for (const subject of SUBJECT_DEFINITIONS) {
    const links = SUBJECT_RESOURCE_MAP[subject.slug] ?? [];
    const matched = links.find((item) => item.slug === articleSlug);
    if (matched) return matched.kind;
  }
  return "article";
}

export function getCanonicalArticlePath(articleSlug: string): string | null {
  const subjectSlug = getPrimarySubjectForArticle(articleSlug);
  if (!subjectSlug) return null;

  const kind = getArticleRouteKind(articleSlug);
  if (kind === "sim") {
    return `/hoc-phan/${subjectSlug}/sim/${articleSlug}`;
  }

  return `/hoc-phan/${subjectSlug}/${articleSlug}`;
}

export function buildSubjectDirectory(
  articles: ArticleInfo[],
): SubjectDirectoryItem[] {
  const articleMap = new Map(articles.map((item) => [item.slug, item]));

  const list = SUBJECT_DEFINITIONS.map((subject) => {
    const links = SUBJECT_RESOURCE_MAP[subject.slug] ?? [];

    const resources: SubjectResourceResolved[] = links
      .map((link) => {
        const article = articleMap.get(link.slug);
        if (!article) return null;

        const routePath =
          link.kind === "sim"
            ? `/hoc-phan/${subject.slug}/sim/${article.slug}`
            : `/hoc-phan/${subject.slug}/${article.slug}`;

        return {
          slug: article.slug,
          kind: link.kind,
          routePath,
          title: article.title,
          category: article.category,
          updatedAt: article.updatedAt ?? article.dateStr,
        };
      })
      .filter((item): item is SubjectResourceResolved => item !== null);

    const status = inferStatus(links, resources, subject.defaultStatus);

    return {
      ...subject,
      status,
      resources,
      resourceCount: resources.length,
    };
  });

  return list.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.name.localeCompare(b.name, "vi");
  });
}

export function getSubjectStaticParamsFromDirectory(
  directory: SubjectDirectoryItem[],
): Array<{ subject: string }> {
  return directory.map((item) => ({ subject: item.slug }));
}

export function getSubjectArticleParamsFromDirectory(
  directory: SubjectDirectoryItem[],
): Array<{ subject: string; slug: string }> {
  return directory
    .flatMap((subject) =>
      subject.resources
        .filter((resource) => resource.kind === "article")
        .map((resource) => ({ subject: subject.slug, slug: resource.slug })),
    );
}

export function getSubjectSimulationParamsFromDirectory(
  directory: SubjectDirectoryItem[],
): Array<{ subject: string; slug: string }> {
  return directory
    .flatMap((subject) =>
      subject.resources
        .filter((resource) => resource.kind === "sim")
        .map((resource) => ({ subject: subject.slug, slug: resource.slug })),
    );
}

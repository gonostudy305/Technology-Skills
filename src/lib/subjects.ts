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
  category: string | undefined;
  updatedAt: string | undefined;
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
    slug: "an-toan-va-bao-mat-httt",
    name: "An toàn và bảo mật HTTT",
    year: 2,
    description: "Bảo mật web/app, rủi ro hệ thống và tư duy phòng vệ thực tế.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "ky-thuat-kiem-thu-phan-mem",
    name: "Kỹ thuật kiểm thử phần mềm",
    year: 2,
    description: "Unit test, integration test và chiến lược đảm bảo chất lượng.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "phan-tich-va-thiet-ke-httt",
    name: "Phân tích và thiết kế HTTT",
    year: 2,
    description: "UML, BPMN và thiết kế quy trình hệ thống theo nghiệp vụ.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "phat-trien-web-kinh-doanh",
    name: "Phát triển web kinh doanh",
    year: 2,
    description: "Xây dựng ứng dụng web cho bài toán doanh nghiệp thực tế.",
  },
  {
    slug: "phat-trien-web-kinh-doanh-nang-cao",
    name: "Phát triển web kinh doanh nâng cao",
    year: 3,
    description: "Tối ưu hiệu năng, kiến trúc hiện đại và chuẩn triển khai production.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "phan-tich-du-lieu",
    name: "Phân tích dữ liệu",
    year: 2,
    description: "Từ dữ liệu thô đến insight với pipeline xử lý rõ ràng.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "phan-tich-du-lieu-nang-cao",
    name: "Phân tích dữ liệu nâng cao",
    year: 3,
    description: "Chuẩn hóa data pipeline và mô hình hóa dữ liệu nâng cao.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "phan-tich-du-lieu-web",
    name: "Phân tích dữ liệu web",
    year: 3,
    description: "Funnel, cohort, attribution và đo lường hành vi người dùng số.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "hoc-may-trong-phan-tich-kinh-doanh",
    name: "Học máy trong phân tích kinh doanh",
    year: 3,
    description: "Direct compare mô hình và trực quan hóa kiến trúc học sâu.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "giai-phap-ai-trong-kinh-doanh-va-quan-ly",
    name: "Giải pháp AI trong kinh doanh và quản lý",
    year: 3,
    description: "Ứng dụng AI agent, prompt workflow và tự động hóa nghiệp vụ.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "tich-hop-quy-trinh-kinh-doanh-voi-erp",
    name: "Tích hợp quy trình kinh doanh với ERP",
    year: 3,
    description: "Thiết kế luồng nghiệp vụ và tích hợp hệ thống module doanh nghiệp.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "tu-dong-hoa-quy-trinh-bang-robot-trong-thuong-mai-dien-tu",
    name: "Tự động hóa quy trình bằng robot trong TMĐT",
    year: 3,
    description: "RPA và workflow automation cho vận hành kinh doanh số.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "phan-tich-marketing-so",
    name: "Phân tích marketing số",
    year: 3,
    description: "Đo lường chiến dịch, mô hình attribution và thực nghiệm A/B.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "cong-nghe-marketing",
    name: "Công nghệ marketing",
    year: 3,
    description: "SEO, tracking và tự động hóa nội dung trong martech stack.",
  },
  {
    slug: "thuong-mai-dien-tu",
    name: "Thương mại điện tử",
    year: 3,
    description: "Mô hình kinh doanh số, unit economics và tối ưu chuyển đổi.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "thuong-mai-tren-mang-xa-hoi",
    name: "Thương mại trên mạng xã hội",
    year: 3,
    description: "Social commerce, live funnel và tăng trưởng theo nền tảng xã hội.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "quan-tri-quan-he-khach-hang-dien-tu",
    name: "Quản trị quan hệ khách hàng điện tử",
    year: 3,
    description: "Customer journey, phân khúc và chiến lược giữ chân khách hàng.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "quan-tri-ban-le-truc-tuyen",
    name: "Quản trị bán lẻ trực tuyến",
    year: 3,
    description: "Vận hành đơn hàng, tồn kho và tối ưu hệ thống bán lẻ số.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "thanh-toan-dien-tu",
    name: "Thanh toán điện tử",
    year: 3,
    description: "Kiến trúc cổng thanh toán và an toàn giao dịch số.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "phat-trien-thuong-mai-di-dong",
    name: "Phát triển thương mại di động",
    year: 3,
    description: "PWA, mobile UX và kiến trúc sản phẩm thương mại trên di động.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "quan-tri-chuoi-cung-ung-trong-thuong-mai-dien-tu",
    name: "Quản trị chuỗi cung ứng trong TMĐT",
    year: 3,
    description: "Chuỗi cung ứng đa kênh, fulfillment và tối ưu last-mile.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "ung-dung-cong-nghe-blockchain",
    name: "Ứng dụng công nghệ Blockchain",
    year: 4,
    description: "Cấu trúc blockchain và ứng dụng trong bài toán kinh doanh số.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "chuyen-doi-so-trong-kinh-doanh",
    name: "Chuyển đổi số trong kinh doanh",
    year: 4,
    description: "Khung chuyển đổi số và chiến lược triển khai doanh nghiệp.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "he-thong-thong-tin-kinh-doanh",
    name: "Hệ thống thông tin kinh doanh",
    year: 4,
    description: "BI stack, dashboard điều hành và hạ tầng báo cáo quyết định.",
    defaultStatus: "dang-viet",
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
  {
    slug: "quan-ly-du-an-httt",
    name: "Quản lý dự án HTTT",
    year: 4,
    description: "Agile delivery, vận hành sprint và điều phối dự án hệ thống.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "he-thong-thong-tin-quan-ly",
    name: "Hệ thống thông tin quản lý",
    year: 4,
    description: "Thiết kế hệ thống quản trị hỗ trợ quyết định ở cấp tổ chức.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "khai-pha-du-lieu",
    name: "Khai phá dữ liệu",
    year: 4,
    description: "Khám phá pattern dữ liệu và ứng dụng mô hình dự báo.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "tri-tue-nhan-tao-ung-dung",
    name: "Trí tuệ nhân tạo ứng dụng",
    year: 4,
    description: "Ứng dụng AI đa miền trong bài toán doanh nghiệp thực tế.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "xu-ly-ngon-ngu-tu-nhien",
    name: "Xử lý ngôn ngữ tự nhiên",
    year: 4,
    description: "NLP pipeline, embedding và mô hình ngôn ngữ cho tiếng Việt.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "thi-giac-may-tinh",
    name: "Thị giác máy tính",
    year: 4,
    description: "Nhận diện hình ảnh, object detection và ứng dụng thị giác AI.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "phan-tich-du-lieu-lon",
    name: "Phân tích dữ liệu lớn",
    year: 4,
    description: "Kiến trúc xử lý dữ liệu quy mô lớn và phân tích near real-time.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "he-thong-goi-y-va-ca-nhan-hoa",
    name: "Hệ thống gợi ý và cá nhân hóa",
    year: 4,
    description: "Recommendation systems và chiến lược cá nhân hóa trải nghiệm số.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "kinh-doanh-so-va-doi-moi",
    name: "Kinh doanh số và đổi mới",
    year: 4,
    description: "Chiến lược đổi mới mô hình kinh doanh trong môi trường số.",
    defaultStatus: "dang-viet",
  },
  {
    slug: "chuyen-de-thuc-tap-nganh-httt",
    name: "Chuyên đề thực tập ngành HTTT",
    year: 4,
    description: "Tổng hợp năng lực qua dự án capstone và báo cáo thực tập.",
    defaultStatus: "dang-viet",
  },
];

const SUBJECT_RESOURCE_MAP: Record<string, SubjectResourceLink[]> = {
  "nen-tang-cong-nghe-cho-httt": [{ slug: "internet_devices", kind: "article" }],
  "ky-thuat-lap-trinh": [
    { slug: "git_visualizer", kind: "sim" },
    { slug: "docker", kind: "sim" },
  ],
  "co-so-du-lieu": [{ slug: "data_warehouse", kind: "sim" }],
  "hoc-may-trong-phan-tich-kinh-doanh": [{ slug: "deeplearning", kind: "sim" }],
  "phat-trien-web-kinh-doanh": [{ slug: "obsidan", kind: "article" }],
  "cong-nghe-marketing": [{ slug: "seo-aeo-blog-writer", kind: "article" }],
  "thiet-ke-do-hoa-va-da-phuong-tien": [{ slug: "ui_ux_pro_max", kind: "article" }],
  "quan-ly-du-an-httt": [{ slug: "release_software", kind: "sim" }],
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

    const resources = links
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

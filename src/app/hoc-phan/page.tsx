import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Học phần | Tech Knowledge Base",
  description: "Danh sách các học phần trong chương trình Hệ thống thông tin UEL",
};

const curriculumGroups = [
  {
    name: "Nhóm 1 — Nền tảng kỹ thuật",
    description: "Các học phần nền tảng kỹ thuật, tập trung vào algorithms, database, và DevOps.",
    modules: [
      { name: "Tư duy lập trình", type: "Simulation", description: "Visualize thuật toán sorting, recursion call stack, flowchart tương tác." },
      { name: "Nền tảng công nghệ cho HTTT", type: "Blog + Simulation", description: "Giải thích TCP/IP, request-response, so sánh client-server vs peer-to-peer." },
      { name: "Kỹ thuật lập trình (Tập trung Git/Docker)", type: "Blog + Simulation", description: "Git workflow, commit tree, Docker lifecycle." },
      { name: "Cơ sở dữ liệu", type: "Simulation", description: "SQL JOIN visualizer, Entity-Relationship diagram builder." },
      { name: "An toàn và bảo mật HTTT", type: "Blog", description: "SSL/TLS handshake, OWASP Top 10, phân biệt authentication vs authorization." },
      { name: "Kỹ thuật kiểm thử phần mềm", type: "Blog + Simulation", description: "Unit test vs integration test vs E2E, interactive test case builder." },
    ],
  },
  {
    name: "Nhóm 2 — Phân tích dữ liệu",
    description: "Thế mạnh cốt lõi: từ pipeline raw data đến visualized insights và Machine Learning.",
    modules: [
      { name: "Phân tích dữ liệu", type: "Blog + Simulation", description: "Pandas workflow từ dataset web analytics, interactive chart builder." },
      { name: "Phân tích dữ liệu nâng cao", type: "Blog", description: "Data pipeline, cleaning, EDA, visualization với PhoBERT/SVM/XGBoost." },
      { name: "Phân tích dữ liệu web", type: "Blog + Simulation", description: "Google Analytics 4 funnel visualization, cohort analysis." },
      { name: "Học máy trong phân tích kinh doanh", type: "Blog", description: "Decision tree, random forest, gradient boosting, so sánh SVM/XGBoost." },
      { name: "Giải pháp AI trong kinh doanh & quản lý", type: "Blog", description: "LLM prompt engineering, AI agent workflow (n8n + Gemini)." },
    ],
  },
  {
    name: "Nhóm 3 — Phát triển hệ thống / Web",
    description: "Xây dựng các hệ thống web thực tế phục vụ vận hành kinh doanh và doanh nghiệp.",
    modules: [
      { name: "Phân tích và thiết kế HTTT", type: "Blog + Simulation", description: "UML use case diagram builder tương tác, BPMN process flow." },
      { name: "Phát triển web kinh doanh", type: "Blog + Simulation", description: "Next.js project structure, REST API lifecycle animation." },
      { name: "Phát triển web kinh doanh nâng cao", type: "Blog", description: "Performance optimization (Core Web Vitals), SSR vs SSG vs CSR." },
      { name: "Tích hợp quy trình KD với ERP", type: "Blog", description: "ERP architecture, module-based vs monolith, workflow automation." },
      { name: "Chuyên đề: Tự động hóa quy trình quản trị", type: "Blog", description: "RPA workflow từ n8n, Zapier vs Make." },
    ],
  },
  {
    name: "Nhóm 4 — Marketing số và kinh doanh ĐT",
    description: "Công nghệ Martech, D2C, eCRM và Quản trị chuỗi cung ứng.",
    modules: [
      { name: "Phân tích marketing số", type: "Blog + Simulation", description: "Marketing attribution model visualizer, A/B test significance calculator." },
      { name: "Công nghệ marketing", type: "Blog", description: "Martech stack, CDP vs CRM vs DMP, Pixel tracking lifecycle." },
      { name: "Thương mại điện tử", type: "Blog", description: "Marketplace vs D2C vs social commerce, unit economics calculator." },
      { name: "Thương mại trên mạng xã hội", type: "Blog", description: "TikTok Shop vs Facebook Shop architecture, live commerce funnel." },
      { name: "Quán trị khách hàng điện tử (eCRM)", type: "Blog + Simulation", description: "Customer journey map builder, RFM segmentation visualizer." },
      { name: "Quán trị chuỗi cung ứng TMĐT", type: "Blog", description: "Supply chain visualization tương tác." },
    ],
  },
  {
    name: "Nhóm 5 — Chuyên sâu và liên ngành",
    description: "Kiến thức nâng cao đi từ Blockchain đến phương pháp nghiên cứu liên ngành.",
    modules: [
      { name: "Ứng dụng công nghệ Blockchain", type: "Blog + Simulation", description: "Blockchain block structure visualizer, public vs private blockchain." },
      { name: "Hệ thống thông tin kinh doanh", type: "Blog", description: "BI stack architecture, dashboard design principles." },
      { name: "Phương pháp nghiên cứu liên ngành", type: "Blog", description: "Hướng dẫn viết research paper, IMRaD structure với PhoBERT." },
      { name: "Thiết kế đồ họa và đa phương tiện", type: "Blog", description: "Figma component system, design token, Figma MCP." },
    ],
  },
];

export default function CurriculumPage() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-4 tracking-tight">Học phần HTTT UEL</h1>
        <p className="text-lg text-zinc-600 max-w-2xl leading-relaxed">
          Bản đồ lộ trình học tập gồm hơn 30 học phần ngành Thương mại điện tử và Hệ thống thông tin (UEL). 
          Kết hợp lý thuyết với <strong className="font-medium text-orange-600">tương tác thực hành (Simulation)</strong> và case study từ dự án thực tế.
        </p>
      </div>

      <div className="space-y-12">
        {curriculumGroups.map((group, idx) => (
          <div key={idx} className="border border-zinc-200 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-zinc-800">{group.name}</h2>
              <p className="text-sm text-zinc-500 mt-1">{group.description}</p>
            </div>
            <div className="divide-y divide-zinc-100">
              {group.modules.map((mod, midx) => (
                <div key={midx} className="p-6 transition hover:bg-zinc-50 flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-lg font-medium text-zinc-900 group-hover:text-sky-600 transition-colors">
                      {mod.name}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">
                      {mod.description}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20 whitespace-nowrap">
                      {mod.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

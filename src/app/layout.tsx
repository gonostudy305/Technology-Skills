import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://httt-uel-hub.vercel.app'),
  title: {
    default: "HTTT UEL Hub - Nền tảng Tri thức mở sinh viên HTTT",
    template: "%s | HTTT UEL Hub",
  },
  description: "Nền tảng học tập, thảo luận, case study và simulations trực quan dành riêng cho sinh viên Khoa Hệ thống Thông tin trường Đại học Kinh tế – Luật.",
  keywords: ["HTTT", "UEL", "Hệ thống thông tin", "Sinh viên", "Tài liệu học tập", "Đại học Kinh tế Luật", "Simulation", "Case Study"],
  openGraph: {
    title: "HTTT UEL Hub - Nền tảng tri thức mở",
    description: "Nền tảng tri thức mở và simulation tương tác cho sinh viên HTTT UEL.",
    url: "/",
    siteName: "HTTT UEL Hub",
    locale: "vi_VN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var saved=localStorage.getItem('kb-theme');var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var useDark=saved?saved==='dark':prefersDark;document.documentElement.classList.toggle('dark',useDark);}catch(_e){}})();",
          }}
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

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
  title: "HTTT UEL Hub",
  description: "Knowledge base and interactive simulations for UEL students",
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

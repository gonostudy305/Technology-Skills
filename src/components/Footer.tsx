import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-zinc-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between grid gap-8">
          <div className="md:w-1/2">
            <h3 className="font-serif font-bold text-xl text-zinc-900">HTTT UEL Hub</h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed max-w-md">
              Dự án phi lợi nhuận cung cấp tài nguyên, simulation tương tác và case study thực tế dành riêng cho sinh viên các ngành Hệ thống thông tin, 
              Thương mại điện tử, HTTT Quản lý, KDS, và Trí tuệ Nhân tạo tại Đại học Kinh tế - Luật (UEL).
            </p>
          </div>
          
          <div className="flex justify-center space-x-6 md:order-2">
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 hover:text-orange-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1 flex items-center justify-center gap-2 text-sm font-medium"
              aria-label="Zalo Official Channel"
            >
              <i className="fa-solid fa-comment-dots text-lg" aria-hidden="true"></i> Zalo OOA
            </a>
            <a 
              href="https://github.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1 flex items-center justify-center gap-2 text-sm font-medium"
              aria-label="GitHub Repository"
            >
              <i className="fa-brands fa-github text-lg" aria-hidden="true"></i> GitHub
            </a>
          </div>
          
        </div>
        <div className="mt-8 border-t border-zinc-100 pt-8 flex items-center justify-between">
          <p className="text-center text-sm text-zinc-700">
            &copy; {currentYear} HTTT UEL Community. Built for K2005, K2006, K2007.
          </p>
          <div className="flex gap-4 text-sm text-zinc-700">
            <Link href="/privacy" className="hover:text-zinc-900">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-900">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      {/* Persistent top header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.webp" alt="居家整聊室" className="h-9 w-auto" />
          </Link>
          <Link
            href="/tidylist"
            className="text-sm text-gray-500 hover:text-sky-600 transition-colors"
          >
            瀏覽課程
          </Link>
        </div>
      </header>

      {children}
    </div>
  )
}

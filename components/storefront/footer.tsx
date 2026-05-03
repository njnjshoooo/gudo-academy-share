import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-lg mb-3">✨ GUDO Academy｜整聊學院</h3>
            <p className="text-sm leading-relaxed max-w-xs">
              整聊學院致力於透過整理與溝通的力量，幫助每個人打造更美好的生活空間與人際關係。
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-white transition-colors text-sm">LINE</a>
              <a href="#" className="hover:text-white transition-colors text-sm">Facebook</a>
              <a href="#" className="hover:text-white transition-colors text-sm">Instagram</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">課程</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tidylist" className="hover:text-white transition-colors">課程總覽</Link></li>
              <li><Link href="/tidylist?category=beginner" className="hover:text-white transition-colors">初階整聊</Link></li>
              <li><Link href="/tidylist?category=intermediate" className="hover:text-white transition-colors">中階整聊</Link></li>
              <li><Link href="/tidylist?category=advanced" className="hover:text-white transition-colors">高階整聊</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">關於</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ambassador" className="hover:text-white transition-colors">推廣大使計畫</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">關於我們</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">聯絡我們</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">服務條款</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">隱私政策</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
          <p>© {new Date().getFullYear()} GUDO Academy｜整聊學院 All rights reserved.</p>
          <p className="mt-1">
            推廣大使計畫依法開立扣繳憑單。<Link href="/affiliate-disclosure" className="underline hover:text-white">推廣揭露聲明</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

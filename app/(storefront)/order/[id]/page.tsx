import Link from 'next/link'
import { CheckCircle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '訂單確認' }

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string }>
}

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params
  const { success } = await searchParams

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center">
        {success ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">訂單已成立！</h1>
            <p className="text-gray-600 mb-2">
              訂單編號：<span className="font-mono font-bold text-sky-600">{id}</span>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              付款確認後，我們將寄送課程存取連結至您的 Email，請留意信箱。
            </p>
          </>
        ) : (
          <>
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-3">查詢訂單</h1>
            <p className="text-gray-600 mb-2">
              訂單編號：<span className="font-mono font-bold">{id}</span>
            </p>
          </>
        )}

        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 text-left">
          <h2 className="font-semibold text-gray-900 mb-3">接下來的步驟</h2>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-sky-100 text-sky-700 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">1</span>
              完成付款（如選擇 ATM / 超商，請於期限內繳費）
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-sky-100 text-sky-700 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">2</span>
              付款成功後，系統自動寄送課程存取連結至您的 Email
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-sky-100 text-sky-700 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">3</span>
              開始學習整聊課程，享受知識的力量！
            </li>
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="brand" size="lg" asChild>
            <Link href="/tidylist">繼續瀏覽課程</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">返回首頁</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

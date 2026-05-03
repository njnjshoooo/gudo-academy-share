import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { KycReviewPanel } from '@/components/admin/kyc-review-panel'

export const metadata: Metadata = { title: '大使 KYC 審核 | 管理後台' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function AmbassadorDetailPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/ambassadors"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC 審核</h1>
          <p className="text-gray-500 text-sm mt-0.5">大使 ID：{id}</p>
        </div>
      </div>
      <KycReviewPanel ambassadorId={id} />
    </div>
  )
}

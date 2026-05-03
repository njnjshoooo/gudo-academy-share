import { KycForm } from '@/components/ambassador/kyc-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'KYC 身份驗證' }

export default function KycPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KYC 身份驗證</h1>
        <p className="text-gray-500 text-sm mt-1">
          完成身份驗證後，即可取得專屬推廣代碼並開始推廣
        </p>
      </div>

      {/* Status Banner */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-xl">⏳</span>
        <div>
          <p className="font-semibold text-amber-800 text-sm">KYC 審核中</p>
          <p className="text-amber-700 text-xs mt-0.5">
            資料已提交，管理員審核通常需要 1-3 個工作天。審核結果將寄送至您的 Email。
          </p>
        </div>
      </div>

      <KycForm />
    </div>
  )
}

import type { Metadata } from 'next'
import { WithdrawForm } from '@/components/ambassador/withdraw-form'

export const metadata: Metadata = { title: '申請請款 | GUDO Academy' }

export default function WithdrawPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">申請請款</h1>
        <p className="text-gray-500 mt-1 text-sm">將您的可用分潤餘額提領至銀行帳戶</p>
      </div>
      <WithdrawForm />
    </div>
  )
}

import type { Metadata } from 'next'
import { EarningsTable } from '@/components/ambassador/earnings-table'

export const metadata: Metadata = { title: '分潤明細 | GUDO Academy' }

export default function EarningsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">分潤明細</h1>
        <p className="text-gray-500 mt-1 text-sm">查看所有推廣訂單的分潤記錄</p>
      </div>
      <EarningsTable />
    </div>
  )
}

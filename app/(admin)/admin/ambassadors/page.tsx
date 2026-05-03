import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '推廣大使管理' }

// Mock data
const ambassadors = [
  { id: '1', name: 'Angie 安琪', email: 'angie@example.com', referralCode: 'ANGIE001', status: 'ACTIVE', totalEarnings: 87600, submittedAt: '2026-04-01', approvedAt: '2026-04-03' },
  { id: '2', name: 'Lily 莉莉', email: 'lily@example.com', referralCode: 'LILY002', status: 'ACTIVE', totalEarnings: 45200, submittedAt: '2026-04-05', approvedAt: '2026-04-06' },
  { id: '3', name: 'Wang Ming', email: 'wang@example.com', referralCode: null, status: 'PENDING', totalEarnings: 0, submittedAt: '2026-05-03', approvedAt: null },
  { id: '4', name: 'Chen Wei', email: 'chen@example.com', referralCode: null, status: 'PENDING', totalEarnings: 0, submittedAt: '2026-05-02', approvedAt: null },
  { id: '5', name: 'Lin Fang', email: 'lin@example.com', referralCode: null, status: 'REJECTED', totalEarnings: 0, submittedAt: '2026-04-28', approvedAt: null },
]

const statusMap: Record<string, { label: string; variant: any }> = {
  PENDING: { label: '待審核', variant: 'warning' },
  ACTIVE: { label: '已核准', variant: 'success' },
  REJECTED: { label: '已拒絕', variant: 'destructive' },
  SUSPENDED: { label: '已停權', variant: 'secondary' },
}

export default function AdminAmbassadorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">推廣大使管理</h1>
          <p className="text-gray-500 text-sm mt-1">KYC 審核、帳號管理、業績查看</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-2 flex-wrap">
        {['全部', '待審核', '已核准', '已拒絕', '已停權'].map((status) => (
          <button
            key={status}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <th className="text-left px-5 py-3 font-medium">大使</th>
              <th className="text-left px-5 py-3 font-medium">推廣代碼</th>
              <th className="text-center px-5 py-3 font-medium">狀態</th>
              <th className="text-right px-5 py-3 font-medium">累積分潤</th>
              <th className="text-left px-5 py-3 font-medium">提交日期</th>
              <th className="text-center px-5 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ambassadors.map((amb) => {
              const statusInfo = statusMap[amb.status]
              return (
                <tr key={amb.id} className="hover:bg-gray-50 transition-colors text-sm">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{amb.name}</p>
                    <p className="text-xs text-gray-500">{amb.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    {amb.referralCode ? (
                      <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
                        {amb.referralCode}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">未取得</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-gray-900">
                    {formatCurrency(amb.totalEarnings)}
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-xs">{amb.submittedAt}</td>
                  <td className="px-5 py-4 text-center">
                    <Link
                      href={`/admin/ambassadors/${amb.id}`}
                      className="text-xs bg-sky-50 text-sky-700 hover:bg-sky-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      {amb.status === 'PENDING' ? '審核' : '查看'}
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

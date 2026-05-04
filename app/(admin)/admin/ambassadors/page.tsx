import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '推廣大使管理' }

const statusMap: Record<string, { label: string; variant: any }> = {
  PENDING:   { label: '待審核', variant: 'warning' },
  ACTIVE:    { label: '已核准', variant: 'success' },
  REJECTED:  { label: '已拒絕', variant: 'destructive' },
  SUSPENDED: { label: '已停權', variant: 'secondary' },
}

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function AdminAmbassadorsPage({ searchParams }: Props) {
  const { status, q } = await searchParams

  const ambassadors = await prisma.ambassador.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(q
        ? {
            OR: [
              { realName: { contains: q, mode: 'insensitive' } },
              { referralCode: { contains: q, mode: 'insensitive' } },
              { user: { email: { contains: q, mode: 'insensitive' } } },
            ],
          }
        : {}),
    },
    include: { user: true },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">推廣大使管理</h1>
          <p className="text-gray-500 text-sm mt-1">KYC 審核、帳號管理、業績查看</p>
        </div>
      </div>

      {/* Filters */}
      <form method="get" className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 flex-wrap items-center">
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="搜尋名稱、代碼、Email..."
          className="flex-1 min-w-48 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
        <div className="flex gap-2 flex-wrap">
          {[
            { value: '', label: '全部' },
            { value: 'PENDING', label: '待審核' },
            { value: 'ACTIVE', label: '已核准' },
            { value: 'REJECTED', label: '已拒絕' },
          ].map((opt) => (
            <Link
              key={opt.value}
              href={`/admin/ambassadors${opt.value ? `?status=${opt.value}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                (status ?? '') === opt.value
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
        <button type="submit" className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
          搜尋
        </button>
      </form>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <th className="text-left px-5 py-3 font-medium">大使</th>
              <th className="text-left px-5 py-3 font-medium">推廣代碼</th>
              <th className="text-center px-5 py-3 font-medium">狀態</th>
              <th className="text-right px-5 py-3 font-medium">累積分潤</th>
              <th className="text-left px-5 py-3 font-medium">申請日期</th>
              <th className="text-center px-5 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ambassadors.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  沒有符合條件的大使
                </td>
              </tr>
            ) : (
              ambassadors.map((amb) => {
                const statusInfo = statusMap[amb.status] ?? { label: amb.status, variant: 'secondary' }
                return (
                  <tr key={amb.id} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{amb.realName}</p>
                      <p className="text-xs text-gray-500">{amb.user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      {amb.status === 'ACTIVE' ? (
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
                      {formatCurrency(Number(amb.totalEarnings))}
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs">
                      {amb.createdAt.toISOString().slice(0, 10)}
                    </td>
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

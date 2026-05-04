import { prisma } from '@/lib/db'
import { WithdrawalActions } from '@/components/admin/withdrawal-actions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '撥款管理 | 管理後台' }

type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED'

const STATUS_LABEL: Record<WithdrawalStatus, string> = {
  PENDING:  '待審核',
  APPROVED: '已核准',
  PAID:     '已撥款',
  REJECTED: '已拒絕',
}

const STATUS_CLASS: Record<WithdrawalStatus, string> = {
  PENDING:  'bg-amber-100 text-amber-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  PAID:     'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function WithdrawalsPage({ searchParams }: Props) {
  const { status } = await searchParams

  const withdrawals = await prisma.withdrawal.findMany({
    where: status ? { status: status as any } : {},
    include: {
      ambassador: { include: { user: true } },
    },
    orderBy: { requestedAt: 'desc' },
    take: 50,
  })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [summaryPending, summaryApproved, summaryPaid] = await Promise.all([
    prisma.withdrawal.aggregate({ where: { status: 'PENDING' }, _sum: { netAmount: true } }),
    prisma.withdrawal.aggregate({ where: { status: 'APPROVED' }, _sum: { netAmount: true } }),
    prisma.withdrawal.aggregate({ where: { status: 'PAID', paidAt: { gte: startOfMonth } }, _sum: { netAmount: true } }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">撥款管理</h1>
        <p className="text-gray-500 mt-1 text-sm">審核推廣大使的請款申請並管理撥款</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">待審核金額</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            NT$ {Number(summaryPending._sum.netAmount ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">已核准待撥款</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            NT$ {Number(summaryApproved._sum.netAmount ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">本月已撥款</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            NT$ {Number(summaryPaid._sum.netAmount ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: '', label: '全部' },
          { value: 'PENDING', label: '待審核' },
          { value: 'APPROVED', label: '已核准' },
          { value: 'PAID', label: '已撥款' },
          { value: 'REJECTED', label: '已拒絕' },
        ].map((opt) => (
          <a
            key={opt.value}
            href={`/admin/withdrawals${opt.value ? `?status=${opt.value}` : ''}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              (status ?? '') === opt.value
                ? 'bg-sky-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-sky-50 hover:text-sky-700'
            }`}
          >
            {opt.label}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium">大使</th>
                <th className="text-right px-4 py-3 font-medium">請款金額</th>
                <th className="text-right px-4 py-3 font-medium">代扣稅款</th>
                <th className="text-right px-4 py-3 font-medium">實際撥款</th>
                <th className="text-left px-4 py-3 font-medium">收款帳戶</th>
                <th className="text-center px-4 py-3 font-medium">狀態</th>
                <th className="text-left px-4 py-3 font-medium">申請日期</th>
                <th className="text-center px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    目前沒有請款紀錄
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => {
                  const st = w.status as WithdrawalStatus
                  return (
                    <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm">{w.ambassador.realName}</p>
                        <p className="text-xs text-gray-500">{w.ambassador.user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        NT$ {Number(w.amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-amber-700">
                        {Number(w.taxAmount) > 0 ? `NT$ ${Number(w.taxAmount).toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        NT$ {Number(w.netAmount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <p>{w.bankCode}</p>
                        <p className="font-mono">{w.bankAccount} / {w.bankAccountName}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_CLASS[st]}`}>
                          {STATUS_LABEL[st]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {w.requestedAt.toISOString().slice(0, 10)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <WithdrawalActions withdrawalId={w.id} status={w.status} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = { title: '撥款管理 | 管理後台' }

type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED'

const MOCK_WITHDRAWALS = [
  {
    id: 'w001',
    ambassadorName: '整理達人 Angie',
    ambassadorEmail: 'angie@example.com',
    amount: 3198,
    taxAmount: 0,
    netAmount: 3198,
    bankCode: '004',
    bankBranch: '台北分行',
    bankAccount: '****5678',
    accountName: '陳安琪',
    status: 'PENDING' as WithdrawalStatus,
    submittedAt: '2025-05-20',
    note: '',
  },
  {
    id: 'w002',
    ambassadorName: '整潔生活 Bob',
    ambassadorEmail: 'bob@example.com',
    amount: 5400,
    taxAmount: 270,
    netAmount: 5130,
    bankCode: '012',
    bankBranch: '信義分行',
    bankAccount: '****9999',
    accountName: '王大明',
    status: 'APPROVED' as WithdrawalStatus,
    submittedAt: '2025-05-15',
    note: '',
  },
  {
    id: 'w003',
    ambassadorName: '整理師 Carol',
    ambassadorEmail: 'carol@example.com',
    amount: 12000,
    taxAmount: 600,
    netAmount: 11400,
    bankCode: '013',
    bankBranch: '南港分行',
    bankAccount: '****3456',
    accountName: '林小芳',
    status: 'PAID' as WithdrawalStatus,
    submittedAt: '2025-05-01',
    note: '',
  },
]

const STATUS_LABEL: Record<WithdrawalStatus, string> = {
  PENDING: '待審核',
  APPROVED: '已核准',
  PAID: '已撥款',
  REJECTED: '已拒絕',
}

const STATUS_CLASS: Record<WithdrawalStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export default function WithdrawalsPage() {
  const totalPending = MOCK_WITHDRAWALS.filter((w) => w.status === 'PENDING').reduce((s, w) => s + w.netAmount, 0)
  const totalApproved = MOCK_WITHDRAWALS.filter((w) => w.status === 'APPROVED').reduce((s, w) => s + w.netAmount, 0)
  const totalPaid = MOCK_WITHDRAWALS.filter((w) => w.status === 'PAID').reduce((s, w) => s + w.netAmount, 0)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">撥款管理</h1>
        <p className="text-gray-500 mt-1 text-sm">審核推廣大使的請款申請並管理撥款</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">待審核金額</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">NT$ {totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">已核准待撥款</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">NT$ {totalApproved.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">本月已撥款</p>
          <p className="text-2xl font-bold text-green-600 mt-1">NT$ {totalPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
              {MOCK_WITHDRAWALS.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 text-sm">{w.ambassadorName}</p>
                    <p className="text-xs text-gray-500">{w.ambassadorEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    NT$ {w.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-amber-700">
                    {w.taxAmount > 0 ? `NT$ ${w.taxAmount.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    NT$ {w.netAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <p>{w.bankCode} {w.bankBranch}</p>
                    <p className="font-mono">{w.bankAccount} / {w.accountName}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_CLASS[w.status]}`}>
                      {STATUS_LABEL[w.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{w.submittedAt}</td>
                  <td className="px-4 py-3 text-center">
                    {w.status === 'PENDING' && (
                      <div className="flex gap-1 justify-center">
                        <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors">
                          核准
                        </button>
                        <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                          拒絕
                        </button>
                      </div>
                    )}
                    {w.status === 'APPROVED' && (
                      <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
                        標記已撥款
                      </button>
                    )}
                    {(w.status === 'PAID' || w.status === 'REJECTED') && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

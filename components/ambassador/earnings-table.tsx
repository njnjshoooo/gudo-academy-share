'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

type CommissionStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED'

interface CommissionRecord {
  id: string
  orderId: string
  productName: string
  buyerName: string
  orderAmount: number
  commissionRate: number
  commissionAmount: number
  status: CommissionStatus
  createdAt: string
  paidAt?: string
}

const MOCK_RECORDS: CommissionRecord[] = [
  {
    id: 'c001',
    orderId: 'ORD-20250501-001',
    productName: '整聊初階課程',
    buyerName: '王小明',
    orderAmount: 3980,
    commissionRate: 10,
    commissionAmount: 398,
    status: 'PAID',
    createdAt: '2025-05-01',
    paidAt: '2025-05-15',
  },
  {
    id: 'c002',
    orderId: 'ORD-20250508-002',
    productName: '整聊中階課程',
    buyerName: '李大華',
    orderAmount: 6980,
    commissionRate: 10,
    commissionAmount: 698,
    status: 'CONFIRMED',
    createdAt: '2025-05-08',
  },
  {
    id: 'c003',
    orderId: 'ORD-20250515-003',
    productName: '整聊高階課程',
    buyerName: '陳美玲',
    orderAmount: 12800,
    commissionRate: 12,
    commissionAmount: 1536,
    status: 'PENDING',
    createdAt: '2025-05-15',
  },
  {
    id: 'c004',
    orderId: 'ORD-20250520-004',
    productName: '整聊初階課程',
    buyerName: '張大偉',
    orderAmount: 3980,
    commissionRate: 10,
    commissionAmount: 398,
    status: 'PENDING',
    createdAt: '2025-05-20',
  },
  {
    id: 'c005',
    orderId: 'ORD-20250415-005',
    productName: '整聊培訓營（進階班）',
    buyerName: '林小芳',
    orderAmount: 28000,
    commissionRate: 10,
    commissionAmount: 2800,
    status: 'PAID',
    createdAt: '2025-04-15',
    paidAt: '2025-04-30',
  },
]

const STATUS_MAP: Record<CommissionStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  PENDING: { label: '待確認', variant: 'secondary' },
  CONFIRMED: { label: '已確認', variant: 'default' },
  PAID: { label: '已撥款', variant: 'default' },
  CANCELLED: { label: '已取消', variant: 'destructive' },
}

const FILTERS: { label: string; value: CommissionStatus | 'ALL' }[] = [
  { label: '全部', value: 'ALL' },
  { label: '待確認', value: 'PENDING' },
  { label: '已確認', value: 'CONFIRMED' },
  { label: '已撥款', value: 'PAID' },
  { label: '已取消', value: 'CANCELLED' },
]

export function EarningsTable() {
  const [filter, setFilter] = useState<CommissionStatus | 'ALL'>('ALL')

  const filtered = filter === 'ALL' ? MOCK_RECORDS : MOCK_RECORDS.filter((r) => r.status === filter)

  const totalPending = MOCK_RECORDS.filter((r) => r.status === 'PENDING' || r.status === 'CONFIRMED')
    .reduce((s, r) => s + r.commissionAmount, 0)
  const totalPaid = MOCK_RECORDS.filter((r) => r.status === 'PAID')
    .reduce((s, r) => s + r.commissionAmount, 0)

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">累積分潤</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            NT$ {(totalPending + totalPaid).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">已撥款</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            NT$ {totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">待撥款</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            NT$ {totalPending.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">分潤筆數</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {MOCK_RECORDS.length} 筆
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.value
                  ? 'border-b-2 border-sky-500 text-sky-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="text-left px-4 py-3 font-medium">訂單編號</th>
                <th className="text-left px-4 py-3 font-medium">課程名稱</th>
                <th className="text-left px-4 py-3 font-medium">購買者</th>
                <th className="text-right px-4 py-3 font-medium">訂單金額</th>
                <th className="text-right px-4 py-3 font-medium">分潤比例</th>
                <th className="text-right px-4 py-3 font-medium">分潤金額</th>
                <th className="text-center px-4 py-3 font-medium">狀態</th>
                <th className="text-left px-4 py-3 font-medium">日期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    目前沒有符合條件的記錄
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{record.orderId}</td>
                    <td className="px-4 py-3 text-gray-900">{record.productName}</td>
                    <td className="px-4 py-3 text-gray-600">{record.buyerName}</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      NT$ {record.orderAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{record.commissionRate}%</td>
                    <td className="px-4 py-3 text-right font-semibold text-sky-700">
                      NT$ {record.commissionAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={STATUS_MAP[record.status].variant}
                        className={
                          record.status === 'PAID'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : record.status === 'CONFIRMED'
                            ? 'bg-sky-100 text-sky-700 border-sky-200'
                            : record.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        }
                      >
                        {STATUS_MAP[record.status].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      <div>{record.createdAt}</div>
                      {record.paidAt && (
                        <div className="text-green-600">撥款：{record.paidAt}</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

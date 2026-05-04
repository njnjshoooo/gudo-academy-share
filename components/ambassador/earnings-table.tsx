'use client'

import { useState } from 'react'

type CommissionStatus = 'LOCKED' | 'AVAILABLE' | 'REQUESTED' | 'PAID' | 'CANCELLED'

export interface CommissionRecord {
  id: string
  orderNumber: string
  productName: string
  buyerName: string
  orderAmount: number
  commissionAmount: number
  status: CommissionStatus
  createdAt: string
  unlockAt: string
}

const STATUS_MAP: Record<CommissionStatus, { label: string; className: string }> = {
  LOCKED:    { label: '凍結中',  className: 'bg-amber-100 text-amber-700 border-amber-200' },
  AVAILABLE: { label: '可請款',  className: 'bg-green-100 text-green-700 border-green-200' },
  REQUESTED: { label: '已申請',  className: 'bg-sky-100 text-sky-700 border-sky-200' },
  PAID:      { label: '已撥款',  className: 'bg-gray-100 text-gray-600 border-gray-200' },
  CANCELLED: { label: '已取消',  className: 'bg-red-100 text-red-700 border-red-200' },
}

const FILTERS: { label: string; value: CommissionStatus | 'ALL' }[] = [
  { label: '全部', value: 'ALL' },
  { label: '凍結中', value: 'LOCKED' },
  { label: '可請款', value: 'AVAILABLE' },
  { label: '已申請', value: 'REQUESTED' },
  { label: '已撥款', value: 'PAID' },
]

interface Props {
  records: CommissionRecord[]
  totalEarnings: number
  paidEarnings: number
  availableEarnings: number
}

export function EarningsTable({ records, totalEarnings, paidEarnings, availableEarnings }: Props) {
  const [filter, setFilter] = useState<CommissionStatus | 'ALL'>('ALL')

  const filtered = filter === 'ALL' ? records : records.filter((r) => r.status === filter)

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">累積分潤</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">NT$ {totalEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">已撥款</p>
          <p className="text-2xl font-bold text-green-600 mt-1">NT$ {paidEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">可請款</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">NT$ {availableEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">分潤筆數</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{records.length} 筆</p>
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
                <th className="text-right px-4 py-3 font-medium">分潤金額</th>
                <th className="text-center px-4 py-3 font-medium">狀態</th>
                <th className="text-left px-4 py-3 font-medium">日期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    目前沒有符合條件的記錄
                  </td>
                </tr>
              ) : (
                filtered.map((record) => {
                  const statusInfo = STATUS_MAP[record.status]
                  return (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{record.orderNumber}</td>
                      <td className="px-4 py-3 text-gray-900 max-w-[160px]">
                        <p className="line-clamp-2 leading-snug">{record.productName}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{record.buyerName}</td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        NT$ {record.orderAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-sky-700">
                        NT$ {record.commissionAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        <div>{record.createdAt}</div>
                        {record.status === 'LOCKED' && (
                          <div className="text-amber-600">解鎖：{record.unlockAt}</div>
                        )}
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

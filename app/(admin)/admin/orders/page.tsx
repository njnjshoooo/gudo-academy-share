import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '訂單管理' }

const orders = [
  { id: '1', orderNumber: 'ORD20260503001', customerName: '王小明', email: 'wang@example.com', product: '整聊初階認證課程', total: 27000, paymentMethod: 'CREDIT_CARD', paymentStatus: 'PAID', status: 'COMPLETED', ambassador: 'ANGIE001', commission: 2700, createdAt: '2026-05-03' },
  { id: '2', orderNumber: 'ORD20260503002', customerName: '陳大明', email: 'chen@example.com', product: '整聊高階師資培訓', total: 72000, paymentMethod: 'ATM', paymentStatus: 'PAID', status: 'PAID', ambassador: null, commission: 0, createdAt: '2026-05-03' },
  { id: '3', orderNumber: 'ORD20260502001', customerName: '林小芳', email: 'lin@example.com', product: '整聊中階進階課程', total: 38000, paymentMethod: 'CREDIT_CARD', paymentStatus: 'PAID', status: 'COMPLETED', ambassador: 'LILY002', commission: 4560, createdAt: '2026-05-02' },
]

const orderStatusMap: Record<string, { label: string; variant: any }> = {
  PENDING: { label: '待付款', variant: 'secondary' },
  PAID: { label: '已付款', variant: 'brand' },
  PROCESSING: { label: '處理中', variant: 'default' },
  SHIPPED: { label: '已出貨', variant: 'default' },
  COMPLETED: { label: '已完成', variant: 'success' },
  CANCELLED: { label: '已取消', variant: 'secondary' },
  REFUNDED: { label: '已退款', variant: 'destructive' },
}

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">訂單管理</h1>
        <p className="text-gray-500 text-sm mt-1">查看所有訂單、更新狀態、處理退款</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 flex-wrap">
        <input
          type="search"
          placeholder="搜尋訂單編號、客戶名稱、Email..."
          className="flex-1 min-w-48 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none">
          <option value="">全部狀態</option>
          <option value="PENDING">待付款</option>
          <option value="PAID">已付款</option>
          <option value="COMPLETED">已完成</option>
          <option value="REFUNDED">已退款</option>
        </select>
        <input type="date" className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <th className="text-left px-5 py-3 font-medium">訂單編號</th>
              <th className="text-left px-5 py-3 font-medium">客戶</th>
              <th className="text-left px-5 py-3 font-medium">商品</th>
              <th className="text-right px-5 py-3 font-medium">金額</th>
              <th className="text-left px-5 py-3 font-medium">推廣大使</th>
              <th className="text-right px-5 py-3 font-medium">分潤</th>
              <th className="text-center px-5 py-3 font-medium">狀態</th>
              <th className="text-center px-5 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => {
              const statusInfo = orderStatusMap[order.status]
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors text-sm">
                  <td className="px-5 py-4">
                    <p className="font-mono text-xs text-gray-600">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.createdAt}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-gray-700 max-w-[160px] line-clamp-2">{order.product}</p>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-sky-600">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-5 py-4">
                    {order.ambassador ? (
                      <span className="font-mono text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                        {order.ambassador}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">直接購買</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {order.commission > 0 ? (
                      <span className="text-green-600 font-medium">{formatCurrency(order.commission)}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition-colors">
                      詳情
                    </button>
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

import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: '我的訂單 | GUDO Academy' }

type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'

const MOCK_ORDERS = [
  {
    id: 'ORD-20250501-001',
    productName: '整聊初階課程',
    buyerName: '王小明',
    amount: 3980,
    commission: 398,
    status: 'PAID' as OrderStatus,
    createdAt: '2025-05-01',
  },
  {
    id: 'ORD-20250508-002',
    productName: '整聊中階課程',
    buyerName: '李大華',
    amount: 6980,
    commission: 698,
    status: 'PAID' as OrderStatus,
    createdAt: '2025-05-08',
  },
  {
    id: 'ORD-20250515-003',
    productName: '整聊高階課程',
    buyerName: '陳美玲',
    amount: 12800,
    commission: 1536,
    status: 'PENDING' as OrderStatus,
    createdAt: '2025-05-15',
  },
  {
    id: 'ORD-20250520-004',
    productName: '整聊初階課程',
    buyerName: '張大偉',
    amount: 3980,
    commission: 398,
    status: 'PENDING' as OrderStatus,
    createdAt: '2025-05-20',
  },
]

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: '待付款',
  PAID: '已付款',
  CANCELLED: '已取消',
  REFUNDED: '已退款',
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  REFUNDED: 'bg-red-100 text-red-700',
}

export default function AmbassadorOrdersPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的訂單</h1>
        <p className="text-gray-500 mt-1 text-sm">透過您的推廣連結產生的所有訂單</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium">訂單編號</th>
                <th className="text-left px-4 py-3 font-medium">課程</th>
                <th className="text-left px-4 py-3 font-medium">購買者</th>
                <th className="text-right px-4 py-3 font-medium">金額</th>
                <th className="text-right px-4 py-3 font-medium">我的分潤</th>
                <th className="text-center px-4 py-3 font-medium">狀態</th>
                <th className="text-left px-4 py-3 font-medium">日期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{order.id}</td>
                  <td className="px-4 py-3 text-gray-900">{order.productName}</td>
                  <td className="px-4 py-3 text-gray-600">{order.buyerName}</td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    NT$ {order.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-sky-700">
                    NT$ {order.commission.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_CLASS[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

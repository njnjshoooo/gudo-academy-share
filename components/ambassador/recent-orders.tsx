import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  productName: string
  customerMasked: string
  orderTotal: number
  commissionRate: number
  commissionAmount: number
  orderStatus: string
  commissionStatus: string
}

interface Props {
  orders: Order[]
}

const commissionStatusVariant: Record<string, any> = {
  凍結中: 'warning',
  可請款: 'success',
  已申請: 'default',
  已撥款: 'secondary',
}

const orderStatusVariant: Record<string, any> = {
  已完成: 'success',
  已出貨: 'default',
  已付款: 'brand',
  已退款: 'destructive',
}

export function RecentOrders({ orders }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">最近訂單</h2>
        <Link
          href="/ambassador/orders"
          className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1"
        >
          查看全部 <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-100">
              <th className="text-left px-5 py-3 font-medium">訂單編號</th>
              <th className="text-left px-5 py-3 font-medium">商品</th>
              <th className="text-left px-5 py-3 font-medium">客戶</th>
              <th className="text-right px-5 py-3 font-medium">訂單金額</th>
              <th className="text-right px-5 py-3 font-medium">分潤</th>
              <th className="text-center px-5 py-3 font-medium">訂單狀態</th>
              <th className="text-center px-5 py-3 font-medium">撥款狀態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors text-sm">
                <td className="px-5 py-4">
                  <span className="font-mono text-xs text-gray-600">{order.orderNumber}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{order.createdAt}</p>
                </td>
                <td className="px-5 py-4 max-w-[160px]">
                  <p className="font-medium text-gray-900 line-clamp-2 text-xs leading-snug">
                    {order.productName}
                  </p>
                </td>
                <td className="px-5 py-4 text-gray-600">{order.customerMasked}</td>
                <td className="px-5 py-4 text-right font-medium text-gray-900">
                  {formatCurrency(order.orderTotal)}
                </td>
                <td className="px-5 py-4 text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(order.commissionAmount)}</p>
                  {order.commissionRate > 0 && (
                    <p className="text-xs text-gray-400">{order.commissionRate}%</p>
                  )}
                </td>
                <td className="px-5 py-4 text-center">
                  <Badge variant={orderStatusVariant[order.orderStatus] || 'secondary'}>
                    {order.orderStatus}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-center">
                  <Badge variant={commissionStatusVariant[order.commissionStatus] || 'secondary'}>
                    {order.commissionStatus}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

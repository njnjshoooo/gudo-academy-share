import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '訂單管理' }

const orderStatusMap: Record<string, { label: string; variant: any }> = {
  PENDING:    { label: '待付款', variant: 'secondary' },
  PAID:       { label: '已付款', variant: 'brand' },
  PROCESSING: { label: '處理中', variant: 'default' },
  SHIPPED:    { label: '已出貨', variant: 'default' },
  COMPLETED:  { label: '已完成', variant: 'success' },
  CANCELLED:  { label: '已取消', variant: 'secondary' },
  REFUNDED:   { label: '已退款', variant: 'destructive' },
}

const paymentMethodMap: Record<string, string> = {
  CREDIT_CARD: '信用卡',
  ATM: 'ATM',
  CVS: '超商',
}

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status, q } = await searchParams

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(q
        ? {
            OR: [
              { orderNumber: { contains: q, mode: 'insensitive' } },
              { customerName: { contains: q, mode: 'insensitive' } },
              { customerEmail: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      items: { take: 1 },
      commission: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">訂單管理</h1>
        <p className="text-gray-500 text-sm mt-1">查看所有訂單、更新狀態、處理退款</p>
      </div>

      {/* Filters */}
      <form method="get" className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 flex-wrap">
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="搜尋訂單編號、客戶名稱、Email..."
          className="flex-1 min-w-48 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
        <select
          name="status"
          defaultValue={status || ''}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
        >
          <option value="">全部狀態</option>
          <option value="PENDING">待付款</option>
          <option value="PAID">已付款</option>
          <option value="COMPLETED">已完成</option>
          <option value="REFUNDED">已退款</option>
        </select>
        <button type="submit" className="text-sm bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors">
          搜尋
        </button>
      </form>

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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  沒有符合條件的訂單
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const statusInfo = orderStatusMap[order.status] ?? { label: order.status, variant: 'secondary' }
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs text-gray-600">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{order.createdAt.toISOString().slice(0, 10)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-700 max-w-[160px] line-clamp-2">
                        {order.items[0]?.productName ?? '多項商品'}
                      </p>
                      <p className="text-xs text-gray-400">{paymentMethodMap[order.paymentMethod] ?? order.paymentMethod}</p>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-sky-600">
                      {formatCurrency(Number(order.total))}
                    </td>
                    <td className="px-5 py-4">
                      {order.referralCode ? (
                        <span className="font-mono text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                          {order.referralCode}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">直接購買</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {order.commission ? (
                        <span className="text-green-600 font-medium text-sm">
                          {formatCurrency(Number(order.commission.amount))}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
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

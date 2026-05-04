import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { DashboardStats } from '@/components/ambassador/dashboard-stats'
import { RecentOrders } from '@/components/ambassador/recent-orders'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '大使儀表板' }

const ORDER_STATUS_MAP: Record<string, string> = {
  PENDING: '待付款', PAID: '已付款', PROCESSING: '處理中',
  SHIPPED: '已出貨', COMPLETED: '已完成', CANCELLED: '已取消', REFUNDED: '已退款',
}
const COMMISSION_STATUS_MAP: Record<string, string> = {
  LOCKED: '凍結中', AVAILABLE: '可請款', REQUESTED: '已申請',
  PAID: '已撥款', CANCELLED: '已取消',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const ambassador = await prisma.ambassador.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      commissions: {
        include: { order: { include: { items: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!ambassador) redirect('/ambassador/kyc')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [monthlyCommissions, monthlyClicks, monthlyConversions] = await Promise.all([
    prisma.commission.findMany({
      where: { ambassadorId: ambassador.id, createdAt: { gte: startOfMonth } },
    }),
    prisma.referralClick.count({
      where: { ambassadorId: ambassador.id, createdAt: { gte: startOfMonth } },
    }),
    prisma.referralClick.count({
      where: { ambassadorId: ambassador.id, createdAt: { gte: startOfMonth }, convertedToOrder: true },
    }),
  ])

  const monthlyEarnings = monthlyCommissions.reduce((sum, c) => sum + Number(c.amount), 0)

  const stats = {
    monthlyEarnings,
    totalEarnings: Number(ambassador.totalEarnings),
    availableEarnings: Number(ambassador.availableEarnings),
    pendingEarnings: Number(ambassador.pendingEarnings),
    monthlyClicks,
    monthlyConversions,
    conversionRate: monthlyClicks > 0 ? (monthlyConversions / monthlyClicks) * 100 : 0,
  }

  const recentOrders = ambassador.commissions.slice(0, 5).map((c) => {
    const order = c.order
    const firstItem = order.items[0]
    const name = order.customerName
    const masked = name.length >= 2 ? name[0] + '**' : name + '**'
    return {
      id: c.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString().slice(0, 10),
      productName: firstItem?.productName ?? '（多項商品）',
      customerMasked: masked,
      orderTotal: Number(order.total),
      commissionRate: c.rate ? Number(c.rate) * 100 : 0,
      commissionAmount: Number(c.amount),
      orderStatus: ORDER_STATUS_MAP[order.status] ?? order.status,
      commissionStatus: COMMISSION_STATUS_MAP[c.status] ?? c.status,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">儀表板</h1>
        <p className="text-gray-500 text-sm mt-1">
          推廣代碼：
          <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
            {ambassador.referralCode}
          </span>
        </p>
      </div>
      <DashboardStats stats={stats} />
      <RecentOrders orders={recentOrders} />
    </div>
  )
}

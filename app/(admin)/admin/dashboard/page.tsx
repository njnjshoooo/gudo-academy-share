import { prisma } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { ShoppingBag, Users, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '管理員儀表板' }

export default async function AdminDashboardPage() {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    todayOrders,
    todayRevenue,
    totalAmbassadors,
    newAmbassadorsToday,
    pendingKyc,
    pendingWithdrawals,
    recentPendingKyc,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: startOfToday }, paymentStatus: 'PAID' } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfToday }, paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
    prisma.ambassador.count({ where: { status: 'ACTIVE' } }),
    prisma.ambassador.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.ambassador.count({ where: { status: 'PENDING' } }),
    prisma.withdrawal.count({ where: { status: 'PENDING' } }),
    prisma.ambassador.findMany({
      where: { status: 'PENDING' },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        items: { take: 1 },
        commission: true,
      },
    }),
  ])

  const stats = {
    todayRevenue: Number(todayRevenue._sum.total ?? 0),
    todayOrders,
    newAmbassadors: newAmbassadorsToday,
    totalAmbassadors,
    pendingKyc,
    pendingWithdrawals,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">管理員儀表板</h1>
        <p className="text-gray-500 text-sm mt-1">
          {now.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '今日營收', value: formatCurrency(stats.todayRevenue), icon: TrendingUp, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: '今日訂單', value: `${stats.todayOrders} 筆`, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '新增大使', value: `${stats.newAmbassadors} 人`, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: '大使總數', value: `${stats.totalAmbassadors} 人`, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <div className={`${card.bg} p-2 rounded-lg`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Pending Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: '待審核 KYC', count: stats.pendingKyc, href: '/admin/ambassadors?status=pending', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: '待撥款請款', count: stats.pendingWithdrawals, href: '/admin/withdrawals?status=pending', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center justify-between bg-white rounded-xl border ${item.border} p-4 hover:shadow-sm transition-shadow group`}
          >
            <div className="flex items-center gap-3">
              <div className={`${item.bg} p-2 rounded-lg`}>
                <AlertCircle className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending KYC */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">待審核 KYC</h2>
            <Link href="/admin/ambassadors?status=pending" className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPendingKyc.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">目前無待審核申請</p>
            ) : (
              recentPendingKyc.map((amb) => (
                <div key={amb.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{amb.realName}</p>
                    <p className="text-xs text-gray-500">{amb.user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{amb.createdAt.toISOString().slice(0, 10)}</span>
                    <Link
                      href={`/admin/ambassadors/${amb.id}`}
                      className="text-xs bg-sky-50 text-sky-700 hover:bg-sky-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      審核
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">最新訂單</h2>
            <Link href="/admin/orders" className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">尚無訂單</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                        {order.referralCode && (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-mono">
                            {order.referralCode}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {order.items[0]?.productName ?? '多項商品'} • {order.orderNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sky-600 text-sm">{formatCurrency(Number(order.total))}</p>
                      <Badge
                        variant={order.status === 'COMPLETED' ? 'success' : order.status === 'PAID' ? 'brand' : 'secondary'}
                        className="text-xs mt-0.5"
                      >
                        {order.status === 'COMPLETED' ? '已完成' : order.status === 'PAID' ? '已付款' : order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

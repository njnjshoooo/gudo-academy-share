import { DashboardStats } from '@/components/ambassador/dashboard-stats'
import { RecentOrders } from '@/components/ambassador/recent-orders'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '大使儀表板' }

// Mock data for development
const mockStats = {
  monthlyEarnings: 12500,
  totalEarnings: 87600,
  availableEarnings: 18200,
  pendingEarnings: 4800,
  monthlyClicks: 342,
  monthlyConversions: 7,
  conversionRate: 2.05,
  referralCode: 'ANGIE001',
}

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD20260503001',
    createdAt: '2026-05-03',
    productName: '整聊初階認證課程',
    customerMasked: '王**',
    orderTotal: 27000,
    commissionRate: 10,
    commissionAmount: 2700,
    orderStatus: '已完成',
    commissionStatus: '可請款',
  },
  {
    id: '2',
    orderNumber: 'ORD20260428002',
    createdAt: '2026-04-28',
    productName: '整聊中階進階課程',
    customerMasked: '陳**',
    orderTotal: 38000,
    commissionRate: 12,
    commissionAmount: 4560,
    orderStatus: '已完成',
    commissionStatus: '凍結中',
  },
  {
    id: '3',
    orderNumber: 'ORD20260420003',
    createdAt: '2026-04-20',
    productName: '整聊高階師資培訓',
    customerMasked: '李**',
    orderTotal: 72000,
    commissionRate: 0,
    commissionAmount: 5000,
    orderStatus: '已完成',
    commissionStatus: '可請款',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">儀表板</h1>
        <p className="text-gray-500 text-sm mt-1">
          推廣代碼：
          <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
            {mockStats.referralCode}
          </span>
        </p>
      </div>

      <DashboardStats stats={mockStats} />
      <RecentOrders orders={mockOrders} />
    </div>
  )
}

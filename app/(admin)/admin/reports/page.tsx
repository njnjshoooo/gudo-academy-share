import type { Metadata } from 'next'
import { TrendingUp, Users, ShoppingBag, DollarSign, BarChart2 } from 'lucide-react'

export const metadata: Metadata = { title: '報表中心 | 管理後台' }

const MONTHLY_DATA = [
  { month: '2025-01', revenue: 58900, orders: 22, commissions: 5890, ambassadors: 8 },
  { month: '2025-02', revenue: 42300, orders: 16, commissions: 4230, ambassadors: 10 },
  { month: '2025-03', revenue: 76400, orders: 29, commissions: 7640, ambassadors: 12 },
  { month: '2025-04', revenue: 91200, orders: 35, commissions: 9120, ambassadors: 15 },
  { month: '2025-05', revenue: 65800, orders: 24, commissions: 6580, ambassadors: 18 },
]

const TOP_AMBASSADORS = [
  { name: '整理達人 Angie', code: 'ANGIE001', revenue: 28900, commission: 2890, orders: 11 },
  { name: '整潔生活 Bob', code: 'BOB2024', revenue: 19600, commission: 1960, orders: 7 },
  { name: '整理師 Carol', code: 'CAROL88', revenue: 15300, commission: 1836, orders: 5 },
  { name: '清爽宅 Dave', code: 'DAVE007', revenue: 8900, commission: 890, orders: 3 },
]

const TOP_PRODUCTS = [
  { name: '整聊培訓營（進階班）', sold: 12, revenue: 336000 },
  { name: '整聊高階課程', sold: 18, revenue: 230400 },
  { name: '整聊中階課程', sold: 31, revenue: 216380 },
  { name: '整聊初階課程', sold: 54, revenue: 214920 },
  { name: '整聊軟裝整理班', sold: 9, revenue: 98100 },
]

const maxRevenue = Math.max(...MONTHLY_DATA.map((d) => d.revenue))

export default function ReportsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">報表中心</h1>
        <p className="text-gray-500 mt-1 text-sm">平台整體業績、推廣大使與商品分析</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500">本月營收</p>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">NT$ 65,800</p>
          <p className="text-xs text-green-600 mt-1">↑ 15.4% 較上月</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500">本月訂單</p>
            <ShoppingBag className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">24 筆</p>
          <p className="text-xs text-red-500 mt-1">↓ 31.4% 較上月</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500">本月分潤</p>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">NT$ 6,580</p>
          <p className="text-xs text-red-500 mt-1">↓ 27.8% 較上月</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500">活躍大使</p>
            <Users className="w-4 h-4 text-violet-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">18 人</p>
          <p className="text-xs text-green-600 mt-1">↑ 20% 較上月</p>
        </div>
      </div>

      {/* Monthly revenue bar chart */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <BarChart2 className="w-4 h-4 text-sky-500" /> 月營收趨勢
        </h2>
        <div className="flex items-end gap-3 h-48">
          {MONTHLY_DATA.map((d) => {
            const height = Math.round((d.revenue / maxRevenue) * 100)
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-xs font-semibold text-gray-700">
                  NT${(d.revenue / 1000).toFixed(0)}K
                </p>
                <div className="w-full relative">
                  <div
                    className="bg-sky-500 rounded-t-md transition-all"
                    style={{ height: `${height * 1.5}px` }}
                  />
                </div>
                <p className="text-xs text-gray-400">{d.month.slice(5)}月</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top ambassadors */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900 text-sm">推廣大使排行（累積）</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_AMBASSADORS.map((amb, i) => (
              <div key={amb.code} className="px-6 py-3 flex items-center gap-4">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-amber-100 text-amber-700' :
                  i === 1 ? 'bg-gray-100 text-gray-700' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{amb.name}</p>
                  <p className="text-xs text-gray-400">{amb.orders} 筆訂單</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sky-700 text-sm">NT$ {amb.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">分潤 {amb.commission.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900 text-sm">熱門商品（累積銷售）</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="px-6 py-3 flex items-center gap-4">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-amber-100 text-amber-700' :
                  i === 1 ? 'bg-gray-100 text-gray-700' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">已售 {p.sold} 件</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">NT$ {(p.revenue / 10000).toFixed(1)}萬</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

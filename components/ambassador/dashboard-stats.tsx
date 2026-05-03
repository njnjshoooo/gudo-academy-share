import { formatCurrency } from '@/lib/utils'
import { TrendingUp, DollarSign, Clock, Wallet, MousePointer, ShoppingBag, BarChart2 } from 'lucide-react'

interface Stats {
  monthlyEarnings: number
  totalEarnings: number
  availableEarnings: number
  pendingEarnings: number
  monthlyClicks: number
  monthlyConversions: number
  conversionRate: number
}

interface Props {
  stats: Stats
}

export function DashboardStats({ stats }: Props) {
  const cards = [
    {
      title: '本月分潤',
      value: formatCurrency(stats.monthlyEarnings),
      icon: TrendingUp,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      title: '累積總分潤',
      value: formatCurrency(stats.totalEarnings),
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: '可請款餘額',
      value: formatCurrency(stats.availableEarnings),
      icon: Wallet,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: '凍結中',
      value: formatCurrency(stats.pendingEarnings),
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      hint: '訂單退貨期過後自動解鎖',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Earnings Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{card.title}</span>
              <div className={`${card.bg} p-2 rounded-lg`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            {card.hint && <p className="text-xs text-gray-400 mt-1">{card.hint}</p>}
          </div>
        ))}
      </div>

      {/* Traffic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl">
            <MousePointer className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.monthlyClicks.toLocaleString()}</p>
            <p className="text-sm text-gray-500">本月點擊數</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.monthlyConversions}</p>
            <p className="text-sm text-gray-500">本月成交數</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="bg-violet-50 p-3 rounded-xl">
            <BarChart2 className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">轉換率</p>
          </div>
        </div>
      </div>
    </div>
  )
}

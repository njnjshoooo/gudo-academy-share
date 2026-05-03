'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  BarChart2,
  Settings,
  Tag,
  ChevronLeft,
  Home,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: '儀表板' },
  { href: '/admin/products', icon: Package, label: '商品管理' },
  { href: '/admin/categories', icon: Tag, label: '分類管理' },
  { href: '/admin/orders', icon: ShoppingBag, label: '訂單管理' },
  { href: '/admin/ambassadors', icon: Users, label: '推廣大使' },
  { href: '/admin/withdrawals', icon: CreditCard, label: '撥款管理' },
  { href: '/admin/reports', icon: BarChart2, label: '報表中心' },
  { href: '/admin/settings', icon: Settings, label: '系統設定' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'bg-gray-900 text-gray-300 flex flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className={cn('flex items-center h-16 px-4 border-b border-gray-800', collapsed && 'justify-center')}>
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <span className="font-bold text-white text-sm">管理員後台</span>
          </div>
        ) : (
          <Shield className="w-5 h-5 text-sky-400" />
        )}
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-2 border-t border-gray-800 space-y-0.5">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-800 hover:text-white transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <Home className="w-4 h-4" />
          {!collapsed && '返回商店'}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-800 transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && '收合選單'}
        </button>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Link2,
  ShoppingBag,
  DollarSign,
  CreditCard,
  FileText,
  User,
  ChevronLeft,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: '儀表板' },
  { href: '/ambassador/products', icon: Link2, label: '推廣專區' },
  { href: '/ambassador/orders', icon: ShoppingBag, label: '我的訂單' },
  { href: '/ambassador/earnings', icon: DollarSign, label: '分潤明細' },
  { href: '/ambassador/withdraw', icon: CreditCard, label: '申請請款' },
  { href: '/ambassador/templates', icon: FileText, label: '文案模板' },
  { href: '/ambassador/profile', icon: User, label: '個人資料' },
]

export function AmbassadorSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-100 flex flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-gray-100', collapsed && 'justify-center')}>
        {!collapsed && (
          <Link href="/" className="font-bold text-sky-600 text-sm">
            ✨ GUDO Academy
          </Link>
        )}
        {collapsed && <span className="text-xl">✨</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
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

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 space-y-0.5">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <Home className="w-4 h-4" />
          {!collapsed && '返回商店'}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-50 transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && '收合'}
        </button>
      </div>
    </aside>
  )
}

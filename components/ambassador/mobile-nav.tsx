'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Link2, DollarSign, CreditCard, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const bottomNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: '首頁' },
  { href: '/ambassador/products', icon: Link2, label: '推廣' },
  { href: '/ambassador/earnings', icon: DollarSign, label: '分潤' },
  { href: '/ambassador/withdraw', icon: CreditCard, label: '請款' },
  { href: '/ambassador/profile', icon: User, label: '我的' },
]

export function AmbassadorMobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe">
      <div className="grid grid-cols-5 h-16">
        {bottomNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 transition-colors',
                isActive
                  ? 'text-sky-600'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

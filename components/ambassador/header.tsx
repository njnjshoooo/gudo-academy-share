'use client'

import { Bell, ChevronDown, LogOut, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export function AmbassadorHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="h-14 lg:h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6">
      {/* Mobile: Logo */}
      <Link href="/" className="lg:hidden flex items-center">
        <img src="/logo.webp" alt="居家整聊室" className="h-8 w-auto" />
      </Link>

      {/* Desktop: Breadcrumb placeholder */}
      <div className="hidden lg:block">
        {/* Breadcrumb rendered per-page */}
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 py-1.5 px-2 lg:px-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-100 shadow-lg z-20 py-1">
                <a
                  href="/ambassador/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="w-4 h-4" />
                  個人資料
                </a>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  登出
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

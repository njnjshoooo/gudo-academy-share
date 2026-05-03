import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = { title: '登入' }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-sky-600 inline-flex items-center gap-2">
            <span>✨</span> GUDO Academy
          </Link>
          <p className="text-gray-500 mt-2">整聊學院會員登入</p>
        </div>
        <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-2xl" />}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-gray-500 mt-6">
          還沒有帳號？{' '}
          <Link href="/register" className="text-sky-600 font-medium hover:underline">
            立即申請成為推廣大使
          </Link>
        </p>
      </div>
    </div>
  )
}

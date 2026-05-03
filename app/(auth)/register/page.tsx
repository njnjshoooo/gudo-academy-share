import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '申請成為推廣大使' }

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-sky-600 inline-flex items-center gap-2">
            <span>✨</span> GUDO Academy
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-3">申請成為推廣大使</h1>
          <p className="text-gray-500 mt-1 text-sm">
            完成基本註冊後，提交 KYC 資料即可開始推廣
          </p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-gray-500 mt-6">
          已有帳號？{' '}
          <Link href="/login" className="text-sky-600 font-medium hover:underline">
            立即登入
          </Link>
        </p>
      </div>
    </div>
  )
}

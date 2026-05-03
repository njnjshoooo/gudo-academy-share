import type { Metadata } from 'next'
import { ProfileForm } from '@/components/ambassador/profile-form'

export const metadata: Metadata = { title: '個人資料 | GUDO Academy' }

export default function ProfilePage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">個人資料</h1>
        <p className="text-gray-500 mt-1 text-sm">管理您的帳號資訊與通知設定</p>
      </div>
      <ProfileForm />
    </div>
  )
}

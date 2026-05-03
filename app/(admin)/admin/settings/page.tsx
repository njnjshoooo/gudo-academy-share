import type { Metadata } from 'next'
import { SettingsForm } from '@/components/admin/settings-form'

export const metadata: Metadata = { title: '系統設定 | 管理後台' }

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">系統設定</h1>
        <p className="text-gray-500 mt-1 text-sm">管理平台全域設定、分潤規則與通知參數</p>
      </div>
      <SettingsForm />
    </div>
  )
}

import type { Metadata } from 'next'
import { TemplatesManager } from '@/components/ambassador/templates-manager'

export const metadata: Metadata = { title: '推廣話術範本 | GUDO Academy' }

export default function TemplatesPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">推廣話術範本</h1>
        <p className="text-gray-500 mt-1 text-sm">官方提供的推廣文案，也可自訂個人話術</p>
      </div>
      <TemplatesManager />
    </div>
  )
}

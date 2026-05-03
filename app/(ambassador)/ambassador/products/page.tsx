import { ShareProductCard } from '@/components/ambassador/share-product-card'
import { mockProducts } from '@/lib/mock-data'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '推廣專區' }

const MOCK_REFERRAL_CODE = 'ANGIE001'

export default function AmbassadorProductsPage() {
  const activeProducts = mockProducts.filter((p) => p.isActive)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">推廣專區</h1>
        <p className="text-gray-500 text-sm mt-1">
          複製專屬推廣連結，分享給朋友即可獲得分潤
        </p>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center gap-3">
        <div className="text-2xl">🔗</div>
        <div>
          <p className="font-semibold text-sky-800 text-sm">您的推廣代碼</p>
          <p className="font-mono font-bold text-sky-600 text-lg">{MOCK_REFERRAL_CODE}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {activeProducts.map((product) => (
          <ShareProductCard
            key={product.id}
            product={product}
            referralCode={MOCK_REFERRAL_CODE}
            baseUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://gudo-academy.com'}
          />
        ))}
      </div>
    </div>
  )
}

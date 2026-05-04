import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ShareProductCard } from '@/components/ambassador/share-product-card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '推廣專區' }

export default async function AmbassadorProductsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [ambassador, products] = await Promise.all([
    prisma.ambassador.findUnique({
      where: { userId: (session.user as any).id },
      select: { referralCode: true, status: true },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { categories: { include: { category: true } } },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    }),
  ])

  if (!ambassador) redirect('/ambassador/kyc')

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gudo-academy.com'

  // Map DB products to the shape ShareProductCard expects
  const productList = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription ?? p.description.slice(0, 80),
    mainImage: p.mainImage,
    salePrice: Number(p.salePrice),
    originalPrice: Number(p.originalPrice),
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    stock: p.stock,
    categories: p.categories.map((pc) => ({
      name: pc.category.name,
      slug: pc.category.slug,
    })),
    defaultShareText: p.defaultShareText ?? '',
  }))

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
          <p className="font-mono font-bold text-sky-600 text-lg">{ambassador.referralCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {productList.map((product) => (
          <ShareProductCard
            key={product.id}
            product={product}
            referralCode={ambassador.referralCode}
            baseUrl={baseUrl}
          />
        ))}
      </div>
    </div>
  )
}

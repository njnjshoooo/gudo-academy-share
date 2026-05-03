import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { mockProducts } from '@/lib/mock-data'
import { ProductDetail } from '@/components/storefront/product-detail'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = mockProducts.find((p) => p.slug === slug)
  if (!product) return { title: '商品不存在' }
  return {
    title: product.name,
    description: product.shortDescription,
  }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { ref } = await searchParams

  const product = mockProducts.find((p) => p.slug === slug && p.isActive)
  if (!product) notFound()

  // 若有推廣碼，取得推廣人名稱（生產環境從DB查詢）
  let referrerName: string | null = null
  if (ref) {
    // Mock: 在生產環境這裡會查詢資料庫
    referrerName = 'Angie'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail product={product} referralCode={ref} referrerName={referrerName} />
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Zap, User, ChevronLeft, Copy, Check, Star } from 'lucide-react'
import { MockProduct } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/store/cart'

interface Props {
  product: MockProduct
  referralCode?: string
  referrerName?: string | null
}

export function ProductDetail({ product, referralCode, referrerName }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'faq'>('description')
  const { addItem } = useCartStore()

  const isOutOfStock = product.stock <= 0
  const discountAmount = product.originalPrice - product.salePrice
  const discountPercent = Math.round((discountAmount / product.originalPrice) * 100)
  const category = product.categories[0]

  const finalPrice = referralCode && product.ambassadorDiscount
    ? product.salePrice - product.ambassadorDiscount
    : product.salePrice

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      mainImage: product.mainImage,
      slug: product.slug,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600 transition-colors">首頁</Link>
        <span>/</span>
        <Link href="/tidylist" className="hover:text-sky-600 transition-colors">課程總覽</Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/tidylist?category=${category.slug}`} className="hover:text-sky-600 transition-colors">
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Referrer Banner */}
      {referralCode && referrerName && (
        <div className="mb-6 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {referrerName[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-sky-800">
              您正透過 <span className="text-sky-600">{referrerName}</span> 的推薦瀏覽此商品
            </p>
            {product.ambassadorDiscount && (
              <p className="text-sm text-sky-700 mt-1">
                透過此推薦連結，您可以享有 <strong>{formatCurrency(product.ambassadorDiscount)}</strong> 的折扣優惠！
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Image */}
        <div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center text-8xl shadow-sm">
            {category?.slug === 'beginner' && '📗'}
            {category?.slug === 'intermediate' && '📘'}
            {category?.slug === 'advanced' && '📙'}
            {category?.slug === 'life-coaching' && '🌟'}
            {category?.slug === 'interior' && '🏠'}
            {!category && '📚'}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-5">
          <div>
            {category && (
              <Badge variant="brand" className="mb-2">{category.name}</Badge>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-2 leading-relaxed">{product.shortDescription}</p>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-sm text-gray-500">(4.9 / 96 則評價)</span>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-sky-600">
                {formatCurrency(finalPrice)}
              </span>
              {product.originalPrice > product.salePrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <Badge variant="destructive">省 {discountPercent}%</Badge>
              )}
            </div>
            {referralCode && product.ambassadorDiscount && (
              <p className="text-xs text-green-600 font-medium">
                已套用推薦折扣 -{formatCurrency(product.ambassadorDiscount)}
              </p>
            )}
            {!referralCode && product.ambassadorDiscount && (
              <p className="text-xs text-gray-500">
                透過推廣大使連結可再折扣 {formatCurrency(product.ambassadorDiscount)}
              </p>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-400' : 'bg-green-400'}`} />
            <span className={`text-sm ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? '暫無庫存' : `剩餘 ${product.stock} 個名額`}
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              size="xl"
              variant="brand"
              className="w-full"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
              {isOutOfStock ? '暫無庫存' : '加入購物車'}
            </Button>
            <Button
              size="xl"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isOutOfStock}
              asChild
            >
              <Link href="/checkout">
                <Zap className="w-5 h-5" />
                立即購買
              </Link>
            </Button>
          </div>

          {/* Commission info */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-green-800 mb-1">推廣大使分潤資訊</p>
            {product.commissionType === 'PERCENTAGE' && product.commissionValue ? (
              <p className="text-green-700">
                分享此課程給朋友，成功購買後您可獲得
                <strong className="mx-1">{product.commissionValue}%</strong>
                (約 {formatCurrency(product.salePrice * product.commissionValue / 100)}) 的分潤獎金
              </p>
            ) : product.commissionType === 'FIXED' && product.commissionValue ? (
              <p className="text-green-700">
                分享此課程給朋友，成功購買後您可獲得
                <strong className="mx-1">{formatCurrency(product.commissionValue)}</strong>
                的分潤獎金
              </p>
            ) : null}
            <Link href="/register" className="text-green-600 underline text-xs mt-1 block">
              立即申請成為推廣大使
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'description', label: '課程介紹' },
            { key: 'specs', label: '課程規格' },
            { key: 'faq', label: 'Q&A' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6 prose max-w-none">
          {activeTab === 'description' && (
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <h3 className="text-lg font-bold text-gray-900">課程說明</h3>
              <p>{product.shortDescription}</p>
              <h3 className="text-lg font-bold text-gray-900">您將學到什麼</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>整理思維與實作方法論</li>
                <li>與客戶的有效溝通技巧</li>
                <li>系統化整理流程建立</li>
                <li>整聊認證考核與結業</li>
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-3">
              {[
                ['課程形式', '線上影音課程 + 直播答疑'],
                ['課程時長', '約 30 小時影音內容'],
                ['有效期限', '購買後永久存取'],
                ['授課語言', '繁體中文'],
                ['結業證書', '完課後頒發整聊學院認證證書'],
                ['退費政策', '購買後 7 天內未觀看可申請退費'],
              ].map(([key, val]) => (
                <div key={key} className="flex gap-4 py-2 border-b border-gray-100 last:border-0">
                  <dt className="w-28 text-sm font-medium text-gray-500 flex-shrink-0">{key}</dt>
                  <dd className="text-sm text-gray-900">{val}</dd>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              {[
                {
                  q: '這門課程適合完全沒有整理經驗的人嗎？',
                  a: '是的！課程從零基礎開始，循序漸進地帶領你建立整理思維與實踐技能。',
                },
                {
                  q: '購買後多久可以開始學習？',
                  a: '付款成功後系統將立即寄送課程存取連結至您的 Email，即可開始學習。',
                },
                {
                  q: '是否提供發票？',
                  a: '是，系統會於付款後自動寄送電子發票至您的信箱。',
                },
              ].map(({ q, a }, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 mb-2">Q: {q}</p>
                  <p className="text-gray-700 text-sm">A: {a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

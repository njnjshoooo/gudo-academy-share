'use client'

import { useState } from 'react'
import { Copy, Check, ExternalLink, MessageCircle, Share2, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ShareProduct {
  id: string
  slug: string
  name: string
  salePrice: number
  originalPrice: number
  defaultShareText: string
  commissionType?: string | null
  commissionValue?: number | null
  categories: { name: string; slug: string }[]
}

interface Props {
  product: ShareProduct
  referralCode: string
  baseUrl: string
}

const DEFAULT_TEMPLATE = `這是我上過的整聊課程，對我非常有幫助！\n如果你也想學習整理與溝通，這邊下單可以透過我的推薦碼享有折扣唷～\n{link}`

export function ShareProductCard({ product, referralCode, baseUrl }: Props) {
  const [copied, setCopied] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(false)
  const [template, setTemplate] = useState(
    product.defaultShareText || DEFAULT_TEMPLATE
  )

  const link = `${baseUrl}/product/${product.slug}?ref=${referralCode}`
  const shareText = template.replace('{link}', link).replace('{product_name}', product.name)

  async function handleCopy() {
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const encodedText = encodeURIComponent(shareText)
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(link)}&text=${encodeURIComponent(template.replace('{link}', '').replace('{product_name}', product.name))}`
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`

  const commissionDisplay =
    product.commissionType === 'FIXED' && product.commissionValue
      ? `每筆 ${formatCurrency(product.commissionValue)}`
      : product.commissionType === 'PERCENTAGE' && product.commissionValue
      ? `${product.commissionValue}% ≈ ${formatCurrency(product.salePrice * product.commissionValue / 100)}`
      : '依系統預設'

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-sky-200 transition-colors">
      {/* Product Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Badge variant="brand" className="mb-1.5 text-xs">{product.categories[0]?.name}</Badge>
            <h3 className="font-semibold text-gray-900 text-sm leading-snug">{product.name}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-sky-600 text-sm">{formatCurrency(product.salePrice)}</p>
            {product.originalPrice > product.salePrice && (
              <p className="text-xs text-gray-400 line-through">{formatCurrency(product.originalPrice)}</p>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-xs text-gray-500">推廣分潤：</span>
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
            {commissionDisplay}
          </span>
        </div>
      </div>

      {/* Template */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-600">推廣文案</label>
          <button
            onClick={() => setEditingTemplate(!editingTemplate)}
            className="text-xs text-sky-600 hover:text-sky-700"
          >
            {editingTemplate ? '完成' : '編輯'}
          </button>
        </div>

        {editingTemplate ? (
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={4}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        ) : (
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 leading-relaxed whitespace-pre-line">
            {template.replace('{link}', link).replace('{product_name}', product.name)}
          </div>
        )}

        {/* Actions */}
        <Button
          size="sm"
          variant={copied ? 'secondary' : 'brand'}
          className="w-full"
          onClick={handleCopy}
        >
          {copied ? (
            <><Check className="w-4 h-4" /> 已複製！</>
          ) : (
            <><Copy className="w-4 h-4" /> 複製推廣文案</>
          )}
        </Button>

        {/* Social Share */}
        <div className="flex gap-2">
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            LINE
          </a>
          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            FB
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            X
          </a>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}

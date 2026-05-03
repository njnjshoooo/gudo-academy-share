'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { MockProduct } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/store/cart'

interface Props {
  products: MockProduct[]
}

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">目前沒有符合條件的商品</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: MockProduct }) {
  const { addItem, openCart } = useCartStore()
  const isOutOfStock = product.stock <= 0 && !product.allowBackorder
  const discountPercent = Math.round(
    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
  )

  const category = product.categories[0]

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (isOutOfStock) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice,
      mainImage: product.mainImage,
      slug: product.slug,
    })
  }

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {product.mainImage ? (
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-sky-50 to-blue-100">
              📚
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-black/70 px-3 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}

          {/* Discount badge */}
          {discountPercent > 0 && !isOutOfStock && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="text-xs font-bold">
                -{discountPercent}%
              </Badge>
            </div>
          )}

          {/* Featured badge */}
          {product.isFeatured && (
            <div className="absolute top-2 right-2">
              <Badge variant="brand" className="text-xs">
                熱門
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Category */}
          {category && (
            <p className="text-xs text-sky-600 font-medium mb-1">{category.name}</p>
          )}

          {/* Name */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-sky-600">
              {formatCurrency(product.salePrice)}
            </span>
            {product.originalPrice > product.salePrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Commission hint (for logged-in ambassadors) */}
          {product.commissionType === 'PERCENTAGE' && product.commissionValue && (
            <p className="text-xs text-green-600 mt-1">
              推廣可得 {product.commissionValue}% 分潤
            </p>
          )}
          {product.commissionType === 'FIXED' && product.commissionValue && (
            <p className="text-xs text-green-600 mt-1">
              推廣可得 {formatCurrency(product.commissionValue)} 分潤
            </p>
          )}

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100 group-hover:bg-sky-500 group-hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? '暫無庫存' : '加入購物車'}
          </button>
        </div>
      </div>
    </Link>
  )
}

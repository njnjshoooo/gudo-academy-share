'use client'

import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-sky-600" />
            購物車
            {items.length > 0 && (
              <span className="text-sm text-gray-500">({items.length} 件)</span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
            <ShoppingCart className="w-16 h-16 opacity-30" />
            <p className="text-lg font-medium">購物車是空的</p>
            <p className="text-sm">去選購喜歡的課程吧！</p>
            <Button variant="brand" onClick={closeCart} asChild>
              <Link href="/tidylist">瀏覽課程</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-2xl">
                      📚
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                    {item.variantName && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.variantName}</p>
                    )}
                    <p className="text-sky-600 font-semibold text-sm mt-1">
                      {formatCurrency(item.price)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">小計</span>
                <span className="font-bold text-lg text-sky-600">{formatCurrency(cartTotal)}</span>
              </div>

              <Button className="w-full" size="lg" variant="brand" asChild>
                <Link href="/checkout" onClick={closeCart}>
                  前往結帳
                </Link>
              </Button>

              <button
                onClick={closeCart}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors py-1"
              >
                繼續購物
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

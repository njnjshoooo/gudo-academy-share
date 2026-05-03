'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShoppingCart, CreditCard, Lock } from 'lucide-react'

const checkoutSchema = z.object({
  name: z.string().min(2, '請輸入姓名'),
  email: z.string().email('請輸入有效的 Email'),
  phone: z.string().regex(/^09\d{8}$/, '請輸入有效的手機號碼'),
  address: z.string().min(5, '請輸入完整地址'),
  paymentMethod: z.enum(['CREDIT_CARD', 'ATM', 'CVS']),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const cartTotal = total()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'CREDIT_CARD' },
  })

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-4">購物車是空的</p>
        <Button variant="brand" asChild>
          <Link href="/tidylist">去選購課程</Link>
        </Button>
      </div>
    )
  }

  async function onSubmit(data: CheckoutFormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
          },
          paymentMethod: data.paymentMethod,
          cartItems: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
            name: i.name,
          })),
        }),
      })

      const contentType = res.headers.get('content-type') || ''

      // ECPay 模式：後端回傳 HTML 自動提交表單
      if (contentType.includes('text/html')) {
        const orderNumber = res.headers.get('x-order-number') || ''
        const html = await res.text()
        clearCart()
        // 在新視窗開啟付款頁（ECPay 自動 POST）
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        window.location.href = url
        return
      }

      const result = await res.json()

      if (!res.ok) {
        alert(result.error || '下單失敗，請稍後再試')
        return
      }

      // 清空購物車
      clearCart()

      window.location.href = `/order/${result.orderNumber}?success=1`
    } catch {
      alert('網路錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">收件人資料</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">姓名 *</Label>
                <Input id="name" placeholder="王小明" className="mt-1" {...register('name')} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="mt-1" {...register('email')} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">手機 *</Label>
                  <Input id="phone" placeholder="0912345678" className="mt-1" {...register('phone')} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="address">地址 *</Label>
                <Input id="address" placeholder="台北市中正區..." className="mt-1" {...register('address')} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">付款方式</h2>
            <div className="space-y-3">
              {[
                { value: 'CREDIT_CARD', label: '信用卡一次付清', icon: '💳', desc: 'VISA / MasterCard / JCB' },
                { value: 'ATM', label: 'ATM 轉帳', icon: '🏦', desc: '付款後 3 天內完成轉帳' },
                { value: 'CVS', label: '超商繳費', icon: '🏪', desc: '7-11 / 全家 / 萊爾富' },
              ].map((method) => (
                <label
                  key={method.value}
                  className="flex items-center gap-3 border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-sky-300 has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50 transition-colors"
                >
                  <input
                    type="radio"
                    value={method.value}
                    className="accent-sky-500"
                    {...register('paymentMethod')}
                  />
                  <span className="text-xl">{method.icon}</span>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{method.label}</p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">訂單明細</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                    {item.variantName && (
                      <p className="text-xs text-gray-500">{item.variantName}</p>
                    )}
                    <p className="text-gray-500">x{item.quantity}</p>
                  </div>
                  <span className="font-medium ml-3 flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>小計</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>運費</span>
                <span className="text-green-600">免費（數位課程）</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                <span>總計</span>
                <span className="text-sky-600">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="brand"
              className="w-full mt-5"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                  處理中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  確認結帳 {formatCurrency(cartTotal)}
                </span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
              <Lock className="w-3 h-3" />
              SSL 加密安全結帳，由綠界科技提供金流服務
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

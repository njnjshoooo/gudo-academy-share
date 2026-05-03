import { CheckoutForm } from '@/components/storefront/checkout-form'

export const metadata = { title: '結帳' }

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">確認訂單</h1>
        <CheckoutForm />
      </div>
    </div>
  )
}

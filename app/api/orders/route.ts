import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { generateOrderNumber } from '@/lib/utils'

const orderSchema = z.object({
  customerInfo: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string(),
    address: z.string().min(5),
  }),
  paymentMethod: z.enum(['CREDIT_CARD', 'ATM', 'CVS']),
  cartItems: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().min(1),
      price: z.number().positive(),
      name: z.string(),
    })
  ).min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = orderSchema.parse(body)

    // 讀取推廣碼 cookie
    const cookieStore = await cookies()
    const affiliateRef = cookieStore.get('affiliate_ref')?.value

    // 計算金額
    const subtotal = data.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const orderNumber = generateOrderNumber()

    // TODO: 連接 Prisma DB 時，取代以下邏輯：
    // 1. 從 DB 驗證商品與庫存
    // 2. 建立 Order 紀錄
    // 3. 扣減庫存
    // 4. 若有 affiliateRef，關聯推廣大使並建立 Commission
    // 5. 串接 ECPay 取得付款 URL

    // Mock response
    const mockOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerName: data.customerInfo.name,
      customerEmail: data.customerInfo.email,
      subtotal,
      discount: 0,
      total: subtotal,
      affiliateRef: affiliateRef || null,
      paymentMethod: data.paymentMethod,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }

    // 清除 affiliate cookie（避免重複計算）
    // response.cookies.delete('affiliate_ref')  // handled in redirect

    return NextResponse.json(
      {
        orderNumber: mockOrder.orderNumber,
        message: '訂單已建立',
        // paymentUrl: 'https://payment-stage.ecpay.com.tw/...',  // ECPay URL
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '資料格式錯誤', details: error.issues }, { status: 400 })
    }
    console.error('Order creation error:', error)
    return NextResponse.json({ error: '訂單建立失敗' }, { status: 500 })
  }
}

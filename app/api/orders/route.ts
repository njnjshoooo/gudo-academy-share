import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { generateOrderNumber } from '@/lib/utils'
import { buildECPayAutoSubmitHtml } from '@/lib/ecpay'
import { sendOrderConfirmation } from '@/lib/email'

const orderSchema = z.object({
  customerInfo: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string(),
    address: z.string().min(5),
  }),
  paymentMethod: z.enum(['CREDIT_CARD', 'ATM', 'CVS']),
  cartItems: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().min(1),
        price: z.number().positive(),
        name: z.string(),
      })
    )
    .min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = orderSchema.parse(body)

    // 讀取推廣碼 cookie
    const cookieStore = await cookies()
    const referralCode = cookieStore.get('affiliate_ref')?.value ?? null

    // 計算金額
    const subtotal = data.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const orderNumber = generateOrderNumber()

    // 找推廣大使（若有推廣碼）
    let ambassadorId: string | null = null
    if (referralCode) {
      const ambassador = await prisma.ambassador.findUnique({
        where: { referralCode },
        select: { id: true, status: true },
      })
      if (ambassador?.status === 'ACTIVE') {
        ambassadorId = ambassador.id
      }
    }

    // 建立訂單與訂單項目
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customerInfo.name,
        customerEmail: data.customerInfo.email,
        customerPhone: data.customerInfo.phone,
        shippingAddress: data.customerInfo.address,
        ambassadorId,
        referralCode,
        subtotal,
        discount: 0,
        shippingFee: 0,
        total: subtotal,
        paymentMethod: data.paymentMethod,
        items: {
          create: data.cartItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            productName: item.name,
            unitPrice: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        },
      },
    })

    // 發送訂單確認信
    try {
      await sendOrderConfirmation({
        to: data.customerInfo.email,
        customerName: data.customerInfo.name,
        orderNumber,
        items: data.cartItems.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        total: subtotal,
      })
    } catch (emailErr) {
      // Email 失敗不影響訂單建立
      console.error('[Order] Failed to send confirmation email:', emailErr)
    }

    // 若 ECPay 憑證齊全，產生付款 HTML 頁面
    const hasECPayConfig =
      process.env.ECPAY_MERCHANT_ID &&
      process.env.ECPAY_HASH_KEY &&
      process.env.ECPAY_HASH_IV &&
      process.env.ECPAY_RETURN_URL

    if (hasECPayConfig) {
      const itemName = data.cartItems.map((i) => i.name).join('#')
      const ecpayHtml = buildECPayAutoSubmitHtml({
        orderNumber: order.orderNumber,
        totalAmount: Math.round(subtotal),
        itemName,
        paymentMethod: data.paymentMethod,
        customerEmail: data.customerInfo.email,
      })

      // 回傳 HTML 讓前端以 blob URL 跳轉付款
      return new NextResponse(ecpayHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Order-Number': orderNumber,
        },
      })
    }

    // 未設定 ECPay → 直接跳轉訂單確認頁（開發/測試模式）
    return NextResponse.json(
      { orderNumber, message: '訂單已建立' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '資料格式錯誤', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Order creation error:', error)
    return NextResponse.json({ error: '訂單建立失敗' }, { status: 500 })
  }
}

import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/db'
import { calculateItemCommission, getUnlockDate } from '@/lib/commission'
import { sendPaymentSuccessEmail } from '@/lib/email'
import { Decimal } from 'decimal.js'

const DEFAULT_SETTINGS = {
  defaultCommissionRate: Number(process.env.DEFAULT_COMMISSION_RATE ?? 10),
  refundGracePeriodDays: Number(process.env.REFUND_GRACE_PERIOD_DAYS ?? 7),
}

// 綠界付款結果回呼
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const params = new URLSearchParams(body)

    const merchantTradeNo = params.get('MerchantTradeNo')
    const rtnCode = params.get('RtnCode') // 1 = 付款成功
    const checkMacValue = params.get('CheckMacValue')
    const ecpayTradeNo = params.get('TradeNo') || ''

    // 驗證 CheckMacValue
    const isValid = verifyCheckMacValue(params, checkMacValue || '')
    if (!isValid) {
      console.error('[ECPay Webhook] Invalid CheckMacValue')
      return new Response('0|ErrorMessage', { status: 200 })
    }

    if (rtnCode === '1' && merchantTradeNo) {
      // 找到對應訂單（含商品資訊，用於計算分潤）
      const order = await prisma.order.findUnique({
        where: { orderNumber: merchantTradeNo },
        include: {
          items: {
            include: { product: true },
          },
        },
      })

      if (!order) {
        console.error('[ECPay Webhook] Order not found:', merchantTradeNo)
        return new Response('1|OK', { status: 200 })
      }

      // 避免重複處理
      if (order.paymentStatus === 'PAID') {
        return new Response('1|OK', { status: 200 })
      }

      // 更新訂單狀態
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'PAID',
          paidAt: new Date(),
          ecpayTradeNo,
        },
      })

      // 若有推廣大使，計算並建立分潤紀錄
      if (order.ambassadorId) {
        let totalCommission = new Decimal(0)

        for (const item of order.items) {
          const comm = calculateItemCommission(
            { subtotal: item.subtotal.toString(), quantity: item.quantity },
            {
              commissionType: item.product.commissionType,
              commissionValue: item.product.commissionValue?.toString() ?? null,
            },
            DEFAULT_SETTINGS
          )
          totalCommission = totalCommission.plus(comm)
        }

        if (totalCommission.gt(0)) {
          const commissionAmount = totalCommission.toDecimalPlaces(0).toNumber()
          const unlockAt = getUnlockDate(DEFAULT_SETTINGS.refundGracePeriodDays)

          await prisma.commission.create({
            data: {
              orderId: order.id,
              ambassadorId: order.ambassadorId,
              baseAmount: Number(order.total),
              amount: commissionAmount,
              unlockAt,
            },
          })

          await prisma.ambassador.update({
            where: { id: order.ambassadorId },
            data: {
              pendingEarnings: { increment: commissionAmount },
              totalEarnings: { increment: commissionAmount },
            },
          })
        }
      }

      // 發送付款成功通知信
      try {
        await sendPaymentSuccessEmail({
          to: order.customerEmail,
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          total: Number(order.total),
          items: order.items.map((i) => ({
            name: i.productName,
            quantity: i.quantity,
            price: Number(i.unitPrice),
          })),
        })
      } catch (emailErr) {
        console.error('[ECPay Webhook] Failed to send payment email:', emailErr)
      }

      console.log('[ECPay Webhook] Payment success processed:', merchantTradeNo)
    }

    // 回應綠界 "1|OK"
    return new Response('1|OK', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (error) {
    console.error('[ECPay Webhook] Error:', error)
    return new Response('0|ErrorMessage', { status: 200 })
  }
}

function verifyCheckMacValue(params: URLSearchParams, receivedMac: string): boolean {
  const hashKey = process.env.ECPAY_HASH_KEY || ''
  const hashIV = process.env.ECPAY_HASH_IV || ''

  const sorted = Array.from(params.entries())
    .filter(([k]) => k !== 'CheckMacValue')
    .sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))

  const str = `HashKey=${hashKey}&${sorted.map(([k, v]) => `${k}=${v}`).join('&')}&HashIV=${hashIV}`
  const encoded = encodeURIComponent(str).toLowerCase()
  const hash = crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase()

  return hash === receivedMac
}

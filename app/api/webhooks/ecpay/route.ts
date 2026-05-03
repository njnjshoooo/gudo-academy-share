import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { calculateOrderCommission, getUnlockDate } from '@/lib/commission'

// 綠界付款結果回呼
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const params = new URLSearchParams(body)

    const merchantId = params.get('MerchantID')
    const merchantTradeNo = params.get('MerchantTradeNo')
    const rtnCode = params.get('RtnCode') // 1 = 付款成功
    const checkMacValue = params.get('CheckMacValue')

    // 驗證 CheckMacValue
    const isValid = verifyCheckMacValue(params, checkMacValue || '')
    if (!isValid) {
      console.error('[ECPay Webhook] Invalid CheckMacValue')
      return new Response('0|ErrorMessage', { status: 200 })
    }

    if (rtnCode === '1') {
      // 付款成功
      // TODO: 連接 DB 後：
      // 1. 依 MerchantTradeNo 找到 Order
      // 2. 更新 Order.paymentStatus = PAID
      // 3. 更新 Order.status = PAID
      // 4. 若 Order.ambassadorId 存在：
      //    a. 計算分潤金額
      //    b. 建立 Commission 紀錄 (status=LOCKED)
      //    c. 設定 unlockAt = now + gracePeriodDays
      //    d. 更新 Ambassador.pendingEarnings
      // 5. 發送 Email 通知客戶
      // 6. 寫入 AuditLog

      console.log('[ECPay Webhook] Payment success:', merchantTradeNo)
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

  // 移除 CheckMacValue，按字母排序，組合字串
  const sorted = Array.from(params.entries())
    .filter(([k]) => k !== 'CheckMacValue')
    .sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))

  const str = `HashKey=${hashKey}&${sorted.map(([k, v]) => `${k}=${v}`).join('&')}&HashIV=${hashIV}`
  const encoded = encodeURIComponent(str).toLowerCase()
  const hash = crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase()

  return hash === receivedMac
}

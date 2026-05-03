import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const clickSchema = z.object({
  ref: z.string().regex(/^[A-Z0-9]{6,12}$/),
  productSlug: z.string().optional(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  referer: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = clickSchema.parse(body)

    // TODO: 連接 DB 後：
    // 1. 查詢 Ambassador 是否存在且 status=ACTIVE
    // 2. 防作弊：同 IP 短時間內多次點擊只計一次
    // 3. 防自我點擊：比對大使本人 session
    // 4. 寫入 ReferralClick 紀錄
    // 5. 產生 sessionId 關聯後續訂單

    console.log('[Track Click]', {
      ref: data.ref,
      productSlug: data.productSlug,
      ip: data.ip?.substring(0, 15), // 截短日誌中的 IP
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // 點擊追蹤失敗不應中斷用戶體驗
    return NextResponse.json({ success: false }, { status: 200 })
  }
}

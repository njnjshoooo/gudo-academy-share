import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const kycSchema = z.object({
  realName: z.string().min(2),
  idNumber: z.string().regex(/^[A-Z][0-9]{9}$/),
  birthDate: z.string(),
  registeredAddr: z.string().min(5),
  contactAddr: z.string().min(5),
  bankCode: z.string().regex(/^\d{3}$/),
  bankBranch: z.string().min(2),
  bankAccount: z.string().min(8),
  bankAccountName: z.string().min(2),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: '請先登入' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = kycSchema.parse(body)

    // TODO: 連接 DB 後：
    // 1. 檢查是否已有 Ambassador 紀錄（防重複提交）
    // 2. 加密身分證字號和銀行帳號（encrypt() 函數）
    // 3. 建立 Ambassador 紀錄，status=PENDING
    // 4. 寫入 AuditLog
    // 5. 發送 Email 通知管理員

    console.log('[KYC Submit]', {
      userId: session.user.id,
      realName: data.realName,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: 'KYC 已提交，等待審核' }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '資料格式錯誤', details: error.issues }, { status: 400 })
    }
    console.error('KYC submit error:', error)
    return NextResponse.json({ error: '提交失敗' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const withdrawSchema = z.object({
  amount: z.number().positive(),
  bankCode: z.string().length(3),
  bankBranch: z.string().min(2),
  bankAccount: z.string().min(10).max(16),
  accountName: z.string().min(2),
  note: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }

    const body = await req.json()
    const data = withdrawSchema.parse(body)

    // TODO: Connect to Prisma DB
    // 1. Check ambassador's available balance >= data.amount
    // 2. Calculate tax withholding
    // 3. Create Withdrawal record
    // 4. Lock the related Commission records

    console.log('Withdrawal request:', { userId: session.user.id, ...data })

    return NextResponse.json({ message: '請款申請已送出', status: 'PENDING' }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '資料格式錯誤', details: error.issues }, { status: 400 })
    }
    console.error('Withdraw error:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }

    // TODO: Fetch withdrawals from DB
    const mockWithdrawals = [
      {
        id: 'w001',
        amount: 3198,
        taxAmount: 0,
        netAmount: 3198,
        status: 'PAID',
        createdAt: '2025-04-30',
        paidAt: '2025-05-05',
      },
    ]

    return NextResponse.json(mockWithdrawals)
  } catch (error) {
    console.error('Get withdrawals error:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

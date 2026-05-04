import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { calculateTaxAmount } from '@/lib/commission'
import { Decimal } from 'decimal.js'

const MIN_WITHDRAWAL = Number(process.env.MIN_WITHDRAWAL_AMOUNT ?? 1000)
const TAX_THRESHOLD = Number(process.env.TAX_THRESHOLD ?? 1000)
const TAX_RATE = Number(process.env.TAX_WITHHOLDING_RATE ?? 5)

const withdrawSchema = z.object({
  amount: z.number().min(MIN_WITHDRAWAL),
  bankCode: z.string().length(3),
  bankBranch: z.string().min(2),
  bankAccount: z.string().min(10).max(16),
  bankAccountName: z.string().min(2),
  note: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }

    const ambassador = await prisma.ambassador.findUnique({
      where: { userId: (session.user as any).id },
    })

    if (!ambassador) {
      return NextResponse.json({ error: '找不到大使資料' }, { status: 404 })
    }

    if (ambassador.status !== 'ACTIVE') {
      return NextResponse.json({ error: '帳號未啟用，無法請款' }, { status: 403 })
    }

    const body = await req.json()
    const data = withdrawSchema.parse(body)

    const available = Number(ambassador.availableEarnings)
    if (data.amount > available) {
      return NextResponse.json({ error: `超過可用餘額 NT$ ${available.toLocaleString()}` }, { status: 400 })
    }

    const amountDecimal = new Decimal(data.amount)
    const taxAmount = data.amount >= TAX_THRESHOLD
      ? calculateTaxAmount(amountDecimal, TAX_RATE)
      : new Decimal(0)
    const netAmount = amountDecimal.minus(taxAmount)

    // 產生請款編號
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const count = await prisma.withdrawal.count()
    const withdrawalNumber = `WD${dateStr}${String(count + 1).padStart(4, '0')}`

    // 找出可請款的分潤紀錄
    const availableCommissions = await prisma.commission.findMany({
      where: {
        ambassadorId: ambassador.id,
        status: 'AVAILABLE',
      },
      orderBy: { createdAt: 'asc' },
    })

    const withdrawal = await prisma.withdrawal.create({
      data: {
        withdrawalNumber,
        ambassadorId: ambassador.id,
        amount: data.amount,
        taxAmount: taxAmount.toNumber(),
        netAmount: netAmount.toNumber(),
        bankCode: data.bankCode,
        bankAccount: data.bankAccount,
        bankAccountName: data.bankAccountName,
        status: 'PENDING',
        commissions: {
          connect: availableCommissions.map((c) => ({ id: c.id })),
        },
      },
    })

    // 更新分潤狀態為 REQUESTED
    await prisma.commission.updateMany({
      where: {
        ambassadorId: ambassador.id,
        status: 'AVAILABLE',
      },
      data: { status: 'REQUESTED', withdrawalId: withdrawal.id },
    })

    // 扣除可用餘額
    await prisma.ambassador.update({
      where: { id: ambassador.id },
      data: {
        availableEarnings: { decrement: data.amount },
      },
    })

    return NextResponse.json({ withdrawalNumber, netAmount: netAmount.toNumber() }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '資料格式錯誤', details: error.issues }, { status: 400 })
    }
    console.error('Withdraw error:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

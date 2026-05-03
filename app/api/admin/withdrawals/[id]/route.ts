import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sendWithdrawalProcessedEmail } from '@/lib/email'

const actionSchema = z.object({
  action: z.enum(['APPROVED', 'PAID', 'REJECTED']),
  note: z.string().optional(),
})

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: '無權限' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const data = actionSchema.parse(body)

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id },
      include: {
        ambassador: { include: { user: true } },
      },
    })

    if (!withdrawal) {
      return NextResponse.json({ error: '找不到此請款申請' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {
      status: data.action,
      notes: data.note,
      processedBy: (session?.user as any)?.id,
    }

    if (data.action === 'PAID') {
      updateData.paidAt = new Date()

      // 將此次請款的所有分潤改為 PAID，並累計 paidEarnings
      await prisma.commission.updateMany({
        where: { withdrawalId: id },
        data: { status: 'PAID' },
      })

      await prisma.ambassador.update({
        where: { id: withdrawal.ambassadorId },
        data: {
          availableEarnings: { decrement: Number(withdrawal.netAmount) },
          paidEarnings: { increment: Number(withdrawal.netAmount) },
        },
      })
    }

    await prisma.withdrawal.update({
      where: { id },
      data: updateData,
    })

    // 發送請款狀態通知
    try {
      await sendWithdrawalProcessedEmail({
        to: withdrawal.ambassador.user.email,
        name: withdrawal.ambassador.realName,
        withdrawalNumber: withdrawal.withdrawalNumber,
        netAmount: Number(withdrawal.netAmount),
        status: data.action,
        notes: data.note,
      })
    } catch (emailErr) {
      console.error('[Withdrawal] Failed to send status email:', emailErr)
    }

    return NextResponse.json({
      message: `撥款狀態已更新為 ${data.action}`,
      withdrawalId: id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '資料格式錯誤', details: error.issues }, { status: 400 })
    }
    console.error('Withdrawal action error:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

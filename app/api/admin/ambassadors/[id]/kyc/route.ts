import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sendKycApprovedEmail, sendKycRejectedEmail } from '@/lib/email'

const reviewSchema = z.object({
  action: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().optional(),
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
    const data = reviewSchema.parse(body)

    if (data.action === 'REJECTED' && !data.reason) {
      return NextResponse.json({ error: '拒絕時必須填寫原因' }, { status: 400 })
    }

    const ambassador = await prisma.ambassador.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!ambassador) {
      return NextResponse.json({ error: '找不到此大使' }, { status: 404 })
    }

    const adminId = (session?.user as any)?.id

    if (data.action === 'APPROVED') {
      await prisma.ambassador.update({
        where: { id },
        data: {
          status: 'ACTIVE',
          approvedAt: new Date(),
          approvedBy: adminId,
          rejectionReason: null,
        },
      })

      // 更新用戶角色
      await prisma.user.update({
        where: { id: ambassador.userId },
        data: { role: 'AMBASSADOR' },
      })

      // 發送審核通過通知
      try {
        await sendKycApprovedEmail({
          to: ambassador.user.email,
          name: ambassador.realName,
          referralCode: ambassador.referralCode,
        })
      } catch (emailErr) {
        console.error('[KYC] Failed to send approval email:', emailErr)
      }
    } else {
      await prisma.ambassador.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectionReason: data.reason,
        },
      })

      // 發送審核未通過通知
      try {
        await sendKycRejectedEmail({
          to: ambassador.user.email,
          name: ambassador.realName,
          reason: data.reason || '資料不符合要求',
        })
      } catch (emailErr) {
        console.error('[KYC] Failed to send rejection email:', emailErr)
      }
    }

    return NextResponse.json({
      message: `KYC 審核完成：${data.action}`,
      ambassadorId: id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '資料格式錯誤', details: error.issues }, { status: 400 })
    }
    console.error('KYC review error:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

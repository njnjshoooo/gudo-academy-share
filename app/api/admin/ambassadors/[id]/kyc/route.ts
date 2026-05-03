import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { z } from 'zod'

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

    // TODO: Connect to Prisma DB
    console.log('KYC review:', { ambassadorId: id, ...data })

    return NextResponse.json({ message: `KYC 審核完成：${data.action}`, ambassadorId: id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '資料格式錯誤', details: error.issues }, { status: 400 })
    }
    console.error('KYC review error:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { z } from 'zod'

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

    // TODO: Connect to Prisma DB
    console.log('Withdrawal action:', { withdrawalId: id, ...data })

    return NextResponse.json({ message: `撥款狀態已更新為 ${data.action}`, withdrawalId: id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '資料格式錯誤', details: error.issues }, { status: 400 })
    }
    console.error('Withdrawal action error:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

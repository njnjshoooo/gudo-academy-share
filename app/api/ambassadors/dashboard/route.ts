import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: '請先登入' }, { status: 401 })
  }

  // TODO: 連接 DB 後，從 Prisma 查詢真實數據
  const mockDashboard = {
    referralCode: 'ANGIE001',
    monthlyEarnings: 12500,
    totalEarnings: 87600,
    availableEarnings: 18200,
    pendingEarnings: 4800,
    monthlyClicks: 342,
    monthlyConversions: 7,
    conversionRate: 2.05,
    kycStatus: 'ACTIVE',
    recentOrders: [],
  }

  return NextResponse.json(mockDashboard)
}

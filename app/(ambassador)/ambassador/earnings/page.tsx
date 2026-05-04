import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { EarningsTable } from '@/components/ambassador/earnings-table'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '分潤明細 | GUDO Academy' }

export default async function EarningsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const ambassador = await prisma.ambassador.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      commissions: {
        include: {
          order: {
            include: { items: { take: 1 } },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!ambassador) redirect('/ambassador/kyc')

  const records = ambassador.commissions.map((c) => {
    const order = c.order
    const firstItem = order.items[0]
    const name = order.customerName
    const masked = name.length >= 2 ? name[0] + '**' : name + '**'

    return {
      id: c.id,
      orderNumber: order.orderNumber,
      productName: firstItem?.productName ?? '（多項商品）',
      buyerName: masked,
      orderAmount: Number(order.total),
      commissionAmount: Number(c.amount),
      status: c.status as 'LOCKED' | 'AVAILABLE' | 'REQUESTED' | 'PAID' | 'CANCELLED',
      createdAt: c.createdAt.toISOString().slice(0, 10),
      unlockAt: c.unlockAt.toISOString().slice(0, 10),
    }
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">分潤明細</h1>
        <p className="text-gray-500 mt-1 text-sm">查看所有推廣訂單的分潤記錄</p>
      </div>
      <EarningsTable
        records={records}
        totalEarnings={Number(ambassador.totalEarnings)}
        paidEarnings={Number(ambassador.paidEarnings)}
        availableEarnings={Number(ambassador.availableEarnings)}
      />
    </div>
  )
}

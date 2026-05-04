import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { WithdrawForm } from '@/components/ambassador/withdraw-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '申請請款 | GUDO Academy' }

export default async function WithdrawPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const ambassador = await prisma.ambassador.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      withdrawals: {
        orderBy: { requestedAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!ambassador) redirect('/ambassador/kyc')

  const withdrawalHistory = ambassador.withdrawals.map((w) => ({
    id: w.id,
    withdrawalNumber: w.withdrawalNumber,
    amount: Number(w.amount),
    netAmount: Number(w.netAmount),
    status: w.status,
    requestedAt: w.requestedAt.toISOString().slice(0, 10),
  }))

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">申請請款</h1>
        <p className="text-gray-500 mt-1 text-sm">將您的可用分潤餘額提領至銀行帳戶</p>
      </div>
      <WithdrawForm
        availableBalance={Number(ambassador.availableEarnings)}
        bankInfo={{
          bankCode: ambassador.bankCode,
          bankBranch: ambassador.bankBranch,
          bankAccount: ambassador.bankAccount,
          bankAccountName: ambassador.bankAccountName,
        }}
        withdrawalHistory={withdrawalHistory}
      />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, Banknote, Clock, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

const MIN_WITHDRAWAL = 1000
const TAX_THRESHOLD = 1000
const TAX_RATE = 0.05

function buildWithdrawSchema(maxAmount: number) {
  return z.object({
    amount: z
      .number()
      .min(MIN_WITHDRAWAL, `最低請款金額為 NT$ ${MIN_WITHDRAWAL.toLocaleString()}`)
      .max(maxAmount, `超過可用餘額 NT$ ${maxAmount.toLocaleString()}`),
    bankCode: z.string().length(3, '請輸入 3 碼銀行代號'),
    bankBranch: z.string().min(2, '請輸入分行名稱'),
    bankAccount: z.string().min(10, '請輸入完整帳號').max(16, '帳號格式錯誤'),
    bankAccountName: z.string().min(2, '請輸入戶名'),
    note: z.string().optional(),
  })
}

interface AmbassadorBankInfo {
  bankCode: string
  bankBranch: string
  bankAccount: string
  bankAccountName: string
}

interface Withdrawal {
  id: string
  withdrawalNumber: string
  amount: number
  netAmount: number
  status: string
  requestedAt: string
}

interface Props {
  availableBalance: number
  bankInfo: AmbassadorBankInfo
  withdrawalHistory: Withdrawal[]
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: '待審核',
  APPROVED: '已核准',
  PAID: '已撥款',
  REJECTED: '已拒絕',
}

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export function WithdrawForm({ availableBalance, bankInfo, withdrawalHistory }: Props) {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const router = useRouter()

  const schema = buildWithdrawSchema(availableBalance)
  type WithdrawFormData = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WithdrawFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: availableBalance,
      bankCode: bankInfo.bankCode,
      bankBranch: bankInfo.bankBranch,
      bankAccount: bankInfo.bankAccount,
      bankAccountName: bankInfo.bankAccountName,
    },
  })

  const amount = watch('amount') || 0
  const taxAmount = amount >= TAX_THRESHOLD ? Math.floor(amount * TAX_RATE) : 0
  const netAmount = amount - taxAmount

  async function onSubmit(data: WithdrawFormData) {
    setLoading(true)
    setServerError('')
    try {
      const res = await fetch('/api/ambassador/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json()
        setServerError(json.error || '送出失敗，請稍後再試')
        return
      }
      setSuccess(true)
      router.refresh()
    } catch {
      setServerError('網路錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">請款申請已送出</h2>
        <p className="text-gray-500 text-sm mb-6">
          我們將在 3–5 個工作天內完成審核並撥款至您的帳戶。
        </p>
        <Button variant="outline" onClick={() => setSuccess(false)}>
          返回
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balance card */}
      <div className="bg-gradient-to-r from-sky-500 to-violet-500 text-white rounded-2xl p-6">
        <p className="text-sm opacity-80">可用分潤餘額</p>
        <p className="text-4xl font-bold mt-1">NT$ {availableBalance.toLocaleString()}</p>
        <p className="text-xs opacity-70 mt-2">最低請款門檻：NT$ {MIN_WITHDRAWAL.toLocaleString()}</p>
      </div>

      {availableBalance < MIN_WITHDRAWAL && (
        <div className="flex gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400" />
          <p>可用餘額未達最低請款門檻（NT$ {MIN_WITHDRAWAL.toLocaleString()}），暫時無法請款。</p>
        </div>
      )}

      {/* Info banner */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium mb-1">扣繳說明</p>
          <p>請款金額達 NT$ {TAX_THRESHOLD.toLocaleString()} 以上，依規定代扣 {TAX_RATE * 100}% 薪資所得稅。</p>
        </div>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Banknote className="w-5 h-5 text-sky-500" /> 請款金額
        </h2>

        <div>
          <Label htmlFor="amount">請款金額（NT$）</Label>
          <Input
            id="amount"
            type="number"
            className="mt-1"
            disabled={availableBalance < MIN_WITHDRAWAL}
            {...register('amount', { valueAsNumber: true })}
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          {amount > 0 && (
            <div className="mt-2 text-xs space-y-1 text-gray-600 bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between">
                <span>請款金額</span>
                <span>NT$ {amount.toLocaleString()}</span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>代扣稅款（{TAX_RATE * 100}%）</span>
                  <span>- NT$ {taxAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-1 mt-1">
                <span>實際撥款</span>
                <span>NT$ {netAmount.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sky-500" /> 收款帳戶
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bankCode">銀行代號</Label>
            <Input id="bankCode" placeholder="例：004（台灣銀行）" className="mt-1" {...register('bankCode')} />
            {errors.bankCode && <p className="text-red-500 text-xs mt-1">{errors.bankCode.message}</p>}
          </div>
          <div>
            <Label htmlFor="bankBranch">分行名稱</Label>
            <Input id="bankBranch" placeholder="例：台北分行" className="mt-1" {...register('bankBranch')} />
            {errors.bankBranch && <p className="text-red-500 text-xs mt-1">{errors.bankBranch.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="bankAccountName">戶名</Label>
          <Input id="bankAccountName" placeholder="請輸入銀行帳戶戶名" className="mt-1" {...register('bankAccountName')} />
          {errors.bankAccountName && <p className="text-red-500 text-xs mt-1">{errors.bankAccountName.message}</p>}
        </div>

        <div>
          <Label htmlFor="bankAccount">帳號</Label>
          <Input id="bankAccount" placeholder="請輸入帳號" className="mt-1" {...register('bankAccount')} />
          {errors.bankAccount && <p className="text-red-500 text-xs mt-1">{errors.bankAccount.message}</p>}
        </div>

        <div>
          <Label htmlFor="note">備註（選填）</Label>
          <Input id="note" placeholder="如有特殊說明請填寫" className="mt-1" {...register('note')} />
        </div>

        <Button
          type="submit"
          variant="brand"
          size="lg"
          className="w-full"
          disabled={loading || availableBalance < MIN_WITHDRAWAL}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              送出中...
            </span>
          ) : (
            '送出請款申請'
          )}
        </Button>
      </form>

      {/* History */}
      {withdrawalHistory.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <h2 className="font-semibold text-gray-900 text-sm">請款紀錄</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {withdrawalHistory.map((w) => (
              <div key={w.id} className="px-6 py-4 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">NT$ {w.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">#{w.withdrawalNumber}・{w.requestedAt}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CLASS[w.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABEL[w.status] || w.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">實收 NT$ {w.netAmount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

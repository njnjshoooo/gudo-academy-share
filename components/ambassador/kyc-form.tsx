'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle } from 'lucide-react'

const kycSchema = z.object({
  realName: z.string().min(2, '請輸入真實姓名'),
  idNumber: z.string().regex(/^[A-Z][0-9]{9}$/, '請輸入有效的身分證字號'),
  birthDate: z.string().min(1, '請選擇出生年月日'),
  registeredAddr: z.string().min(5, '請輸入戶籍地址'),
  contactAddr: z.string().min(5, '請輸入通訊地址'),
  bankCode: z.string().regex(/^\d{3}$/, '請輸入 3 位銀行代碼'),
  bankBranch: z.string().min(2, '請輸入分行名稱'),
  bankAccount: z.string().min(8, '請輸入銀行帳號'),
  bankAccountName: z.string().min(2, '請輸入戶名'),
})

type KycFormData = z.infer<typeof kycSchema>

export function KycForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sameAddr, setSameAddr] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<KycFormData>({
    resolver: zodResolver(kycSchema),
  })

  const registeredAddr = watch('registeredAddr')

  function handleSameAddr(checked: boolean) {
    setSameAddr(checked)
    if (checked) {
      setValue('contactAddr', registeredAddr)
    }
  }

  async function onSubmit(data: KycFormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/ambassadors/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const result = await res.json()
        alert(result.error || 'KYC 提交失敗')
      }
    } catch {
      alert('網路錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-green-800 mb-2">KYC 資料已送出！</h2>
        <p className="text-green-700 text-sm">
          管理員將在 1-3 個工作天內完成審核，結果將寄送至您的 Email。
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">個人身份資料</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="realName">真實姓名 *</Label>
            <Input id="realName" placeholder="王小明" className="mt-1" {...register('realName')} />
            {errors.realName && <p className="text-red-500 text-xs mt-1">{errors.realName.message}</p>}
          </div>
          <div>
            <Label htmlFor="idNumber">身分證字號 *</Label>
            <Input id="idNumber" placeholder="A123456789" className="mt-1" {...register('idNumber')} />
            {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="birthDate">出生年月日 *</Label>
          <Input id="birthDate" type="date" className="mt-1" {...register('birthDate')} />
          {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate.message}</p>}
        </div>
        <div>
          <Label htmlFor="registeredAddr">戶籍地址 *</Label>
          <Input id="registeredAddr" placeholder="台北市中正區XX路XX號" className="mt-1" {...register('registeredAddr')} />
          {errors.registeredAddr && <p className="text-red-500 text-xs mt-1">{errors.registeredAddr.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="contactAddr">通訊地址 *</Label>
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="accent-sky-500"
                checked={sameAddr}
                onChange={(e) => handleSameAddr(e.target.checked)}
              />
              同戶籍地址
            </label>
          </div>
          <Input
            id="contactAddr"
            placeholder="台北市中正區XX路XX號"
            {...register('contactAddr')}
          />
          {errors.contactAddr && <p className="text-red-500 text-xs mt-1">{errors.contactAddr.message}</p>}
        </div>

        {/* ID Card Upload */}
        <div className="grid grid-cols-2 gap-4">
          <UploadField label="身分證正面照 *" hint="JPG/PNG, 最大 5MB" />
          <UploadField label="身分證反面照 *" hint="JPG/PNG, 最大 5MB" />
        </div>
      </div>

      {/* Bank Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">收款帳戶資料</h2>
        <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
          提醒：所得累計達 NT$1,000 起需開立扣繳憑單；單筆超過 NT$88,501 須扣繳 5%
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bankCode">銀行代碼 *</Label>
            <Input id="bankCode" placeholder="例：004（台灣銀行）" className="mt-1" {...register('bankCode')} />
            {errors.bankCode && <p className="text-red-500 text-xs mt-1">{errors.bankCode.message}</p>}
          </div>
          <div>
            <Label htmlFor="bankBranch">分行名稱 *</Label>
            <Input id="bankBranch" placeholder="例：信義分行" className="mt-1" {...register('bankBranch')} />
            {errors.bankBranch && <p className="text-red-500 text-xs mt-1">{errors.bankBranch.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bankAccountName">戶名 *</Label>
            <Input id="bankAccountName" placeholder="須與真實姓名一致" className="mt-1" {...register('bankAccountName')} />
            {errors.bankAccountName && <p className="text-red-500 text-xs mt-1">{errors.bankAccountName.message}</p>}
          </div>
          <div>
            <Label htmlFor="bankAccount">銀行帳號 *</Label>
            <Input id="bankAccount" placeholder="帳號（含分行代碼）" className="mt-1" {...register('bankAccount')} />
            {errors.bankAccount && <p className="text-red-500 text-xs mt-1">{errors.bankAccount.message}</p>}
          </div>
        </div>
        <UploadField label="存摺封面照 *" hint="用於核對帳號，JPG/PNG" />
      </div>

      <Button type="submit" size="lg" variant="brand" className="w-full" disabled={loading}>
        {loading ? '提交中...' : '送出 KYC 申請'}
      </Button>
    </form>
  )
}

function UploadField({ label, hint }: { label: string; hint: string }) {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div>
      <Label>{label}</Label>
      <label className="mt-1 flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-sky-300 hover:bg-sky-50 transition-colors">
        <input
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file ? (
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-1" />
            <p className="text-xs text-green-600 font-medium">{file.name}</p>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">點擊上傳</p>
            <p className="text-xs text-gray-400">{hint}</p>
          </div>
        )}
      </label>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, UserPlus } from 'lucide-react'

const registerSchema = z.object({
  name: z.string().min(2, '請輸入暱稱（至少 2 字）'),
  email: z.string().email('請輸入有效的 Email'),
  phone: z.string().regex(/^09\d{8}$/, '請輸入有效的手機號碼（09 開頭 10 碼）'),
  password: z.string().min(8, '密碼至少 8 個字元'),
  passwordConfirm: z.string(),
  agreeTerms: z.boolean().refine((v) => v === true, '請同意服務條款'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '兩次密碼不一致',
  path: ['passwordConfirm'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || '註冊失敗')
        return
      }

      router.push('/login?registered=1')
    } catch {
      setError('網路錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="name">暱稱 *</Label>
          <Input id="name" placeholder="例：Angie 安琪" className="mt-1" {...register('name')} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" placeholder="your@email.com" className="mt-1" {...register('email')} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">手機號碼 *</Label>
          <Input id="phone" placeholder="0912345678" className="mt-1" {...register('phone')} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">密碼 *</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="至少 8 個字元"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <Label htmlFor="passwordConfirm">確認密碼 *</Label>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="再次輸入密碼"
            className="mt-1"
            {...register('passwordConfirm')}
          />
          {errors.passwordConfirm && (
            <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm.message}</p>
          )}
        </div>

        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="agreeTerms"
            className="mt-0.5 w-4 h-4 accent-sky-500"
            {...register('agreeTerms')}
          />
          <label htmlFor="agreeTerms" className="text-sm text-gray-600 leading-relaxed">
            我已閱讀並同意{' '}
            <a href="/terms" className="text-sky-600 underline" target="_blank">服務條款</a>
            、
            <a href="/privacy" className="text-sky-600 underline" target="_blank">隱私政策</a>
            ，及{' '}
            <a href="/affiliate-agreement" className="text-sky-600 underline" target="_blank">推廣大使合約</a>
          </label>
        </div>
        {errors.agreeTerms && (
          <p className="text-red-500 text-xs">{errors.agreeTerms.message}</p>
        )}

        <Button type="submit" size="lg" variant="brand" className="w-full mt-2" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              處理中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              申請帳號
            </span>
          )}
        </Button>
      </form>
    </div>
  )
}

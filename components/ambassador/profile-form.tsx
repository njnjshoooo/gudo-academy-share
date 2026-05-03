'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, User, Bell, Lock } from 'lucide-react'

const profileSchema = z.object({
  name: z.string().min(2, '暱稱至少 2 個字'),
  phone: z.string().regex(/^09\d{8}$/, '請輸入有效的手機號碼'),
  line: z.string().optional(),
  instagram: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, '請輸入目前密碼'),
  newPassword: z.string().min(8, '新密碼至少 8 個字元'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: '兩次密碼不一致',
  path: ['confirmPassword'],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

// Mock user data
const MOCK_USER = {
  name: '整理達人 Angie',
  email: 'angie@example.com',
  phone: '0912345678',
  referralCode: 'ANGIE001',
  line: '@angie_tidylist',
  instagram: 'angie_tidylist',
  emailNotify: true,
  smsNotify: false,
}

export function ProfileForm() {
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [emailNotify, setEmailNotify] = useState(MOCK_USER.emailNotify)
  const [smsNotify, setSmsNotify] = useState(MOCK_USER.smsNotify)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: MOCK_USER.name,
      phone: MOCK_USER.phone,
      line: MOCK_USER.line,
      instagram: MOCK_USER.instagram,
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  async function onProfileSubmit(data: ProfileFormData) {
    // TODO: PATCH /api/ambassadors/profile
    console.log('Profile:', data)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  async function onPasswordSubmit(data: PasswordFormData) {
    // TODO: PATCH /api/ambassadors/password
    console.log('Password change:', data)
    resetPassword()
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Referral code display */}
      <div className="bg-gradient-to-r from-sky-500 to-violet-500 text-white rounded-2xl p-5">
        <p className="text-xs opacity-70 mb-1">您的專屬推廣代碼</p>
        <p className="text-3xl font-bold tracking-wider">{MOCK_USER.referralCode}</p>
        <p className="text-xs opacity-70 mt-2">{MOCK_USER.email}</p>
      </div>

      {/* Profile info */}
      <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-4 h-4 text-sky-500" /> 基本資料
        </h2>

        <div>
          <Label>Email（無法修改）</Label>
          <Input value={MOCK_USER.email} disabled className="mt-1 bg-gray-50 text-gray-500" />
        </div>

        <div>
          <Label htmlFor="name">暱稱 *</Label>
          <Input id="name" className="mt-1" {...registerProfile('name')} />
          {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">手機號碼 *</Label>
          <Input id="phone" className="mt-1" {...registerProfile('phone')} />
          {profileErrors.phone && <p className="text-red-500 text-xs mt-1">{profileErrors.phone.message}</p>}
        </div>

        <hr className="border-gray-100" />

        <div>
          <Label htmlFor="line">LINE ID（選填）</Label>
          <Input id="line" placeholder="@your_line_id" className="mt-1" {...registerProfile('line')} />
        </div>

        <div>
          <Label htmlFor="instagram">Instagram（選填）</Label>
          <div className="flex mt-1">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
              @
            </span>
            <Input id="instagram" placeholder="your_instagram" className="rounded-l-none" {...registerProfile('instagram')} />
          </div>
        </div>

        {profileSaved && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" /> 資料已儲存
          </div>
        )}

        <Button type="submit" variant="brand" size="sm">
          儲存資料
        </Button>
      </form>

      {/* Notifications */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-sky-500" /> 通知設定
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900 text-sm">Email 通知</p>
              <p className="text-xs text-gray-500">分潤確認、撥款完成通知</p>
            </div>
            <div
              onClick={() => setEmailNotify(!emailNotify)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${emailNotify ? 'bg-sky-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${emailNotify ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900 text-sm">SMS 簡訊通知</p>
              <p className="text-xs text-gray-500">重要帳務通知</p>
            </div>
            <div
              onClick={() => setSmsNotify(!smsNotify)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${smsNotify ? 'bg-sky-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${smsNotify ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
        </div>
      </div>

      {/* Password */}
      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-sky-500" /> 更改密碼
        </h2>

        <div>
          <Label htmlFor="currentPassword">目前密碼</Label>
          <Input id="currentPassword" type="password" className="mt-1" {...registerPassword('currentPassword')} />
          {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>}
        </div>

        <div>
          <Label htmlFor="newPassword">新密碼</Label>
          <Input id="newPassword" type="password" placeholder="至少 8 個字元" className="mt-1" {...registerPassword('newPassword')} />
          {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>}
        </div>

        <div>
          <Label htmlFor="confirmPassword">確認新密碼</Label>
          <Input id="confirmPassword" type="password" className="mt-1" {...registerPassword('confirmPassword')} />
          {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>}
        </div>

        {passwordSaved && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" /> 密碼已更新
          </div>
        )}

        <Button type="submit" variant="outline" size="sm">
          更新密碼
        </Button>
      </form>
    </div>
  )
}

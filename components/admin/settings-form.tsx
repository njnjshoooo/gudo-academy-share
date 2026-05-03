'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Percent, DollarSign, Calendar, ShieldCheck } from 'lucide-react'

const DEFAULTS = {
  defaultCommissionRate: 10,
  refundGracePeriodDays: 7,
  minWithdrawalAmount: 1000,
  taxWithholdingRate: 5,
  taxThreshold: 1000,
  cookieLifetimeDays: 30,
  siteName: 'GUDO Academy｜整聊學院',
  maintenanceMode: false,
}

export function SettingsForm() {
  const [settings, setSettings] = useState(DEFAULTS)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(key: keyof typeof DEFAULTS, value: string | number | boolean) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: PATCH /api/admin/settings
    await new Promise((r) => setTimeout(r, 600))
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <CheckCircle className="w-4 h-4" /> 設定已儲存
        </div>
      )}

      {/* Commission settings */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Percent className="w-4 h-4 text-sky-500" /> 分潤設定
        </h2>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label htmlFor="defaultCommissionRate">預設分潤比例（%）</Label>
            <Input
              id="defaultCommissionRate"
              type="number"
              min={0}
              max={100}
              className="mt-1"
              value={settings.defaultCommissionRate}
              onChange={(e) => handleChange('defaultCommissionRate', Number(e.target.value))}
            />
            <p className="text-xs text-gray-400 mt-1">個別商品可自訂；未設定則使用此預設值</p>
          </div>

          <div>
            <Label htmlFor="refundGracePeriodDays">退款保留期（天）</Label>
            <Input
              id="refundGracePeriodDays"
              type="number"
              min={0}
              className="mt-1"
              value={settings.refundGracePeriodDays}
              onChange={(e) => handleChange('refundGracePeriodDays', Number(e.target.value))}
            />
            <p className="text-xs text-gray-400 mt-1">訂單付款後多少天內退款不計分潤</p>
          </div>
        </div>
      </div>

      {/* Withdrawal settings */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-sky-500" /> 請款設定
        </h2>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label htmlFor="minWithdrawalAmount">最低請款門檻（NT$）</Label>
            <Input
              id="minWithdrawalAmount"
              type="number"
              min={0}
              className="mt-1"
              value={settings.minWithdrawalAmount}
              onChange={(e) => handleChange('minWithdrawalAmount', Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="taxWithholdingRate">代扣稅率（%）</Label>
            <Input
              id="taxWithholdingRate"
              type="number"
              min={0}
              max={100}
              step={0.1}
              className="mt-1"
              value={settings.taxWithholdingRate}
              onChange={(e) => handleChange('taxWithholdingRate', Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="taxThreshold">起徵點（NT$）</Label>
            <Input
              id="taxThreshold"
              type="number"
              min={0}
              className="mt-1"
              value={settings.taxThreshold}
              onChange={(e) => handleChange('taxThreshold', Number(e.target.value))}
            />
            <p className="text-xs text-gray-400 mt-1">請款金額超過此門檻才代扣稅款</p>
          </div>
        </div>
      </div>

      {/* Tracking settings */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-500" /> 追蹤設定
        </h2>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label htmlFor="cookieLifetimeDays">推廣 Cookie 有效期（天）</Label>
            <Input
              id="cookieLifetimeDays"
              type="number"
              min={1}
              max={365}
              className="mt-1"
              value={settings.cookieLifetimeDays}
              onChange={(e) => handleChange('cookieLifetimeDays', Number(e.target.value))}
            />
            <p className="text-xs text-gray-400 mt-1">訪客點擊推廣連結後，有效追蹤的天數</p>
          </div>
        </div>
      </div>

      {/* Site settings */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-500" /> 網站設定
        </h2>

        <div>
          <Label htmlFor="siteName">網站名稱</Label>
          <Input
            id="siteName"
            className="mt-1"
            value={settings.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">維護模式</p>
            <p className="text-xs text-gray-500">開啟後前台將顯示維護中頁面</p>
          </div>
        </label>
      </div>

      <Button type="submit" variant="brand" size="lg" disabled={loading}>
        {loading ? '儲存中...' : '儲存設定'}
      </Button>
    </form>
  )
}

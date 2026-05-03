'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock, User, CreditCard, Shield, FileText } from 'lucide-react'

// Mock KYC data for the ambassador
const MOCK_KYC = {
  id: 'amb001',
  user: {
    name: '整理達人 Angie',
    email: 'angie@example.com',
    phone: '0912345678',
    registeredAt: '2025-04-28',
  },
  kyc: {
    status: 'PENDING' as 'PENDING' | 'APPROVED' | 'REJECTED',
    submittedAt: '2025-05-01',
    legalName: '陳安琪',
    idNumber: '****5678',   // masked
    idType: 'NATIONAL_ID',
    address: '台北市信義區信義路五段 100 號',
    bankCode: '004',
    bankBranch: '台北分行',
    bankAccount: '****5678',  // masked
    accountName: '陳安琪',
    idFrontImageUrl: null,   // In real app: URL to stored image
    idBackImageUrl: null,
  },
  stats: {
    totalClicks: 245,
    totalOrders: 4,
    totalCommission: 3030,
  },
}

type ReviewAction = 'APPROVED' | 'REJECTED'

interface Props {
  ambassadorId: string
}

export function KycReviewPanel({ ambassadorId: _ }: Props) {
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>(MOCK_KYC.kyc.status)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleReview(action: ReviewAction) {
    if (action === 'REJECTED' && !rejectReason.trim()) return
    setLoading(true)
    // TODO: PATCH /api/admin/ambassadors/[id]/kyc { action, reason }
    await new Promise((r) => setTimeout(r, 800))
    setStatus(action)
    setDone(true)
    setLoading(false)
  }

  const statusBadge = {
    PENDING: <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium">待審核</span>,
    APPROVED: <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">已通過</span>,
    REJECTED: <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-medium">已拒絕</span>,
  }

  return (
    <div className="space-y-6">
      {done && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          status === 'APPROVED'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {status === 'APPROVED'
            ? <CheckCircle className="w-5 h-5" />
            : <XCircle className="w-5 h-5" />
          }
          <span className="font-medium">
            {status === 'APPROVED' ? 'KYC 已通過，大使帳號已啟用' : 'KYC 已拒絕，系統將通知大使'}
          </span>
        </div>
      )}

      {/* User info */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-sky-500" /> 帳號資訊
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">暱稱</p>
            <p className="font-medium text-gray-900">{MOCK_KYC.user.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{MOCK_KYC.user.email}</p>
          </div>
          <div>
            <p className="text-gray-500">手機</p>
            <p className="font-medium text-gray-900">{MOCK_KYC.user.phone}</p>
          </div>
          <div>
            <p className="text-gray-500">註冊時間</p>
            <p className="font-medium text-gray-900">{MOCK_KYC.user.registeredAt}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{MOCK_KYC.stats.totalClicks}</p>
            <p className="text-xs text-gray-500">點擊次數</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{MOCK_KYC.stats.totalOrders}</p>
            <p className="text-xs text-gray-500">推廣訂單</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-sky-700">NT$ {MOCK_KYC.stats.totalCommission.toLocaleString()}</p>
            <p className="text-xs text-gray-500">累積分潤</p>
          </div>
        </div>
      </div>

      {/* KYC data */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-500" /> KYC 資料
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            提交於 {MOCK_KYC.kyc.submittedAt}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">真實姓名</p>
            <p className="font-medium text-gray-900">{MOCK_KYC.kyc.legalName}</p>
          </div>
          <div>
            <p className="text-gray-500">身分證字號</p>
            <p className="font-medium text-gray-900 font-mono">{MOCK_KYC.kyc.idNumber}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500">地址</p>
            <p className="font-medium text-gray-900">{MOCK_KYC.kyc.address}</p>
          </div>
        </div>

        <hr className="border-gray-100 my-4" />

        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-sky-500" /> 收款帳戶
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">銀行代號</p>
            <p className="font-medium text-gray-900">{MOCK_KYC.kyc.bankCode}</p>
          </div>
          <div>
            <p className="text-gray-500">分行</p>
            <p className="font-medium text-gray-900">{MOCK_KYC.kyc.bankBranch}</p>
          </div>
          <div>
            <p className="text-gray-500">帳號</p>
            <p className="font-medium text-gray-900 font-mono">{MOCK_KYC.kyc.bankAccount}</p>
          </div>
          <div>
            <p className="text-gray-500">戶名</p>
            <p className="font-medium text-gray-900">{MOCK_KYC.kyc.accountName}</p>
          </div>
        </div>

        <hr className="border-gray-100 my-4" />

        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-sky-500" /> 身分證件
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-xl h-32 flex items-center justify-center text-xs text-gray-400">
            {MOCK_KYC.kyc.idFrontImageUrl ? (
              <img src={MOCK_KYC.kyc.idFrontImageUrl} alt="身分證正面" className="w-full h-full object-contain rounded-xl" />
            ) : (
              '正面（未上傳）'
            )}
          </div>
          <div className="bg-gray-100 rounded-xl h-32 flex items-center justify-center text-xs text-gray-400">
            {MOCK_KYC.kyc.idBackImageUrl ? (
              <img src={MOCK_KYC.kyc.idBackImageUrl} alt="身分證背面" className="w-full h-full object-contain rounded-xl" />
            ) : (
              '背面（未上傳）'
            )}
          </div>
        </div>
      </div>

      {/* Review actions */}
      {status === 'PENDING' && !done && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">審核操作</h2>

          {showRejectForm ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">拒絕原因 *</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  rows={4}
                  placeholder="請說明拒絕原因，系統將通知大使..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleReview('REJECTED')}
                  disabled={loading || !rejectReason.trim()}
                >
                  {loading ? '處理中...' : '確認拒絕'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowRejectForm(false)}>
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                onClick={() => handleReview('APPROVED')}
                disabled={loading}
              >
                <CheckCircle className="w-4 h-4" />
                {loading ? '處理中...' : '通過審核'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowRejectForm(true)}
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                拒絕申請
              </Button>
            </div>
          )}
        </div>
      )}

      {status !== 'PENDING' && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <p className="text-sm text-gray-600">
            審核狀態：{statusBadge[status]}
          </p>
        </div>
      )}
    </div>
  )
}

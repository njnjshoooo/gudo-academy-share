'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  withdrawalId: string
  status: string
}

export function WithdrawalActions({ withdrawalId, status }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const router = useRouter()

  async function handleAction(action: 'APPROVED' | 'PAID' | 'REJECTED') {
    setLoading(action)
    try {
      const res = await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note: note || undefined }),
      })
      if (res.ok) {
        router.refresh()
      } else {
        const json = await res.json()
        alert(json.error || '操作失敗')
      }
    } catch {
      alert('網路錯誤')
    } finally {
      setLoading(null)
      setShowRejectForm(false)
    }
  }

  if (status === 'PENDING') {
    if (showRejectForm) {
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="拒絕原因"
            className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-red-400 focus:outline-none"
          />
          <div className="flex gap-1">
            <button
              onClick={() => handleAction('REJECTED')}
              disabled={!note || !!loading}
              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              {loading === 'REJECTED' ? '...' : '確認拒絕'}
            </button>
            <button
              onClick={() => setShowRejectForm(false)}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex gap-1 justify-center">
        <button
          onClick={() => handleAction('APPROVED')}
          disabled={!!loading}
          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
        >
          {loading === 'APPROVED' ? '...' : '核准'}
        </button>
        <button
          onClick={() => setShowRejectForm(true)}
          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
        >
          拒絕
        </button>
      </div>
    )
  }

  if (status === 'APPROVED') {
    return (
      <button
        onClick={() => handleAction('PAID')}
        disabled={!!loading}
        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
      >
        {loading === 'PAID' ? '處理中...' : '標記已撥款'}
      </button>
    )
  }

  return <span className="text-xs text-gray-400">—</span>
}

'use client'

import { useState } from 'react'
import { Copy, Check, Plus, Pencil, Trash2, Megaphone, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Template {
  id: string
  title: string
  content: string
  isOfficial: boolean
  platform?: string
}

const OFFICIAL_TEMPLATES: Template[] = [
  {
    id: 'o1',
    title: '整理術入門推薦',
    isOfficial: true,
    platform: '通用',
    content: `你知道嗎？台灣有將近 70% 的人對家裡的雜物感到壓力！

我最近上了「整聊初階課程」，完全改變了我對整理的想法！不是叫你丟東西，而是教你用對話的方式，了解自己真正需要什麼。

課程簡單易學，還有老師一對一答疑，強烈推薦給對整理術有興趣的朋友！

👉 用我的專屬優惠連結報名：{referralLink}`,
  },
  {
    id: 'o2',
    title: 'LINE 朋友圈版本',
    isOfficial: true,
    platform: 'LINE',
    content: `🏠 家裡越來越亂，心情越來越差？

整聊學院的整理術課程讓我找回了家的舒適感！

✅ 不強迫丟東西
✅ 從心理層面出發
✅ 有效維持整潔習慣

現在透過我的連結報名還有優惠！
👇 點這裡了解更多
{referralLink}`,
  },
  {
    id: 'o3',
    title: 'Instagram 貼文版',
    isOfficial: true,
    platform: 'Instagram',
    content: `整理不只是丟東西，而是重新認識自己 ✨

我花了 3 個月學習「整聊整理術」，現在的我...
- 家裡終於乾淨了 🏡
- 工作效率提升了 💼
- 心情更好了 😊

想要改變生活的你，值得試試看！
bio 連結可以找到課程資訊 👆

#整理術 #整聊學院 #GUDOAcademy #生活整理 #斷捨離`,
  },
]

export function TemplatesManager() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [personalTemplates, setPersonalTemplates] = useState<Template[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', content: '' })

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function addTemplate() {
    if (!form.title || !form.content) return
    const newTemplate: Template = {
      id: `p${Date.now()}`,
      title: form.title,
      content: form.content,
      isOfficial: false,
    }
    setPersonalTemplates([...personalTemplates, newTemplate])
    setForm({ title: '', content: '' })
    setIsAdding(false)
  }

  function updateTemplate() {
    if (!editingId) return
    setPersonalTemplates(personalTemplates.map((t) =>
      t.id === editingId ? { ...t, title: form.title, content: form.content } : t
    ))
    setEditingId(null)
    setForm({ title: '', content: '' })
  }

  function deleteTemplate(id: string) {
    setPersonalTemplates(personalTemplates.filter((t) => t.id !== id))
  }

  function startEdit(t: Template) {
    setEditingId(t.id)
    setForm({ title: t.title, content: t.content })
    setIsAdding(false)
  }

  return (
    <div className="space-y-8">
      {/* Official templates */}
      <section>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
          <Megaphone className="w-4 h-4 text-sky-500" />
          官方提供範本
        </h2>
        <div className="space-y-4">
          {OFFICIAL_TEMPLATES.map((t) => (
            <div key={t.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm">{t.title}</span>
                  {t.platform && (
                    <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                      {t.platform}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => copyToClipboard(t.content, t.id)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-sky-600 transition-colors"
                >
                  {copiedId === t.id ? (
                    <><Check className="w-3.5 h-3.5 text-green-500" /> 已複製</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> 複製</>
                  )}
                </button>
              </div>
              <pre className="px-5 py-4 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {t.content}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* Personal templates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <User className="w-4 h-4 text-violet-500" />
            我的話術範本
          </h2>
          {!isAdding && !editingId && (
            <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> 新增範本
            </Button>
          )}
        </div>

        {/* Add / Edit form */}
        {(isAdding || editingId) && (
          <div className="bg-white border border-sky-200 rounded-xl p-5 mb-4">
            <h3 className="font-medium text-gray-900 mb-4 text-sm">
              {editingId ? '編輯範本' : '新增自訂範本'}
            </h3>
            <div className="space-y-4">
              <div>
                <Label>範本標題</Label>
                <Input
                  className="mt-1"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="例：我的 IG 版本"
                />
              </div>
              <div>
                <Label>話術內容</Label>
                <textarea
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="輸入推廣話術。可使用 {referralLink} 代入您的推廣連結。"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="brand"
                  onClick={editingId ? updateTemplate : addTemplate}
                >
                  {editingId ? '儲存' : '新增'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setIsAdding(false); setEditingId(null); setForm({ title: '', content: '' }) }}
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        )}

        {personalTemplates.length === 0 && !isAdding ? (
          <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-xl">
            <Megaphone className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">還沒有自訂範本</p>
            <p className="text-xs text-gray-300 mt-1">點擊上方「新增範本」按鈕來建立</p>
          </div>
        ) : (
          <div className="space-y-4">
            {personalTemplates.map((t) => (
              <div key={t.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50 bg-gray-50">
                  <span className="font-medium text-gray-900 text-sm">{t.title}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(t.content, t.id)}
                      className="text-xs text-gray-500 hover:text-sky-600 transition-colors flex items-center gap-1"
                    >
                      {copiedId === t.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      複製
                    </button>
                    <button
                      onClick={() => startEdit(t)}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTemplate(t.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <pre className="px-5 py-4 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {t.content}
                </pre>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

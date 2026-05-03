'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Category {
  id: string
  name: string
  slug: string
  productCount: number
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: '初階課程', slug: 'basic', productCount: 1 },
  { id: 'cat2', name: '中階課程', slug: 'intermediate', productCount: 1 },
  { id: 'cat3', name: '高階課程', slug: 'advanced', productCount: 1 },
  { id: 'cat4', name: '培訓營', slug: 'bootcamp', productCount: 2 },
  { id: 'cat5', name: '軟裝整理', slug: 'soft-furnishing', productCount: 1 },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', slug: '' })

  function slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  function addCategory() {
    if (!form.name || !form.slug) return
    const newCat: Category = {
      id: `cat${Date.now()}`,
      name: form.name,
      slug: form.slug,
      productCount: 0,
    }
    setCategories([...categories, newCat])
    setForm({ name: '', slug: '' })
    setIsAdding(false)
  }

  function updateCategory() {
    if (!editingId) return
    setCategories(categories.map((c) =>
      c.id === editingId ? { ...c, name: form.name, slug: form.slug } : c
    ))
    setEditingId(null)
    setForm({ name: '', slug: '' })
  }

  function deleteCategory(id: string) {
    setCategories(categories.filter((c) => c.id !== id))
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setForm({ name: cat.name, slug: cat.slug })
    setIsAdding(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分類管理</h1>
          <p className="text-gray-500 mt-1 text-sm">管理課程商品的分類標籤</p>
        </div>
        {!isAdding && !editingId && (
          <Button size="sm" variant="brand" onClick={() => setIsAdding(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> 新增分類
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white border border-sky-200 rounded-xl p-5 mb-4">
          <h2 className="font-medium text-gray-900 mb-4 text-sm">
            {editingId ? '編輯分類' : '新增分類'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>分類名稱</Label>
              <Input
                className="mt-1"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value, slug: slugify(e.target.value) })}
                placeholder="例：初階課程"
              />
            </div>
            <div>
              <Label>Slug（URL 路徑）</Label>
              <Input
                className="mt-1"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="例：basic"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="brand" onClick={editingId ? updateCategory : addCategory}>
              {editingId ? '儲存' : '新增'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setIsAdding(false); setEditingId(null); setForm({ name: '', slug: '' }) }}
            >
              取消
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium">分類名稱</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-right px-4 py-3 font-medium">商品數</th>
              <th className="text-center px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-sky-400" />
                  {cat.name}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{cat.slug}</td>
                <td className="px-4 py-3 text-right text-gray-600">{cat.productCount}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      disabled={cat.productCount > 0}
                      title={cat.productCount > 0 ? '有商品使用此分類，無法刪除' : '刪除'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Plus, Trash2, ImagePlus } from 'lucide-react'

const productSchema = z.object({
  name: z.string().min(2, '請輸入商品名稱'),
  slug: z.string().min(2, '請輸入 URL Slug').regex(/^[a-z0-9-]+$/, '只允許小寫英文、數字和連字號'),
  shortDescription: z.string().max(200, '簡介不超過 200 字').optional(),
  price: z.number().positive('價格必須大於 0'),
  comparePrice: z.number().optional(),
  stock: z.number().int().min(0, '庫存不可為負').optional(),
  commissionType: z.enum(['PERCENTAGE', 'FIXED', 'SYSTEM_DEFAULT']),
  commissionValue: z.number().min(0).optional(),
  isPublished: z.boolean(),
  allowBackorder: z.boolean(),
  defaultShareText: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

const CATEGORIES = [
  { id: 'cat1', name: '初階課程' },
  { id: 'cat2', name: '中階課程' },
  { id: 'cat3', name: '高階課程' },
  { id: 'cat4', name: '培訓營' },
  { id: 'cat5', name: '軟裝整理' },
]

interface Variant {
  id: string
  name: string
  price: number
  stock: number
  sku: string
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData & { id: string; variants: Variant[]; categoryIds: string[] }>
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.categoryIds || [])
  const [variants, setVariants] = useState<Variant[]>(initialData?.variants || [])
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      commissionType: 'SYSTEM_DEFAULT',
      isPublished: false,
      allowBackorder: false,
      ...initialData,
    },
  })

  const commissionType = watch('commissionType')

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  function addVariant() {
    setVariants([...variants, { id: `v${Date.now()}`, name: '', price: 0, stock: 0, sku: '' }])
  }

  function removeVariant(id: string) {
    setVariants(variants.filter((v) => v.id !== id))
  }

  function updateVariant(id: string, field: keyof Omit<Variant, 'id'>, value: string | number) {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setMainImagePreview(url)
    }
  }

  async function onSubmit(data: ProductFormData) {
    setLoading(true)
    // TODO: POST/PATCH /api/admin/products
    const payload = { ...data, description, categoryIds: selectedCategories, variants }
    console.log('Product payload:', payload)
    await new Promise((r) => setTimeout(r, 800))
    router.push('/admin/products')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic info */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">基本資訊</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Label htmlFor="name">商品名稱 *</Label>
            <Input id="name" className="mt-1" placeholder="例：整聊初階課程" {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="slug">URL Slug *</Label>
            <div className="flex mt-1">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                /product/
              </span>
              <Input id="slug" placeholder="tidylist-basic" className="rounded-l-none" {...register('slug')} />
            </div>
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <Label htmlFor="shortDescription">簡介（選填）</Label>
            <Input id="shortDescription" className="mt-1" placeholder="簡短說明，顯示於商品列表" {...register('shortDescription')} />
          </div>
        </div>

        <div>
          <Label>詳細描述</Label>
          <textarea
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="課程詳細介紹、大綱、師資等..."
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">商品圖片</h2>
        <label className="block">
          <div className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-colors ${mainImagePreview ? 'border-sky-300' : 'border-gray-200 hover:border-gray-300'}`}>
            {mainImagePreview ? (
              <img src={mainImagePreview} alt="Preview" className="w-full h-full object-contain rounded-xl p-2" />
            ) : (
              <>
                <ImagePlus className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">點擊上傳主圖</p>
                <p className="text-xs text-gray-300 mt-1">建議 1200×630px，JPG/PNG/WebP</p>
              </>
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>

      {/* Pricing */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">定價</h2>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label htmlFor="price">售價（NT$）*</Label>
            <Input
              id="price"
              type="number"
              className="mt-1"
              placeholder="3980"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <Label htmlFor="comparePrice">原價（NT$，劃線用）</Label>
            <Input
              id="comparePrice"
              type="number"
              className="mt-1"
              placeholder="5980"
              {...register('comparePrice', { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">庫存</h2>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label htmlFor="stock">庫存數量（空白 = 無限制）</Label>
            <Input
              id="stock"
              type="number"
              className="mt-1"
              placeholder="0 = 無庫存管理"
              {...register('stock', { valueAsNumber: true })}
            />
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="accent-sky-500 w-4 h-4" {...register('allowBackorder')} />
          <span className="text-sm text-gray-700">允許超賣（庫存不足時仍可購買）</span>
        </label>
      </div>

      {/* Commission */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">分潤設定</h2>
        <div>
          <Label htmlFor="commissionType">分潤類型</Label>
          <select
            id="commissionType"
            className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            {...register('commissionType')}
          >
            <option value="SYSTEM_DEFAULT">使用系統預設（10%）</option>
            <option value="PERCENTAGE">自訂百分比</option>
            <option value="FIXED">固定金額</option>
          </select>
        </div>
        {commissionType !== 'SYSTEM_DEFAULT' && (
          <div>
            <Label htmlFor="commissionValue">
              {commissionType === 'PERCENTAGE' ? '分潤比例（%）' : '固定分潤金額（NT$）'}
            </Label>
            <Input
              id="commissionValue"
              type="number"
              className="mt-1"
              placeholder={commissionType === 'PERCENTAGE' ? '例：15' : '例：500'}
              {...register('commissionValue', { valueAsNumber: true })}
            />
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">分類</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                selectedCategories.includes(cat.id)
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">商品規格（選填）</h2>
          <Button type="button" size="sm" variant="outline" onClick={addVariant}>
            <Plus className="w-3.5 h-3.5 mr-1" /> 新增規格
          </Button>
        </div>
        {variants.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">無規格（單一商品）</p>
        ) : (
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={v.id} className="grid grid-cols-4 gap-3 items-end bg-gray-50 p-3 rounded-lg">
                <div>
                  <Label className="text-xs">規格名稱</Label>
                  <Input
                    className="mt-1 text-sm"
                    placeholder={`規格 ${i + 1}`}
                    value={v.name}
                    onChange={(e) => updateVariant(v.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">價格（NT$）</Label>
                  <Input
                    type="number"
                    className="mt-1 text-sm"
                    value={v.price}
                    onChange={(e) => updateVariant(v.id, 'price', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="text-xs">庫存</Label>
                  <Input
                    type="number"
                    className="mt-1 text-sm"
                    value={v.stock}
                    onChange={(e) => updateVariant(v.id, 'stock', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => removeVariant(v.id)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promote default text */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">推廣預設文案</h2>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          rows={4}
          placeholder="預設的推廣文案，大使可在推廣頁複製使用。可用 {referralLink} 代入連結。"
          {...register('defaultShareText')}
        />
      </div>

      {/* Publish status */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="accent-sky-500 w-4 h-4" {...register('isPublished')} />
          <div>
            <p className="font-medium text-gray-900 text-sm">立即發佈</p>
            <p className="text-xs text-gray-500">取消勾選則儲存為草稿</p>
          </div>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" variant="brand" size="lg" disabled={loading}>
          {loading ? '儲存中...' : '儲存商品'}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  )
}

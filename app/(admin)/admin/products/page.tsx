import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { mockProducts } from '@/lib/mock-data'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '商品管理' }

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-500 text-sm mt-1">上架、編輯商品與設定分潤比例</p>
        </div>
        <Button variant="brand" size="sm" asChild>
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4" />
            新增商品
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <th className="text-left px-5 py-3 font-medium">商品</th>
              <th className="text-left px-5 py-3 font-medium">SKU</th>
              <th className="text-left px-5 py-3 font-medium">分類</th>
              <th className="text-right px-5 py-3 font-medium">售價</th>
              <th className="text-right px-5 py-3 font-medium">原價</th>
              <th className="text-center px-5 py-3 font-medium">庫存</th>
              <th className="text-center px-5 py-3 font-medium">分潤設定</th>
              <th className="text-center px-5 py-3 font-medium">狀態</th>
              <th className="text-center px-5 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors text-sm">
                <td className="px-5 py-4 max-w-[200px]">
                  <p className="font-medium text-gray-900 line-clamp-2 text-xs leading-snug">
                    {product.name}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span className="font-mono text-xs text-gray-600">{product.sku}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs text-gray-600">{product.categories[0]?.name || '-'}</span>
                </td>
                <td className="px-5 py-4 text-right font-bold text-sky-600 text-sm">
                  {formatCurrency(product.salePrice)}
                </td>
                <td className="px-5 py-4 text-right text-gray-400 text-xs line-through">
                  {formatCurrency(product.originalPrice)}
                </td>
                <td className="px-5 py-4 text-center">
                  <span className={`text-xs font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 5 ? 'text-amber-600' : 'text-green-600'}`}>
                    {product.stock === 0 ? '售完' : product.stock}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
                    {product.commissionType === 'FIXED'
                      ? `固定 ${formatCurrency(product.commissionValue!)}`
                      : product.commissionType === 'PERCENTAGE'
                      ? `${product.commissionValue}%`
                      : '系統預設'}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <Badge variant={product.isActive ? 'success' : 'secondary'}>
                    {product.isActive ? '上架' : '下架'}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-center">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    編輯
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { Suspense } from 'react'
import { ProductGrid } from '@/components/storefront/product-grid'
import { CategoryFilter } from '@/components/storefront/category-filter'
import { mockCategories, mockProducts } from '@/lib/mock-data'

interface Props {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>
}

export const metadata = {
  title: '整聊認證課程全系列',
  description: '初階、中階、高階整聊課程，以及人生整聊學院、軟裝服務等完整系列。',
}

export default async function TidylistPage({ searchParams }: Props) {
  const params = await searchParams
  const { category, sort, q } = params

  // 篩選商品
  let products = mockProducts.filter((p) => p.isActive)

  if (category) {
    products = products.filter((p) =>
      p.categories.some((c) => c.slug === category)
    )
  }

  if (q) {
    const query = q.toLowerCase()
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query)
    )
  }

  // 排序
  switch (sort) {
    case 'price_asc':
      products = [...products].sort((a, b) => a.salePrice - b.salePrice)
      break
    case 'price_desc':
      products = [...products].sort((a, b) => b.salePrice - a.salePrice)
      break
    case 'newest':
      // 假資料維持預設順序
      break
    default:
      // 特色商品優先
      products = [...products].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            整聊認證課程全系列
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            初階整聊、中階整聊、高階整聊｜軟裝服務｜人生整聊學院
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter */}
          <aside className="lg:w-52 flex-shrink-0">
            <CategoryFilter
              categories={mockCategories}
              selectedCategory={category}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-lg px-4 py-3 border border-gray-100">
              <p className="text-sm text-gray-500">
                共 <span className="font-semibold text-gray-900">{products.length}</span> 件商品
              </p>
              <SortSelect currentSort={sort} />
            </div>

            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function SortSelect({ currentSort }: { currentSort?: string }) {
  const options = [
    { value: '', label: '預設排序' },
    { value: 'newest', label: '最新上架' },
    { value: 'price_asc', label: '價格低到高' },
    { value: 'price_desc', label: '價格高到低' },
  ]

  return (
    <form>
      <select
        name="sort"
        defaultValue={currentSort || ''}
        onChange={(e) => {
          const form = e.target.form
          if (form) form.requestSubmit()
        }}
        className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
          <div className="bg-gray-200 aspect-[4/3]" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-5 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

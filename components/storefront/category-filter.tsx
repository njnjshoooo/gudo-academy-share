'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  sortOrder: number
}

interface Props {
  categories: Category[]
  selectedCategory?: string
}

export function CategoryFilter({ categories, selectedCategory }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="font-semibold text-gray-900 mb-3 text-sm">課程分類</h3>
      <ul className="space-y-1">
        <li>
          <Link
            href="/tidylist"
            className={cn(
              'block px-3 py-2 rounded-lg text-sm transition-colors',
              !selectedCategory
                ? 'bg-sky-50 text-sky-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            全部課程
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/tidylist?category=${cat.slug}`}
              className={cn(
                'block px-3 py-2 rounded-lg text-sm transition-colors',
                selectedCategory === cat.slug
                  ? 'bg-sky-50 text-sky-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

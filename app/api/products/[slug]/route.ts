import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const product = await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        categories: { include: { category: true } },
        variants: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: '商品不存在' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product detail API error:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

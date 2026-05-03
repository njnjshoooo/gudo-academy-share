import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 開始建立種子資料...')

  // 管理員帳號
  const adminPassword = await bcrypt.hash('admin1234', 12)
  await prisma.user.upsert({
    where: { email: 'admin@gudo-academy.com' },
    update: {},
    create: {
      name: '系統管理員',
      email: 'admin@gudo-academy.com',
      phone: '0900000000',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ 管理員帳號：admin@gudo-academy.com / admin1234')

  // 示範大使帳號
  const ambassadorPassword = await bcrypt.hash('demo1234', 12)
  const ambassadorUser = await prisma.user.upsert({
    where: { email: 'demo@gudo-academy.com' },
    update: {},
    create: {
      name: '示範大使 Angie',
      email: 'demo@gudo-academy.com',
      phone: '0912345678',
      password: ambassadorPassword,
      role: 'AMBASSADOR',
    },
  })

  await prisma.ambassador.upsert({
    where: { userId: ambassadorUser.id },
    update: {},
    create: {
      userId: ambassadorUser.id,
      referralCode: 'ANGIE001',
      status: 'ACTIVE',
      realName: '陳安琪',
      idNumber: 'A123456789',
      birthDate: new Date('1990-01-01'),
      registeredAddr: '台北市信義區信義路五段100號',
      contactAddr: '台北市信義區信義路五段100號',
      idCardFrontUrl: 'placeholder',
      idCardBackUrl: 'placeholder',
      bankCode: '004',
      bankBranch: '台北分行',
      bankAccount: '0123456789',
      bankAccountName: '陳安琪',
      bankBookUrl: 'placeholder',
    },
  })
  console.log('✅ 大使帳號：demo@gudo-academy.com / demo1234 (代碼: ANGIE001)')

  // 商品分類
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'basic' }, update: {}, create: { name: '初階課程', slug: 'basic' } }),
    prisma.category.upsert({ where: { slug: 'intermediate' }, update: {}, create: { name: '中階課程', slug: 'intermediate' } }),
    prisma.category.upsert({ where: { slug: 'advanced' }, update: {}, create: { name: '高階課程', slug: 'advanced' } }),
    prisma.category.upsert({ where: { slug: 'bootcamp' }, update: {}, create: { name: '培訓營', slug: 'bootcamp' } }),
    prisma.category.upsert({ where: { slug: 'soft-furnishing' }, update: {}, create: { name: '軟裝整理', slug: 'soft-furnishing' } }),
  ])
  console.log('✅ 商品分類已建立')

  // 商品（使用 schema 中的欄位名稱）
  const productsData = [
    { sku: 'BASIC-001', name: '整聊初階課程', slug: 'tidylist-basic', salePrice: 3980, originalPrice: 5980, categorySlug: 'basic',
      description: '適合剛開始學習整理術的朋友，透過整聊方法論建立正確整理觀念，讓家裡煥然一新。' },
    { sku: 'INTER-001', name: '整聊中階課程', slug: 'tidylist-intermediate', salePrice: 6980, originalPrice: 9800, categorySlug: 'intermediate',
      description: '深入學習進階整理技巧，從個人空間延伸到全家共用區域。' },
    { sku: 'ADV-001', name: '整聊高階課程', slug: 'tidylist-advanced', salePrice: 12800, originalPrice: 16800, categorySlug: 'advanced',
      description: '全面掌握整聊整理術，學習如何教導家人一起維持整潔。' },
    { sku: 'BOOT-B01', name: '整聊培訓營（基礎班）', slug: 'tidylist-bootcamp-basic', salePrice: 18800, originalPrice: 24000, categorySlug: 'bootcamp',
      description: '3天2夜密集訓練，小班制互動教學。' },
    { sku: 'BOOT-A01', name: '整聊培訓營（進階班）', slug: 'tidylist-bootcamp-advanced', salePrice: 28000, originalPrice: 36000, categorySlug: 'bootcamp',
      description: '取得整聊認證資格，開啟整理諮詢副業。' },
    { sku: 'SOFT-001', name: '整聊軟裝整理班', slug: 'tidylist-soft-furnishing', salePrice: 10900, originalPrice: 14900, categorySlug: 'soft-furnishing',
      description: '學習透過整理與軟裝搭配提升家的質感。' },
  ]

  for (const p of productsData) {
    const { categorySlug, ...data } = p
    const cat = categories.find(c => c.slug === categorySlug)
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...data,
        mainImage: `/images/products/${p.slug}.jpg`,
        commissionType: 'PERCENTAGE',
        commissionValue: 10,
        defaultShareText: `推薦整聊課程給你！\n{referralLink}`,
        allowBackorder: false,
        isActive: true,
        categories: cat ? { create: { categoryId: cat.id } } : undefined,
      },
    })
  }
  console.log('✅ 6 個示範商品已建立')

  console.log('\n🎉 種子資料建立完成！')
  console.log('管理員：admin@gudo-academy.com / admin1234')
  console.log('大使：  demo@gudo-academy.com / demo1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

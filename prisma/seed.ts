import { PrismaClient, CommissionType } from '@prisma/client'
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

  // 清除舊商品資料（保留使用者）
  await prisma.productCategory.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  console.log('🗑️ 舊商品資料已清除')

  // 商品分類（對應真實課程）
  const catBeginner    = await prisma.category.create({ data: { name: '初階整聊', slug: 'beginner', sortOrder: 1 } })
  const catInter       = await prisma.category.create({ data: { name: '中階整聊', slug: 'intermediate', sortOrder: 2 } })
  const catCert        = await prisma.category.create({ data: { name: '整聊師認證課程', slug: 'certification', sortOrder: 3 } })
  const catLifeAcademy = await prisma.category.create({ data: { name: '人生整聊學院', slug: 'life-academy', sortOrder: 4 } })
  const catSoftDeco    = await prisma.category.create({ data: { name: '軟裝服務', slug: 'soft-deco', sortOrder: 5 } })
  console.log('✅ 商品分類已建立')

  // 真實課程資料
  const productsData = [
    {
      sku: 'L1-001', slug: 'course-l1',
      name: '整聊師培訓課程 L1初階實戰篇',
      description: '從零開始學整理，建立整聊師的核心基礎技能，適合想改變生活空間的你。',
      salePrice: 4000, originalPrice: 4000,
      mainImage: '/images/products/course-l1.png',
      commissionType: CommissionType.PERCENTAGE, commissionValue: 10,
      isActive: true, stock: 20,
      categoryId: catBeginner.id,
    },
    {
      sku: 'L2-001', slug: 'course-l2',
      name: '整聊師培訓課程 L2中階修煉篇',
      description: '深化整理技法與心法，學習如何協助他人建立系統化的整理習慣。',
      salePrice: 16000, originalPrice: 16000,
      mainImage: '/images/products/course-l2.png',
      commissionType: CommissionType.PERCENTAGE, commissionValue: 10,
      isActive: true, stock: 15,
      categoryId: catInter.id,
    },
    {
      sku: 'L3-001', slug: 'course-l3',
      name: '整聊師培訓課程 L3榮耀授袍簽約',
      description: '完成中階課程的最終認證，正式取得整聊師資格，成為認證整聊師。',
      salePrice: 2000, originalPrice: 2000,
      mainImage: '/images/products/course-l3.png',
      commissionType: CommissionType.PERCENTAGE, commissionValue: 10,
      isActive: true, stock: 20,
      categoryId: catInter.id,
    },
    {
      sku: 'BUNDLE-L1L2', slug: 'course-bundle-l1l2',
      name: '【初＋中】整聊技法心法一次學',
      description: '初階 + 中階課程套組，一次學完整聊技法與心法，超值組合價更划算。',
      salePrice: 18000, originalPrice: 20000,
      mainImage: '/images/products/course-bundle-l1l2.png',
      commissionType: CommissionType.PERCENTAGE, commissionValue: 10,
      isActive: true, stock: 15,
      categoryId: catInter.id,
    },
    {
      sku: 'BUNDLE-FULL', slug: 'course-bundle-full',
      name: '【初＋中＋認證測驗】直接成為整聊師',
      description: '初階＋中階＋認證測驗三合一，最快捷徑直接取得整聊師認證。',
      salePrice: 20000, originalPrice: 22000,
      mainImage: '/images/products/course-bundle-full.png',
      commissionType: CommissionType.PERCENTAGE, commissionValue: 10,
      isActive: true, stock: 15,
      categoryId: catCert.id,
    },
    {
      sku: 'CAMP-001', slug: 'course-training-camp',
      name: '整聊實作訓練營｜最硬派整理訓練課',
      description: '最紮實的整理實作訓練，透過密集實戰演練，讓整理能力脫胎換骨。',
      salePrice: 20000, originalPrice: 20000,
      mainImage: '/images/products/course-training-camp.png',
      commissionType: CommissionType.PERCENTAGE, commissionValue: 10,
      isActive: true, stock: 10,
      categoryId: catInter.id,
    },
    {
      sku: 'MOVE-001', slug: 'course-moving',
      name: '搬家手實作1日課',
      description: '一日密集課程，學習搬家整理的實戰技巧，讓搬家不再是噩夢。',
      salePrice: 3000, originalPrice: 3000,
      mainImage: '/images/products/course-moving.png',
      commissionType: CommissionType.PERCENTAGE, commissionValue: 10,
      isActive: true, stock: 0,
      categoryId: catBeginner.id,
    },
    {
      sku: 'AMB-2025', slug: 'course-ambassador-2025',
      name: '【整聊高階】2025品牌大使培訓營',
      description: '三天兩夜密集培訓，完整品牌大使技能養成，開啟整聊師資格與副業收入。',
      salePrice: 27000, originalPrice: 35000,
      mainImage: '/images/products/course-ambassador-2025.png',
      commissionType: CommissionType.FIXED, commissionValue: 2000,
      isActive: true, stock: 12,
      categoryId: catCert.id,
    },
    {
      sku: 'SOFT-001', slug: 'course-soft-deco',
      name: '【整聊高階】軟裝師認證課程',
      description: '成為軟裝師，從整理延伸到空間佈置設計，打造質感生活空間的完整訓練。',
      salePrice: 30000, originalPrice: 30000,
      mainImage: '/images/products/course-soft-deco.jpg',
      commissionType: CommissionType.FIXED, commissionValue: 3000,
      isActive: true, stock: 0,
      categoryId: catSoftDeco.id,
    },
    {
      sku: 'FASHION-001', slug: 'course-fashion',
      name: '穿搭諮詢師實戰班',
      description: '從衣櫃整理到穿搭風格建立，成為專業穿搭諮詢師的完整訓練課程。',
      salePrice: 12000, originalPrice: 12000,
      mainImage: '/images/products/course-fashion.png',
      commissionType: CommissionType.PERCENTAGE, commissionValue: 10,
      isActive: true, stock: 0,
      categoryId: catLifeAcademy.id,
    },
    {
      sku: 'FASHION-ONLINE-001', slug: 'course-fashion-online',
      name: '【穿搭線上體驗課】衣櫃斷捨離！打造美好穿搭人生',
      description: '線上課程，學習衣櫃斷捨離與穿搭搭配技巧，小預算打造高質感衣著。',
      salePrice: 1280, originalPrice: 2200,
      mainImage: '/images/products/course-fashion-online.png',
      commissionType: CommissionType.FIXED, commissionValue: 200,
      isActive: true, stock: 50,
      categoryId: catLifeAcademy.id,
    },
  ]

  for (const p of productsData) {
    const { categoryId, ...data } = p
    await prisma.product.create({
      data: {
        ...data,
        defaultShareText: `我在居家整聊室找到這堂好課！\n{referralLink}`,
        allowBackorder: false,
        categories: { create: { categoryId } },
      },
    })
  }
  console.log(`✅ ${productsData.length} 個課程已建立`)

  console.log('\n🎉 種子資料建立完成！')
  console.log('管理員：admin@gudo-academy.com / admin1234')
  console.log('大使：  demo@gudo-academy.com / demo1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

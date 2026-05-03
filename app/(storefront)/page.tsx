import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Award, BookOpen, CheckCircle } from 'lucide-react'

const featuredCourses = [
  {
    slug: 'course-l1',
    name: '整聊師培訓課程 L1初階實戰篇',
    category: '初階整聊',
    price: 4000,
    originalPrice: 4000,
    image: '/images/products/course-l1.png',
    desc: '從零開始學整理，建立整聊師的核心基礎技能',
  },
  {
    slug: 'course-bundle-l1l2',
    name: '【初＋中】整聊技法心法一次學',
    category: '超值套組',
    price: 18000,
    originalPrice: 20000,
    image: '/images/products/course-bundle-l1l2.png',
    desc: '初階＋中階一次學完，超值組合價省 2,000 元',
  },
  {
    slug: 'course-ambassador-2025',
    name: '【整聊高階】2025品牌大使培訓營',
    category: '整聊師認證課程',
    price: 27000,
    originalPrice: 35000,
    image: '/images/products/course-ambassador-2025.png',
    desc: '三天兩夜密集培訓，開啟整聊師資格與副業收入',
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-stone-50 via-amber-50 to-green-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            整聊認證課程全系列開放報名
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            從家出發，
            <span className="text-green-700">品味生活</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            居家整聊室整聊認證課程，讓你學會整理與溝通的力量，
            打造屬於你的美好生活，成為整聊師，甚至開啟副業收入。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" asChild className="bg-green-700 hover:bg-green-800 text-white">
              <Link href="/tidylist">
                瀏覽所有課程 <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/register">成為推廣大使</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Users, number: '500+', label: '認證學員' },
            { icon: BookOpen, number: '11', label: '系列課程' },
            { icon: Award, number: '98%', label: '學員滿意度' },
            { icon: CheckCircle, number: '200+', label: '推廣大使' },
          ].map(({ icon: Icon, number, label }) => (
            <div key={label} className="space-y-2">
              <Icon className="w-8 h-8 text-green-600 mx-auto" />
              <div className="text-2xl font-bold text-gray-900">{number}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">熱門課程</h2>
            <p className="text-gray-600">選擇適合你的整聊學習路徑</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredCourses.map((course) => (
              <Link key={course.slug} href={`/product/${course.slug}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {course.category}
                    </div>
                    {course.originalPrice > course.price && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        省 NT${(course.originalPrice - course.price).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-green-700 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">{course.desc}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-green-700 text-lg">
                          NT${course.price.toLocaleString()}
                        </span>
                        {course.originalPrice > course.price && (
                          <span className="text-xs text-gray-400 line-through ml-2">
                            NT${course.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-green-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        了解詳情 <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/tidylist">查看全部 11 堂課程</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Course Path */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">整聊師認證旅途</h2>
            <p className="text-gray-600">從初階到高階，一步步成為專業整聊師</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '01', level: 'L1 初階', title: '實戰篇', price: 'NT$4,000', desc: '建立核心整理觀念與技能', slug: 'course-l1', color: 'bg-green-50 border-green-200' },
              { step: '02', level: 'L2 中階', title: '修煉篇', price: 'NT$16,000', desc: '深化技法，協助他人整理', slug: 'course-l2', color: 'bg-blue-50 border-blue-200' },
              { step: '03', level: 'L3 高階', title: '榮耀授袍', price: 'NT$2,000', desc: '通過認證，正式成為整聊師', slug: 'course-l3', color: 'bg-amber-50 border-amber-200' },
            ].map((item) => (
              <Link key={item.step} href={`/product/${item.slug}`} className="group">
                <div className={`border rounded-xl p-5 ${item.color} hover:shadow-sm transition-shadow`}>
                  <div className="text-3xl font-black text-gray-200 mb-2">{item.step}</div>
                  <div className="text-xs text-green-700 font-bold mb-1">{item.level}</div>
                  <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                  <div className="text-sm text-gray-500 mb-3">{item.desc}</div>
                  <div className="font-bold text-green-700">{item.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ambassador CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">成為整聊推廣大使</h2>
          <p className="text-green-100 text-lg mb-8 leading-relaxed">
            把你對整聊的熱愛分享給更多人，
            透過專屬推廣連結，每成功推薦一位學員，
            最高可獲得 NT$3,000 分潤獎金。
          </p>
          <Button size="xl" className="bg-white text-green-700 hover:bg-green-50" asChild>
            <Link href="/register">立即申請成為大使</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

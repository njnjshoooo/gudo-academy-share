import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Users, Award, BookOpen } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sky-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            整聊認證課程正式開放報名
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            整理生活，
            <span className="text-sky-500">整聊</span>
            人生
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            透過整聊學院的認證課程，學習整理與溝通的力量，
            打造屬於你的美好生活，同時分享給更多需要的人。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="brand" asChild>
              <Link href="/tidylist">
                瀏覽所有課程 <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/ambassador">成為推廣大使</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Users, number: '500+', label: '認證學員' },
            { icon: BookOpen, number: '6', label: '系列課程' },
            { icon: Award, number: '98%', label: '學員滿意度' },
            { icon: Star, number: '200+', label: '推廣大使' },
          ].map(({ icon: Icon, number, label }) => (
            <div key={label} className="space-y-2">
              <Icon className="w-8 h-8 text-sky-500 mx-auto" />
              <div className="text-2xl font-bold text-gray-900">{number}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Course Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">熱門課程</h2>
            <p className="text-gray-600">選擇適合你的學習路徑</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                level: '初階',
                title: '整聊初階認證課程',
                desc: '從零開始，建立整理與溝通的基礎技能',
                price: 'NT$27,000',
                color: 'from-sky-400 to-blue-500',
                href: '/product/online_basic',
              },
              {
                level: '中階',
                title: '整聊中階進階課程',
                desc: '深化整理技能，學習協助他人的方法',
                price: 'NT$38,000',
                color: 'from-violet-400 to-purple-500',
                href: '/product/online_intermediate',
              },
              {
                level: '高階',
                title: '整聊高階師資培訓',
                desc: '成為認證整聊師資，開展顧問事業',
                price: 'NT$72,000',
                color: 'from-amber-400 to-orange-500',
                href: '/product/online_advanced',
              },
            ].map((course) => (
              <Link key={course.level} href={course.href} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className={`bg-gradient-to-br ${course.color} p-8 text-white`}>
                    <div className="text-sm font-medium bg-white/20 rounded-full px-3 py-1 inline-block mb-3">
                      {course.level}
                    </div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm mb-3">{course.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-600">{course.price}</span>
                      <span className="text-sm text-sky-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
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
              <Link href="/tidylist">查看全部課程</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ambassador CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-sky-600 to-violet-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">成為整聊推廣大使</h2>
          <p className="text-sky-100 text-lg mb-8 leading-relaxed">
            把你對整聊的熱愛分享給更多人，
            透過專屬推廣連結，將人脈轉化為被動收入。
            每成功推薦一位學員，即可獲得高達 10-15% 的分潤獎金。
          </p>
          <Button size="xl" className="bg-white text-sky-600 hover:bg-sky-50" asChild>
            <Link href="/register">立即申請成為大使</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

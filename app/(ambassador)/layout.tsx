import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AmbassadorSidebar } from '@/components/ambassador/sidebar'
import { AmbassadorHeader } from '@/components/ambassador/header'
import { AmbassadorMobileNav } from '@/components/ambassador/mobile-nav'

export default async function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if ((session.user as any).role === 'ADMIN') {
    redirect('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar (hidden on mobile) */}
      <AmbassadorSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AmbassadorHeader />
        {/* pb-20 on mobile to avoid content hiding behind bottom nav */}
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <AmbassadorMobileNav />
    </div>
  )
}

import { AmbassadorSidebar } from '@/components/ambassador/sidebar'
import { AmbassadorHeader } from '@/components/ambassador/header'

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AmbassadorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AmbassadorHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

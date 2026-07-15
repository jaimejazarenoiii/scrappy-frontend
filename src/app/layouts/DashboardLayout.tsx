import { Outlet } from 'react-router'

import { Breadcrumb } from '@/components/common/Breadcrumb'
import { Footer } from '@/components/common/Footer'
import { Header } from '@/components/common/Header'
import { Sidebar } from '@/components/common/Sidebar'

export function DashboardLayout() {
  return (
    <div className="bg-background flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <div className="bg-muted/30 border-b px-4 py-2.5 md:px-6">
          <Breadcrumb />
        </div>
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

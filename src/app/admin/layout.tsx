import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-darker">
      <AdminSidebar />
      <div className="ml-64 flex flex-col h-screen overflow-y-auto">{children}</div>
    </div>
  )
}

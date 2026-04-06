import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-brand-darker">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>
    </div>
  )
}

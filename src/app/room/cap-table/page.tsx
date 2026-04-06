import { PieChart } from 'lucide-react'

export default function CapTablePage() {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center">
        <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <PieChart size={28} className="text-brand-gold" />
        </div>
        <h1 className="text-xl font-semibold text-brand-text">Cap Table</h1>
        <p className="text-sm text-brand-muted mt-2">Coming soon</p>
      </div>
    </div>
  )
}

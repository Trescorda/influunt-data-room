import { Calendar } from 'lucide-react'

export default function BookCallPage() {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center">
        <div className="w-14 h-14 bg-inf-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar size={28} className="text-inf-gold" />
        </div>
        <h1 className="text-xl font-semibold text-inf-green">Book a Call</h1>
        <p className="text-sm text-inf-muted mt-2">Coming soon</p>
      </div>
    </div>
  )
}

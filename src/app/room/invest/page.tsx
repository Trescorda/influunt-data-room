import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { FileText, Phone, MessageSquare, DollarSign, Send, CheckCircle, ArrowRight } from 'lucide-react'

const steps = [
  { icon: FileText, title: 'Review the Data Room', desc: 'Complete your review of all documents including the executive summary, business plan, and financials.' },
  { icon: Phone, title: 'Book a Call', desc: 'Schedule a conversation with the team to discuss the opportunity and ask questions.' },
  { icon: MessageSquare, title: 'Express Interest', desc: 'Notify us of your intended investment amount to receive the Subscription Agreement.' },
  { icon: CheckCircle, title: 'Complete Subscription Agreement', desc: 'Review, sign, and return the Subscription Agreement with your investment details.' },
  { icon: DollarSign, title: 'Transfer Funds', desc: 'Transfer your investment via EFT to the designated account.' },
  { icon: Send, title: 'Receive Confirmation', desc: "You'll receive confirmation of your shareholding within 5 business days." },
]

const stages = [
  { name: 'Stage 1 — Seed', amount: 'A$5M', timing: 'Immediate', current: true },
  { name: 'Stage 2 — Round A', amount: 'A$35M', timing: 'Q2 2026', current: false },
  { name: 'Stage 3 — Round B', amount: 'A$250M', timing: 'FY2028', current: false },
]

export default function InvestPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-brand-text">Invest in Influunt</h1>
        <p className="text-lg text-brand-gold mt-1">Seed Round — A$5,000,000</p>
      </div>

      {/* Investment Overview */}
      <Card padding="md">
        <h2 className="text-sm font-semibold text-brand-text mb-3">Investment Overview</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-brand-muted">Round:</span> <span className="text-brand-text">Seed (Stage 1 of 3)</span></div>
          <div><span className="text-brand-muted">Target raise:</span> <span className="text-brand-text">A$5,000,000</span></div>
          <div><span className="text-brand-muted">Minimum investment:</span> <span className="text-brand-text">A$50,000</span></div>
          <div><span className="text-brand-muted">Share class:</span> <span className="text-brand-text">Ordinary</span></div>
          <div><span className="text-brand-muted">Total capital strategy:</span> <span className="text-brand-text">A$290,000,000</span></div>
          <div><span className="text-brand-muted">Valuation:</span> <span className="text-brand-gold">Contact us for current term sheet</span></div>
        </div>
      </Card>

      {/* Capital Raise Timeline */}
      <Card padding="md">
        <h2 className="text-sm font-semibold text-brand-text mb-4">Capital Raise Timeline</h2>
        <div className="flex gap-3">
          {stages.map((s) => (
            <div key={s.name} className={`flex-1 rounded-lg p-3 border ${s.current ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-border'}`}>
              <p className={`text-sm font-semibold ${s.current ? 'text-brand-gold' : 'text-brand-text'}`}>{s.name}</p>
              <p className="text-lg font-bold text-brand-text mt-1">{s.amount}</p>
              <p className="text-xs text-brand-muted mt-1">{s.timing}</p>
              {s.current && <Badge variant="gold" className="mt-2">Current Round</Badge>}
            </div>
          ))}
        </div>
      </Card>

      {/* How to Invest */}
      <div>
        <h2 className="text-sm font-semibold text-brand-text mb-3">How to Invest</h2>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <Card key={i} padding="sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-brand-gold">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-text">{step.title}</p>
                  <p className="text-xs text-brand-muted mt-0.5">{step.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bank Transfer Details */}
      <Card padding="md" className="border-brand-gold/30">
        <h2 className="text-sm font-semibold text-brand-text mb-3">Bank Transfer Details</h2>
        <div className="space-y-2 text-sm">
          <div><span className="text-brand-muted">Account Name:</span> <span className="text-brand-text">Influunt Pty Ltd</span></div>
          <div><span className="text-brand-muted">BSB:</span> <span className="text-brand-text italic">Provided upon execution of Subscription Agreement</span></div>
          <div><span className="text-brand-muted">Account Number:</span> <span className="text-brand-text italic">Provided upon execution of Subscription Agreement</span></div>
          <div><span className="text-brand-muted">Bank:</span> <span className="text-brand-text italic">Provided upon execution of Subscription Agreement</span></div>
          <div><span className="text-brand-muted">Reference:</span> <span className="text-brand-text">[Investor Name] — Seed Round</span></div>
        </div>
        <p className="text-xs text-brand-muted mt-3">
          Bank details are disclosed upon execution of the Subscription Agreement to ensure security of funds. Contact brad@influunt.global to begin the process.
        </p>
      </Card>

      {/* Contact */}
      <Card padding="md">
        <h2 className="text-sm font-semibold text-brand-text mb-3">For investment enquiries</h2>
        <p className="text-sm text-brand-muted mb-4">brad@influunt.global</p>
        <div className="flex gap-3">
          <Link href="/room/book-a-call" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-darker text-sm font-semibold rounded-lg hover:bg-brand-gold/90 transition-colors">
            Book a Call <ArrowRight size={14} />
          </Link>
          <Link href="/room/faq" className="inline-flex items-center gap-2 px-4 py-2 border border-brand-gold text-brand-gold text-sm font-semibold rounded-lg hover:bg-brand-gold/10 transition-colors">
            View FAQ <ArrowRight size={14} />
          </Link>
        </div>
      </Card>
    </div>
  )
}

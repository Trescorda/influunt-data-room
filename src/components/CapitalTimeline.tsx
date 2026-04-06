import { Badge } from '@/components/ui/Badge'

const stages = [
  {
    name: 'Seed',
    amount: '$5M',
    status: 'Active',
    timing: 'Now',
    active: true,
  },
  {
    name: 'Round A',
    amount: '$35M',
    status: 'Upcoming',
    timing: 'Q2 2026',
    active: false,
  },
  {
    name: 'Round B',
    amount: '$250M',
    status: 'Planned',
    timing: 'FY2028',
    active: false,
  },
]

export function CapitalTimeline() {
  return (
    <div className="bg-brand-card border border-brand-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-brand-text mb-4">Capital raise timeline</h3>
      <div className="space-y-3">
        {stages.map((stage, i) => (
          <div key={stage.name} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full ${
                  stage.active ? 'bg-brand-gold' : 'bg-brand-border'
                }`}
              />
              {i < stages.length - 1 && (
                <div className="w-px h-6 bg-brand-border mt-1" />
              )}
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${stage.active ? 'text-brand-gold' : 'text-brand-text'}`}>
                  {stage.name} — {stage.amount}
                </p>
                <p className="text-xs text-brand-muted">{stage.timing}</p>
              </div>
              <Badge variant={stage.active ? 'gold' : 'gray'}>
                {stage.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-brand-border">
        <p className="text-xs text-brand-muted">
          Total raise: <span className="text-brand-gold font-semibold">$290M</span> across three stages
        </p>
      </div>
    </div>
  )
}

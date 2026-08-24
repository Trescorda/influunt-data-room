import { Badge } from '@/components/ui/Badge'
import type { Investor } from '@/lib/types'

const statusVariant: Record<string, 'gold' | 'green' | 'red' | 'gray'> = {
  invited: 'blue' as 'gold',
  active: 'green',
  suspended: 'red',
  expired: 'gray',
}

const typeLabels: Record<string, string> = {
  individual: 'Individual',
  family_office: 'Family Office',
  vc_fund: 'VC Fund',
  syndicate: 'Syndicate',
  sovereign: 'Sovereign',
  corporate: 'Corporate',
  other: 'Other',
}

export function InvestorRow({ investor }: { investor: Investor }) {
  return (
    <tr className="border-t border-inf-line hover:bg-inf-gold/[0.04] transition-colors">
      <td className="px-4 py-3.5">
        <div>
          <p className="text-sm font-medium text-inf-green">{investor.name}</p>
          <p className="text-xs text-inf-muted">{investor.email}</p>
        </div>
      </td>
      <td className="px-4 py-3.5 text-sm text-inf-body">
        {investor.organisation || '—'}
      </td>
      <td className="px-4 py-3.5">
        <span className="text-xs text-inf-muted">
          {typeLabels[investor.investor_type] || investor.investor_type}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <Badge variant={statusVariant[investor.status] || 'gray'}>
          {investor.status}
        </Badge>
      </td>
      <td className="px-4 py-3.5">
        {investor.nda_signed ? (
          <Badge variant="green">Signed</Badge>
        ) : (
          <Badge variant="gray">Pending</Badge>
        )}
      </td>
      <td className="px-4 py-3.5 text-xs text-inf-muted" data-numeric>
        {new Date(investor.created_at).toLocaleDateString()}
      </td>
    </tr>
  )
}

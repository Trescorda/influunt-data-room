import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TimeCell } from '@/components/admin/TimeCell'

const actionLabels: Record<string, string> = {
  login: 'Logged in',
  logout: 'Logged out',
  view_document: 'Viewed document',
  download_document: 'Downloaded document',
  sign_nda: 'Signed NDA',
  request_access: 'Requested access',
  submit_question: 'Submitted question',
}

const actionVariant: Record<string, 'gold' | 'green' | 'blue' | 'gray'> = {
  login: 'blue',
  sign_nda: 'green',
  view_document: 'gold',
  download_document: 'gold',
  submit_question: 'green',
}

export default async function ActivityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const { data: activities } = await admin
    .from('activity_log')
    .select('*, investors(name, email, organisation), documents(title)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-brand-text">Activity log</h1>
        <p className="text-sm text-brand-muted mt-1">Track all investor actions in the data room</p>
      </div>

      <Card padding="sm">
        {(!activities || activities.length === 0) ? (
          <div className="py-12 text-center text-brand-muted text-sm">No activity yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                    Investor
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                    Action
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                    Document
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a: any) => (
                  <tr key={a.id} className="border-b border-brand-border last:border-0 hover:bg-brand-card/50">
                    <td className="px-4 py-3">
                      <p className="text-sm text-brand-text">{a.investors?.name || 'Unknown'}</p>
                      <p className="text-xs text-brand-muted">{a.investors?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={actionVariant[a.action] || 'gray'}>
                        {actionLabels[a.action] || a.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-muted">
                      {a.documents?.title || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <TimeCell timestamp={a.created_at} className="text-xs text-brand-muted" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

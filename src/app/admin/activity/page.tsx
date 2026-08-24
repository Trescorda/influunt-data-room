import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/Badge'
import { TimeCell } from '@/components/admin/TimeCell'

/** Shape of the activity_log rows as selected below, with their joins. */
type ActivityRow = {
  id: string
  action: string
  created_at: string
  investors: { name: string | null; email: string | null; organisation: string | null } | null
  documents: { title: string | null } | null
}

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
        <h1 className="text-2xl font-semibold text-inf-green">Activity log</h1>
        <p className="text-sm text-inf-muted mt-1">Track all investor actions in the data room</p>
      </div>

      <div className="bg-white border border-inf-line rounded-inf-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        {(!activities || activities.length === 0) ? (
          <div className="py-12 text-center text-inf-muted text-sm">No activity yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-inf-green/[0.04]">
                <tr>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">
                    Investor
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">
                    Action
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">
                    Document
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {(activities as ActivityRow[]).map((a) => (
                  <tr key={a.id} className="border-t border-inf-line hover:bg-inf-gold/[0.04] transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-inf-green">{a.investors?.name || 'Unknown'}</p>
                      <p className="text-xs text-inf-muted">{a.investors?.email}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={actionVariant[a.action] || 'gray'}>
                        {actionLabels[a.action] || a.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-inf-body">
                      {a.documents?.title || '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <TimeCell timestamp={a.created_at} className="text-xs text-inf-muted" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Users, FileText, Eye, Clock } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Auth check (temporary — normally handled by middleware)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { count: totalInvestors } = await supabase
    .from('investors')
    .select('*', { count: 'exact', head: true })
    .eq('is_admin', false)

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: activeThisWeek } = await supabase
    .from('activity_log')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneWeekAgo)

  const { count: totalDocViews } = await supabase
    .from('activity_log')
    .select('*', { count: 'exact', head: true })
    .eq('action', 'view_document')

  const { count: totalDocs } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })

  const { data: recentActivity } = await supabase
    .from('activity_log')
    .select('*, investors(name, email)')
    .order('created_at', { ascending: false })
    .limit(10)

  const metrics = [
    { label: 'Total investors', value: totalInvestors || 0, icon: Users },
    { label: 'Active this week', value: activeThisWeek || 0, icon: Clock },
    { label: 'Documents viewed', value: totalDocViews || 0, icon: Eye },
    { label: 'Total documents', value: totalDocs || 0, icon: FileText },
  ]

  const actionLabels: Record<string, string> = {
    login: 'Logged in',
    logout: 'Logged out',
    view_document: 'Viewed document',
    download_document: 'Downloaded document',
    sign_nda: 'Signed NDA',
    request_access: 'Requested access',
    submit_question: 'Submitted question',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-brand-text">Dashboard</h1>
        <p className="text-sm text-brand-muted mt-1">Overview of your data room</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map(({ label, value, icon: Icon }) => (
          <Card key={label} padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-muted">{label}</p>
                <p className="text-2xl font-bold text-brand-text mt-1">{value}</p>
              </div>
              <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center">
                <Icon size={20} className="text-brand-gold" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-brand-text mb-4">Recent activity</h2>
        {(!recentActivity || recentActivity.length === 0) ? (
          <p className="text-sm text-brand-muted py-8 text-center">No activity yet</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2 border-b border-brand-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-card rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-gold">
                      {activity.investors?.name?.[0] || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-brand-text">
                      {activity.investors?.name || 'Unknown'}{' '}
                      <span className="text-brand-muted">
                        {actionLabels[activity.action] || activity.action}
                      </span>
                    </p>
                  </div>
                </div>
                <span className="text-xs text-brand-muted">
                  {new Date(activity.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

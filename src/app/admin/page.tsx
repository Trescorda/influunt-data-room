import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Users, FileText, Eye, Clock } from 'lucide-react'

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  return `${(seconds / 3600).toFixed(1)}h`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  // Metrics
  const { count: totalInvestors } = await admin
    .from('investors')
    .select('*', { count: 'exact', head: true })
    .eq('is_admin', false)

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: weeklyActive } = await admin
    .from('activity_log')
    .select('investor_id')
    .gte('created_at', oneWeekAgo)

  const uniqueActiveIds = new Set(weeklyActive?.map((a) => a.investor_id) || [])

  const { data: viewDurations } = await admin
    .from('activity_log')
    .select('duration_seconds')
    .eq('action', 'view_document')
    .not('duration_seconds', 'is', null)

  const totalDocViews = viewDurations?.length || 0
  const avgTime = viewDurations && viewDurations.length > 0
    ? Math.round(viewDurations.reduce((sum, v) => sum + (v.duration_seconds || 0), 0) / viewDurations.length)
    : 0

  // Most viewed documents
  const { data: docViews } = await admin
    .from('activity_log')
    .select('document_id, documents(title)')
    .eq('action', 'view_document')
    .not('document_id', 'is', null)

  const viewCounts: Record<string, { title: string; count: number }> = {}
  for (const v of docViews || []) {
    if (!v.document_id) continue
    if (!viewCounts[v.document_id]) {
      viewCounts[v.document_id] = { title: (v.documents as any)?.title || 'Unknown', count: 0 }
    }
    viewCounts[v.document_id].count++
  }
  const topDocs = Object.entries(viewCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
  const maxViews = topDocs.length > 0 ? topDocs[0][1].count : 1

  // Investor engagement
  const { data: allInvestors } = await admin
    .from('investors')
    .select('id, name, organisation, status')
    .eq('is_admin', false)
    .order('updated_at', { ascending: false })

  const { data: allActivity } = await admin
    .from('activity_log')
    .select('investor_id, action, duration_seconds, created_at')
    .order('created_at', { ascending: false })

  const investorStats = (allInvestors || []).map((inv) => {
    const acts = (allActivity || []).filter((a) => a.investor_id === inv.id)
    const lastAct = acts[0]
    const totalTime = acts.reduce((sum, a) => sum + (a.duration_seconds || 0), 0)
    const docsViewed = acts.filter((a) => a.action === 'view_document').length
    const isRecentlyActive = lastAct && (Date.now() - new Date(lastAct.created_at).getTime()) < 24 * 60 * 60 * 1000
    return { ...inv, lastAct, totalTime, docsViewed, isRecentlyActive }
  }).sort((a, b) => {
    if (!a.lastAct) return 1
    if (!b.lastAct) return -1
    return new Date(b.lastAct.created_at).getTime() - new Date(a.lastAct.created_at).getTime()
  })

  // Recent activity
  const { data: recentActivity } = await admin
    .from('activity_log')
    .select('*, investors(name, email), documents(title)')
    .order('created_at', { ascending: false })
    .limit(15)

  const metrics = [
    { label: 'Total investors', value: totalInvestors || 0, icon: Users },
    { label: 'Active this week', value: uniqueActiveIds.size, icon: Clock },
    { label: 'Documents viewed', value: totalDocViews, icon: Eye },
    { label: 'Avg view time', value: avgTime > 0 ? formatDuration(avgTime) : '—', icon: FileText },
  ]

  const actionLabels: Record<string, string> = {
    login: 'logged in',
    logout: 'logged out',
    view_document: 'viewed',
    download_document: 'downloaded',
    sign_nda: 'signed NDA',
    request_access: 'requested access',
    submit_question: 'asked a question',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-brand-text">Dashboard</h1>
        <p className="text-sm text-brand-muted mt-1">Overview of your data room</p>
      </div>

      {/* Metrics */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Most viewed documents */}
        <Card>
          <h2 className="text-lg font-semibold text-brand-text mb-4">Most viewed documents</h2>
          {topDocs.length === 0 ? (
            <p className="text-sm text-brand-muted py-4 text-center">No document views yet</p>
          ) : (
            <div className="space-y-3">
              {topDocs.map(([docId, { title, count }]) => (
                <div key={docId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-brand-text truncate mr-4">{title}</span>
                    <span className="text-brand-muted flex-shrink-0">{count} views</span>
                  </div>
                  <div className="w-full bg-brand-border rounded-full h-2">
                    <div
                      className="bg-brand-gold rounded-full h-2 transition-all"
                      style={{ width: `${(count / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Investor engagement */}
        <Card>
          <h2 className="text-lg font-semibold text-brand-text mb-4">Investor engagement</h2>
          {investorStats.length === 0 ? (
            <p className="text-sm text-brand-muted py-4 text-center">No investors yet</p>
          ) : (
            <div className="space-y-2">
              {investorStats.slice(0, 8).map((inv) => (
                <div key={inv.id} className="flex items-center gap-3 py-2 border-b border-brand-border last:border-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${inv.isRecentlyActive ? 'bg-green-400' : 'bg-brand-border'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-text truncate">{inv.name}</p>
                    <p className="text-xs text-brand-muted">{inv.organisation || '—'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-brand-muted">{inv.docsViewed} docs &middot; {formatDuration(inv.totalTime)}</p>
                    <p className="text-xs text-brand-muted">
                      {inv.lastAct ? timeAgo(inv.lastAct.created_at) : 'No activity'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <h2 className="text-lg font-semibold text-brand-text mb-4">Recent activity</h2>
        {(!recentActivity || recentActivity.length === 0) ? (
          <p className="text-sm text-brand-muted py-8 text-center">No activity yet</p>
        ) : (
          <div className="space-y-2">
            {recentActivity.map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2 border-b border-brand-border last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-brand-card rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-brand-gold">
                      {activity.investors?.name?.[0] || '?'}
                    </span>
                  </div>
                  <p className="text-sm text-brand-text truncate">
                    <span className="font-medium">{activity.investors?.name || 'Unknown'}</span>{' '}
                    <span className="text-brand-muted">
                      {actionLabels[activity.action] || activity.action}
                    </span>
                    {activity.documents?.title && (
                      <span className="text-brand-muted"> &ldquo;{activity.documents.title}&rdquo;</span>
                    )}
                    {activity.duration_seconds && (
                      <span className="text-brand-muted"> &middot; {formatDuration(activity.duration_seconds)}</span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-brand-muted flex-shrink-0 ml-4">
                  {timeAgo(activity.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { RelativeTime } from '@/components/admin/RelativeTime'
import { Users, FileText, Eye, Clock, MessageSquare, CheckCircle, Activity, TrendingUp, ArrowRight } from 'lucide-react'

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

function formatAvgTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${s}s`
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  // Core counts
  const { count: totalInvestors } = await admin
    .from('investors')
    .select('*', { count: 'exact', head: true })
    .eq('is_admin', false)

  const { count: ndasSigned } = await admin
    .from('investors')
    .select('*', { count: 'exact', head: true })
    .eq('is_admin', false)
    .eq('nda_signed', true)

  const { count: pendingQuestions } = await admin
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Weekly activity
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: weeklyActivity } = await admin
    .from('activity_log')
    .select('investor_id')
    .gte('created_at', oneWeekAgo)

  const uniqueWeeklyInvestors = new Set(weeklyActivity?.map((a) => a.investor_id) || [])

  // Count activity per investor this week → find most active
  const weeklyCounts: Record<string, number> = {}
  for (const a of weeklyActivity || []) {
    if (a.investor_id) weeklyCounts[a.investor_id] = (weeklyCounts[a.investor_id] || 0) + 1
  }
  const mostActiveId = Object.entries(weeklyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  // All view_document activities with durations for avg session calc
  const { data: viewActivities } = await admin
    .from('activity_log')
    .select('investor_id, document_id, duration_seconds, created_at')
    .eq('action', 'view_document')

  const totalDocViews = viewActivities?.length || 0
  const durationsWithValue = (viewActivities || []).filter((v) => v.duration_seconds)
  const avgSessionDuration = durationsWithValue.length > 0
    ? Math.round(durationsWithValue.reduce((sum, v) => sum + (v.duration_seconds || 0), 0) / durationsWithValue.length)
    : 0

  // Fetch all non-admin investors
  const { data: allInvestors } = await admin
    .from('investors')
    .select('id, name, organisation, status')
    .eq('is_admin', false)

  // Fetch all activity log for per-investor aggregation
  const { data: allActivity } = await admin
    .from('activity_log')
    .select('investor_id, action, duration_seconds, document_id, created_at')

  // Build per-investor stats for the Investor Overview table
  const investorStats = (allInvestors || []).map((inv) => {
    const acts = (allActivity || []).filter((a) => a.investor_id === inv.id)
    const lastAct = acts.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
    const views = acts.filter((a) => a.action === 'view_document')
    const uniqueDocs = new Set(views.map((v) => v.document_id).filter(Boolean))
    const totalTime = views.reduce((sum, a) => sum + (a.duration_seconds || 0), 0)
    return {
      ...inv,
      lastActivityAt: lastAct?.created_at || null,
      docsViewed: uniqueDocs.size,
      timeSpent: totalTime,
    }
  }).sort((a, b) => {
    if (!a.lastActivityAt) return 1
    if (!b.lastActivityAt) return -1
    return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
  }).slice(0, 10)

  // Most active investor name
  const mostActiveInvestor = mostActiveId
    ? (allInvestors || []).find((i) => i.id === mostActiveId)?.name || '—'
    : '—'

  // Document engagement: aggregate by document_id
  const { data: docMeta } = await admin.from('documents').select('id, title')
  const docTitleById: Record<string, string> = {}
  for (const d of docMeta || []) docTitleById[d.id] = d.title

  const docStats: Record<string, { title: string; views: number; uniqueViewers: Set<string>; totalDuration: number; durationCount: number }> = {}
  for (const v of viewActivities || []) {
    if (!v.document_id) continue
    if (!docStats[v.document_id]) {
      docStats[v.document_id] = {
        title: docTitleById[v.document_id] || 'Unknown',
        views: 0,
        uniqueViewers: new Set(),
        totalDuration: 0,
        durationCount: 0,
      }
    }
    docStats[v.document_id].views++
    if (v.investor_id) docStats[v.document_id].uniqueViewers.add(v.investor_id)
    if (v.duration_seconds) {
      docStats[v.document_id].totalDuration += v.duration_seconds
      docStats[v.document_id].durationCount++
    }
  }

  const docEngagement = Object.entries(docStats)
    .map(([id, s]) => ({
      id,
      title: s.title,
      views: s.views,
      uniqueViewers: s.uniqueViewers.size,
      avgTime: s.durationCount > 0 ? Math.round(s.totalDuration / s.durationCount) : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  const maxDocViews = docEngagement[0]?.views || 1

  const metrics = [
    { label: 'Total investors', value: totalInvestors || 0, icon: Users },
    { label: 'Active this week', value: uniqueWeeklyInvestors.size, icon: Clock },
    { label: 'Documents viewed', value: totalDocViews, icon: Eye },
    { label: 'Avg view time', value: avgSessionDuration > 0 ? formatDuration(avgSessionDuration) : '—', icon: FileText },
  ]

  const quickStats = [
    {
      label: 'Questions Pending',
      value: pendingQuestions || 0,
      icon: MessageSquare,
      href: '/admin/qa',
      gold: true,
    },
    {
      label: 'Avg Session Duration',
      value: avgSessionDuration > 0 ? formatAvgTime(avgSessionDuration) : '—',
      icon: Activity,
    },
    {
      label: 'Most Active Investor',
      value: mostActiveInvestor,
      icon: TrendingUp,
    },
    {
      label: 'NDAs Signed',
      value: `${ndasSigned || 0} / ${totalInvestors || 0}`,
      icon: CheckCircle,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 gap-4 md:gap-5">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-semibold text-inf-green">Dashboard</h1>
        <p className="text-xs text-inf-muted mt-0.5">Overview of your data room</p>
      </div>

      {/* Top metrics */}
      <div className="flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <Card key={label} padding="sm" className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="inf-label">{label}</p>
                <p className="text-[1.75rem] font-bold text-inf-green tracking-[-0.02em] mt-1" data-numeric>{value}</p>
              </div>
              <div className="w-10 h-10 bg-inf-green/[0.06] rounded-inf flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-inf-green/70" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Two-column analytics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {/* Investor Overview */}
        <div className="bg-white border border-inf-line rounded-inf-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-inf-line">
            <h2 className="text-sm font-semibold text-inf-green">Investor Overview</h2>
            <Link href="/admin/investors" className="text-xs text-inf-gold hover:text-inf-gold-hover flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {investorStats.length === 0 ? (
            <p className="text-xs text-inf-muted py-8 text-center">No investors yet</p>
          ) : (
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="bg-inf-green/[0.04] border-b border-inf-line">
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Name</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Last Active</th>
                    <th className="text-right px-3 py-2 text-[10px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Docs</th>
                    <th className="text-right px-3 py-2 text-[10px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Time</th>
                    <th className="text-right px-3 py-2 text-[10px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {investorStats.map((inv) => (
                    <tr key={inv.id} className="border-b border-inf-line last:border-0 hover:bg-inf-gold/[0.04] transition-colors">
                      <td className="px-3 py-2">
                        <p className="text-xs text-inf-body font-medium truncate max-w-[140px]">{inv.name}</p>
                        {inv.organisation && (
                          <p className="text-[10px] text-inf-muted truncate max-w-[140px]">{inv.organisation}</p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-[11px] text-inf-muted" data-numeric>
                        {inv.lastActivityAt ? <RelativeTime timestamp={inv.lastActivityAt} /> : '—'}
                      </td>
                      <td className="px-3 py-2 text-[11px] text-inf-green font-medium text-right" data-numeric>{inv.docsViewed}</td>
                      <td className="px-3 py-2 text-[11px] text-inf-muted text-right" data-numeric>
                        {inv.timeSpent > 0 ? formatDuration(inv.timeSpent) : '—'}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Badge variant={inv.status === 'active' ? 'green' : inv.status === 'invited' ? 'blue' : 'gray'}>
                          {inv.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Document Engagement */}
        <div className="bg-white border border-inf-line rounded-inf-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-inf-line">
            <h2 className="text-sm font-semibold text-inf-green">Document Engagement</h2>
            <Link href="/admin/documents" className="text-xs text-inf-gold hover:text-inf-gold-hover flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {docEngagement.length === 0 ? (
            <p className="text-xs text-inf-muted py-8 text-center">No document views yet</p>
          ) : (
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="bg-inf-green/[0.04] border-b border-inf-line">
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Document</th>
                    <th className="text-right px-3 py-2 text-[10px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Views</th>
                    <th className="text-right px-3 py-2 text-[10px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Unique</th>
                    <th className="text-right px-3 py-2 text-[10px] font-semibold text-inf-green/70 uppercase tracking-[0.15em]">Avg Time</th>
                  </tr>
                </thead>
                <tbody>
                  {docEngagement.map((doc) => (
                    <tr key={doc.id} className="border-b border-inf-line last:border-0 hover:bg-inf-gold/[0.04] transition-colors">
                      <td className="px-3 py-2">
                        <p className="text-xs text-inf-body font-medium truncate max-w-[180px] mb-1.5">{doc.title}</p>
                        <div className="w-full bg-inf-green/[0.08] rounded-full h-1">
                          <div
                            className="bg-inf-green-600 rounded-full h-1"
                            style={{ width: `${(doc.views / maxDocViews) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-inf-green font-medium text-right align-top" data-numeric>{doc.views}</td>
                      <td className="px-3 py-2 text-[11px] text-inf-muted text-right align-top" data-numeric>{doc.uniqueViewers}</td>
                      <td className="px-3 py-2 text-[11px] text-inf-muted text-right align-top" data-numeric>
                        {doc.avgTime > 0 ? formatAvgTime(doc.avgTime) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {quickStats.map(({ label, value, icon: Icon, href, gold }) => {
          const content = (
            <Card padding="sm" className={`p-5 hover:border-inf-gold/50 transition-colors ${href ? 'cursor-pointer' : ''}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="inf-label text-[10px]">{label}</p>
                  <p className={`text-lg font-bold mt-1 truncate ${gold ? 'text-inf-gold-deep' : 'text-inf-green'}`} data-numeric>
                    {value}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-inf flex items-center justify-center flex-shrink-0 ${gold ? 'bg-inf-gold/[0.12]' : 'bg-inf-green/[0.06]'}`}>
                  <Icon size={16} className={gold ? 'text-inf-gold' : 'text-inf-green/70'} />
                </div>
              </div>
            </Card>
          )
          return href ? (
            <Link key={label} href={href}>{content}</Link>
          ) : (
            <div key={label}>{content}</div>
          )
        })}
      </div>
    </div>
  )
}

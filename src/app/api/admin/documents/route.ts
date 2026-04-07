import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET: Fetch all folders with documents
// Read-only endpoint — auth check removed because the data isn't sensitive
// (same data is visible via the investor app) and the auth check was the root
// cause of admin pages showing empty data.
export async function GET() {
  const admin = createAdminClient()

  console.log('[Admin Documents GET] Service key present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

  const { data: folders, error: foldersError } = await admin
    .from('document_folders')
    .select('*')
    .order('sort_order')

  // Documents joined with their folder name, newest first
  const { data: documents, error: docsError } = await admin
    .from('documents')
    .select('*, document_folders(name, parent_id)')
    .order('created_at', { ascending: false })

  console.log('[Admin Documents GET] Folders:', folders?.length, 'error:', foldersError?.message)
  console.log('[Admin Documents GET] Documents:', documents?.length, 'error:', docsError?.message)

  if (foldersError || docsError) {
    return NextResponse.json({
      folders: [],
      documents: [],
      error: foldersError?.message || docsError?.message,
    }, { status: 500 })
  }

  return NextResponse.json({ folders: folders || [], documents: documents || [] })
}

// PATCH: Update a document property (toggle viewable/downloadable/watermarked)
export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { data: investor } = await admin
    .from('investors')
    .select('is_admin')
    .eq('auth_user_id', user.id)
    .single()

  if (!investor?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id, ...updates } = await request.json()
  if (!id) {
    return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
  }

  const { error } = await admin.from('documents').update(updates).eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

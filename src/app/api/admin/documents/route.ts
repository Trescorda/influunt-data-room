import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET: Fetch all folders with documents (admin)
export async function GET() {
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

  console.log('[Admin Documents GET] Service key present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

  const { data: folders, error: foldersError } = await admin
    .from('document_folders')
    .select('*')
    .order('sort_order')

  // Unfiltered documents query — no joins, no filters
  const { data: documents, error: docsError } = await admin
    .from('documents')
    .select('*')

  console.log('[Admin Documents GET] Folders:', folders?.length, 'error:', foldersError?.message)
  console.log('[Admin Documents GET] Documents (unfiltered):', documents?.length, 'error:', docsError?.message)

  if (folders?.length) {
    folders.forEach((f) => console.log('[Admin Documents GET] Folder:', f.id, '|', f.name, '| parent:', f.parent_id))
  }
  if (documents?.length) {
    documents.forEach((d) => console.log('[Admin Documents GET] Doc:', d.id, '|', d.title, '| folder_id:', d.folder_id))
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

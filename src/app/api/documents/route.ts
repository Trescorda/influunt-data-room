import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET: Generate signed URL for a document
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const docId = searchParams.get('id')

  if (!docId) {
    return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  const { data: doc } = await admin
    .from('documents')
    .select('file_path, is_viewable')
    .eq('id', docId)
    .single()

  if (!doc || !doc.is_viewable) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  const { data: signedUrlData, error } = await admin.storage
    .from('documents')
    .createSignedUrl(doc.file_path, 3600) // 1 hour expiry

  if (error || !signedUrlData) {
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 })
  }

  return NextResponse.json({ url: signedUrlData.signedUrl })
}

// DELETE: Delete a document (admin only)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const docId = searchParams.get('id')

  if (!docId) {
    return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Check admin
  const { data: investor } = await admin
    .from('investors')
    .select('is_admin')
    .eq('auth_user_id', user.id)
    .single()

  if (!investor?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Get file path before deleting record
  const { data: doc } = await admin
    .from('documents')
    .select('file_path')
    .eq('id', docId)
    .single()

  if (doc) {
    await admin.storage.from('documents').remove([doc.file_path])
  }

  await admin.from('documents').delete().eq('id', docId)

  return NextResponse.json({ success: true })
}

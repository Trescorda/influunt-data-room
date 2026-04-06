import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Verify admin
  const { data: investor } = await admin
    .from('investors')
    .select('is_admin')
    .eq('auth_user_id', user.id)
    .single()

  if (!investor?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  const title = formData.get('title') as string
  const description = formData.get('description') as string | null
  const folderId = formData.get('folder_id') as string
  const isViewable = formData.get('is_viewable') === 'true'
  const isDownloadable = formData.get('is_downloadable') === 'true'
  const isWatermarked = formData.get('is_watermarked') === 'true'

  if (!file || !title || !folderId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const filePath = `${folderId}/${Date.now()}_${file.name}`

  // Upload to storage using admin client
  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await admin.storage
    .from('documents')
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
    })

  if (uploadError) {
    return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 })
  }

  // Insert document record using admin client
  console.log('[Upload] Inserting doc:', { folder_id: folderId, title, file_type: fileExt, file_path: filePath, is_viewable: isViewable })
  const { data: insertedDoc, error: insertError } = await admin.from('documents').insert({
    folder_id: folderId,
    title,
    description: description || null,
    file_path: filePath,
    file_type: fileExt,
    file_size: file.size,
    is_viewable: isViewable,
    is_downloadable: isDownloadable,
    is_watermarked: isWatermarked,
  }).select().single()

  if (insertError) {
    console.error('[Upload] DB insert error:', insertError.message, insertError)
    return NextResponse.json({ error: 'Failed to save: ' + insertError.message }, { status: 500 })
  }

  console.log('[Upload] Success, inserted doc:', insertedDoc)
  return NextResponse.json({ success: true })
}

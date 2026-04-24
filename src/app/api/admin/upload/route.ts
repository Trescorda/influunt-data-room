import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, newDocumentEmail } from '@/lib/email'

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
  const isViewable = formData.get('is_viewable') !== 'false' // default true
  const isDownloadable = formData.get('is_downloadable') === 'true' // default false
  const isWatermarked = formData.get('is_watermarked') !== 'false' // default true
  // Admin can opt out via form field; defaults to true (notify investors)
  const notifyInvestors = formData.get('notify_investors') !== 'false'

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

  // Notify active NDA-signed investors — only if the document is viewable
  // and the admin didn't opt out. Runs async; never blocks the upload response.
  let notifiedCount = 0
  if (notifyInvestors && isViewable) {
    try {
      const { data: investors } = await admin
        .from('investors')
        .select('email, name')
        .eq('is_admin', false)
        .eq('status', 'active')
        .eq('nda_signed', true)

      if (investors && investors.length > 0) {
        // Send personalised email to each (name appears in greeting) — run in parallel
        const results = await Promise.allSettled(
          investors.map((inv) =>
            sendEmail(
              inv.email,
              `New document in the Influunt data room: ${title}`,
              newDocumentEmail(title, inv.name || undefined),
            ),
          ),
        )
        notifiedCount = results.filter((r) => r.status === 'fulfilled' && r.value.success).length
        console.log(`[Upload] Notified ${notifiedCount} / ${investors.length} investors about "${title}"`)
      } else {
        console.log('[Upload] No active NDA-signed investors to notify')
      }
    } catch (emailErr) {
      console.error('[Upload] Notification failed:', emailErr)
    }
  } else {
    console.log('[Upload] Notifications skipped:', { notifyInvestors, isViewable })
  }

  return NextResponse.json({ success: true, notified: notifiedCount })
}

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Guards for the /api/admin routes.
 *
 * These endpoints query with the service-role key, which bypasses RLS — so the
 * handler itself is the only thing standing between a caller and the whole
 * table. Every handler must call one of these first, reads included.
 */

/** Service-role client if the caller is a signed-in admin, otherwise null. */
export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data: investor } = await admin
    .from('investors')
    .select('is_admin')
    .eq('auth_user_id', user.id)
    .single()

  return investor?.is_admin ? admin : null
}

/**
 * Service-role client if the caller is any signed-in investor, otherwise null.
 * Used for data the investor UI legitimately needs (e.g. the Calendly and Cake
 * Equity URLs on the Book a Call and Invest pages).
 */
export async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return createAdminClient()
}

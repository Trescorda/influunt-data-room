import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  const { to, subject, html } = await request.json()

  if (!to || !subject || !html) {
    return NextResponse.json({ error: 'Missing to, subject, or html' }, { status: 400 })
  }

  const result = await sendEmail(to, subject, html)
  return NextResponse.json(result)
}

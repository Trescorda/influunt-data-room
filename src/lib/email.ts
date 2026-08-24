import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(to: string | string[], subject: string, html: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Email] SMTP credentials not configured — skipping send')
    return { success: false, error: 'SMTP not configured' }
  }

  try {
    const result = await transporter.sendMail({
      from: `"Influunt Data Room" <${process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    })
    console.log('[Email] Sent to', to, '— messageId:', result.messageId)
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[Email] Send error:', message)
    return { success: false, error: message }
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export function newQuestionEmail(investorName: string, questionText: string): string {
  return `<div style="background-color:#1a1a1a;padding:40px 20px;font-family:Arial,sans-serif;">
  <div style="max-width:500px;margin:0 auto;background-color:#2a2a2a;border-radius:12px;padding:40px;text-align:center;">
    <img src="https://invest.influunt.global/influunt-logo.png" alt="Influunt" style="width:120px;margin-bottom:24px;" />
    <h2 style="color:#C8A85C;margin-bottom:8px;">New Question Received</h2>
    <p style="color:#9a9a9a;font-size:14px;margin-bottom:16px;">${escapeHtml(investorName)} has submitted a question in the data room.</p>
    <div style="background-color:#1a1a1a;border-radius:8px;padding:16px;margin-bottom:24px;text-align:left;">
      <p style="color:#f5f5f5;font-size:14px;margin:0;">${escapeHtml(questionText)}</p>
    </div>
    <a href="https://invest.influunt.global/admin/qa" style="display:inline-block;background-color:#C8A85C;color:#1a1a1a;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">View &amp; Respond</a>
    <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
    <p style="color:#666;font-size:11px;">Influunt Pty Ltd — Confidential</p>
  </div>
</div>`
}

export function answerEmail(questionText: string, answerText: string): string {
  return `<div style="background-color:#1a1a1a;padding:40px 20px;font-family:Arial,sans-serif;">
  <div style="max-width:500px;margin:0 auto;background-color:#2a2a2a;border-radius:12px;padding:40px;text-align:center;">
    <img src="https://invest.influunt.global/influunt-logo.png" alt="Influunt" style="width:120px;margin-bottom:24px;" />
    <h2 style="color:#C8A85C;margin-bottom:8px;">Your Question Has Been Answered</h2>
    <p style="color:#9a9a9a;font-size:14px;margin-bottom:16px;">The Influunt team has responded to your question in the data room.</p>
    <div style="background-color:#1a1a1a;border-radius:8px;padding:16px;margin-bottom:8px;text-align:left;">
      <p style="color:#666;font-size:12px;margin:0 0 4px;">Your question:</p>
      <p style="color:#f5f5f5;font-size:14px;margin:0;">${escapeHtml(questionText)}</p>
    </div>
    <div style="background-color:#1a1a1a;border-radius:8px;padding:16px;margin-bottom:24px;text-align:left;">
      <p style="color:#666;font-size:12px;margin:0 0 4px;">Response:</p>
      <p style="color:#f5f5f5;font-size:14px;margin:0;">${escapeHtml(answerText)}</p>
    </div>
    <a href="https://invest.influunt.global/room/qa" style="display:inline-block;background-color:#C8A85C;color:#1a1a1a;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">View in Data Room</a>
    <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
    <p style="color:#666;font-size:11px;">Influunt Pty Ltd — Confidential</p>
  </div>
</div>`
}

export function newDocumentEmail(documentTitle: string, investorName?: string): string {
  const greeting = investorName ? `Hi ${escapeHtml(investorName)},` : 'Hello,'
  return `<div style="background-color:#1a1a1a;padding:40px 20px;font-family:Arial,sans-serif;">
  <div style="max-width:500px;margin:0 auto;background-color:#2a2a2a;border-radius:12px;padding:40px;text-align:center;">
    <img src="https://invest.influunt.global/influunt-logo.png" alt="Influunt" style="width:120px;margin-bottom:24px;" />
    <h2 style="color:#C8A85C;margin-bottom:8px;">New Document Added</h2>
    <p style="color:#9a9a9a;font-size:14px;margin-bottom:16px;">${greeting}<br/>A new document has been added to the Influunt data room.</p>
    <div style="background-color:#1a1a1a;border-radius:8px;padding:16px;margin-bottom:24px;text-align:left;">
      <p style="color:#666;font-size:12px;margin:0 0 4px;">Document:</p>
      <p style="color:#f5f5f5;font-size:14px;margin:0;font-weight:600;">${escapeHtml(documentTitle)}</p>
    </div>
    <a href="https://invest.influunt.global/room" style="display:inline-block;background-color:#C8A85C;color:#1a1a1a;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">View in Data Room</a>
    <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
    <p style="color:#666;font-size:11px;">Influunt Pty Ltd — Confidential</p>
  </div>
</div>`
}

export function documentViewedEmail(
  investorName: string,
  investorEmail: string,
  investorOrg: string | null,
  documentTitle: string,
  viewedAt: Date,
): string {
  const when = viewedAt.toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Australia/Sydney',
  }) + ' AEST'

  const orgLine = investorOrg
    ? `<p style="color:#9a9a9a;font-size:13px;margin:0 0 4px;">${escapeHtml(investorOrg)}</p>`
    : ''

  return `<div style="background-color:#1a1a1a;padding:40px 20px;font-family:Arial,sans-serif;">
  <div style="max-width:500px;margin:0 auto;background-color:#2a2a2a;border-radius:12px;padding:40px;text-align:center;">
    <img src="https://invest.influunt.global/influunt-logo.png" alt="Influunt" style="width:120px;margin-bottom:24px;" />
    <h2 style="color:#C8A85C;margin-bottom:8px;">Document Viewed</h2>
    <p style="color:#9a9a9a;font-size:14px;margin-bottom:20px;">An investor has just opened a document in the data room.</p>

    <div style="background-color:#1a1a1a;border-radius:8px;padding:16px;margin-bottom:12px;text-align:left;">
      <p style="color:#666;font-size:12px;margin:0 0 4px;">Investor:</p>
      <p style="color:#f5f5f5;font-size:14px;margin:0 0 4px;font-weight:600;">${escapeHtml(investorName)}</p>
      ${orgLine}
      <p style="color:#9a9a9a;font-size:13px;margin:0;">${escapeHtml(investorEmail)}</p>
    </div>

    <div style="background-color:#1a1a1a;border-radius:8px;padding:16px;margin-bottom:12px;text-align:left;">
      <p style="color:#666;font-size:12px;margin:0 0 4px;">Document:</p>
      <p style="color:#f5f5f5;font-size:14px;margin:0;font-weight:600;">${escapeHtml(documentTitle)}</p>
    </div>

    <div style="background-color:#1a1a1a;border-radius:8px;padding:16px;margin-bottom:24px;text-align:left;">
      <p style="color:#666;font-size:12px;margin:0 0 4px;">Viewed at:</p>
      <p style="color:#f5f5f5;font-size:14px;margin:0;">${escapeHtml(when)}</p>
    </div>

    <a href="https://invest.influunt.global/admin/activity" style="display:inline-block;background-color:#C8A85C;color:#1a1a1a;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">View Activity Log</a>
    <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
    <p style="color:#666;font-size:11px;">Influunt Pty Ltd — Confidential</p>
  </div>
</div>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

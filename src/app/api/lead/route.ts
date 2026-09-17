import { NextResponse } from 'next/server'

type LeadSource = 'contact' | 'booking'

type LeadPayload = {
  source?: LeadSource
  name?: string
  phone?: string
  email?: string
  service?: string
  comment?: string
  locale?: string
  website?: string // honeypot
}

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 8
const recentHits = new Map<string, number[]>()

function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const hits = (recentHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  hits.push(now)
  recentHits.set(ip, hits)
  return hits.length > RATE_LIMIT_MAX
}

function clean(value: unknown, max = 500) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildMessage(payload: Required<Pick<LeadPayload, 'source' | 'name' | 'phone'>> & {
  email: string
  service: string
  comment: string
  locale: string
}) {
  const title =
    payload.source === 'booking'
      ? '🟢 Nowe zgłoszenie — booking'
      : '🟡 Nowe zgłoszenie — kontakt'

  const lines = [
    `<b>${title}</b>`,
    '',
    `<b>Imię:</b> ${escapeHtml(payload.name)}`,
    `<b>Telefon:</b> ${escapeHtml(payload.phone)}`,
  ]

  if (payload.email) lines.push(`<b>E-mail:</b> ${escapeHtml(payload.email)}`)
  if (payload.service) lines.push(`<b>Usługa:</b> ${escapeHtml(payload.service)}`)
  if (payload.comment) lines.push(`<b>Komentarz:</b>\n${escapeHtml(payload.comment)}`)
  if (payload.locale) lines.push(`<b>Język:</b> ${escapeHtml(payload.locale)}`)
  lines.push(`<b>Czas:</b> ${new Date().toISOString()}`)

  return lines.join('\n')
}

async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()

  if (!token || !chatId) {
    const missing = [
      !token ? 'TELEGRAM_BOT_TOKEN' : null,
      !chatId ? 'TELEGRAM_CHAT_ID' : null,
    ].filter(Boolean)
    throw new Error(`Telegram is not configured (missing ${missing.join(', ')})`)
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

  const data = (await response.json().catch(() => null)) as { ok?: boolean; description?: string } | null

  if (!response.ok || !data?.ok) {
    throw new Error(data?.description || `Telegram API error (${response.status})`)
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    if (isRateLimited(ip)) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
    }

    const body = (await request.json()) as LeadPayload

    // Honeypot — bots fill this; humans don't.
    if (clean(body.website, 100)) {
      return NextResponse.json({ ok: true })
    }

    const source: LeadSource = body.source === 'booking' ? 'booking' : 'contact'
    const name = clean(body.name, 120)
    const phone = clean(body.phone, 40)
    const email = clean(body.email, 120)
    const service = clean(body.service, 200)
    const comment = clean(body.comment, 1000)
    const locale = clean(body.locale, 8)

    if (name.length < 2 || phone.length < 6) {
      return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
    }

    const message = buildMessage({
      source,
      name,
      phone,
      email,
      service,
      comment,
      locale,
    })

    await sendTelegramMessage(message)

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'server'
    console.error('[lead]', message)
    const isConfig = message.includes('not configured')
    return NextResponse.json(
      { ok: false, error: isConfig ? 'telegram_not_configured' : 'server' },
      { status: 500 },
    )
  }
}

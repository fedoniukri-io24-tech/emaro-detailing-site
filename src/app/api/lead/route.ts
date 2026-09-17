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
  pageUrl?: string
  pagePath?: string
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
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatWarsawTime(date = new Date()) {
  const formatted = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Warsaw',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)

  return `${formatted} (Warszawa)`
}

function localeLabel(locale: string) {
  if (locale === 'uk') return 'Українська (uk)'
  if (locale === 'pl') return 'Polski (pl)'
  return locale || '—'
}

function sourceLabel(source: LeadSource) {
  return source === 'booking'
    ? 'Modal booking (szybki zapis)'
    : 'Formularz kontaktowy (sekcja Kontakt)'
}

function phoneDigits(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

function whatsappLink(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 8) return ''
  return `https://wa.me/${digits}`
}

function buildMessage(
  payload: Required<Pick<LeadPayload, 'source' | 'name' | 'phone'>> & {
    email: string
    service: string
    comment: string
    locale: string
    pageUrl: string
    pagePath: string
    userAgent: string
  },
) {
  const title =
    payload.source === 'booking'
      ? '🟢 Nowe zgłoszenie — booking'
      : '🟡 Nowe zgłoszenie — kontakt'

  const tel = phoneDigits(payload.phone)
  const wa = whatsappLink(payload.phone)

  const lines = [
    `<b>${title}</b>`,
    '',
    `<b>Źródło:</b> ${escapeHtml(sourceLabel(payload.source))}`,
    `<b>Data i czas:</b> ${escapeHtml(formatWarsawTime())}`,
    `<b>Język strony:</b> ${escapeHtml(localeLabel(payload.locale))}`,
    '',
    '<b>Klient</b>',
    `• <b>Imię:</b> ${escapeHtml(payload.name)}`,
    `• <b>Telefon:</b> <a href="tel:${escapeHtml(tel)}">${escapeHtml(payload.phone)}</a>`,
  ]

  if (wa) lines.push(`• <b>WhatsApp:</b> <a href="${escapeHtml(wa)}">${escapeHtml(wa)}</a>`)
  if (payload.email) {
    lines.push(
      `• <b>E-mail:</b> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a>`,
    )
  }

  lines.push('', '<b>Szczegóły zgłoszenia</b>')
  lines.push(
    `• <b>Usługa:</b> ${payload.service ? escapeHtml(payload.service) : 'nie wybrano'}`,
  )
  lines.push(
    `• <b>Komentarz:</b> ${payload.comment ? escapeHtml(payload.comment) : 'brak'}`,
  )

  if (payload.pageUrl || payload.pagePath) {
    lines.push('', '<b>Strona</b>')
    if (payload.pagePath) lines.push(`• <b>Ścieżka:</b> ${escapeHtml(payload.pagePath)}`)
    if (payload.pageUrl) {
      lines.push(`• <b>URL:</b> <a href="${escapeHtml(payload.pageUrl)}">${escapeHtml(payload.pageUrl)}</a>`)
    }
  }

  if (payload.userAgent) {
    lines.push('', `<b>Urządzenie:</b> ${escapeHtml(payload.userAgent.slice(0, 180))}`)
  }

  return lines.join('\n')
}

async function sendTelegramMessage(text: string) {
  // Strip accidental quotes/spaces from Vercel dashboard paste.
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim().replace(/^['"]|['"]$/g, '')
  const chatId = (
    process.env.TELEGRAM_CHAT_ID ||
    process.env.TELEGRAM_GROUP_ID ||
    ''
  )
    .trim()
    .replace(/^['"]|['"]$/g, '')

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
    const pageUrl = clean(body.pageUrl, 400)
    const pagePath = clean(body.pagePath, 200)
    const userAgent = clean(request.headers.get('user-agent') ?? '', 300)

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
      pageUrl,
      pagePath,
      userAgent,
    })

    await sendTelegramMessage(message)

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'server'
    console.error('[lead]', message)
    const isConfig = message.includes('not configured')
    const missingMatch = message.match(/missing (.+)\)$/)
    return NextResponse.json(
      {
        ok: false,
        error: isConfig ? 'telegram_not_configured' : 'server',
        ...(isConfig && missingMatch
          ? { missing: missingMatch[1].split(', ') }
          : {}),
      },
      { status: 500 },
    )
  }
}

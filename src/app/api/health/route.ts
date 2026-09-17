import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const token = Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim())
  const chatId = Boolean(
    (process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_GROUP_ID)?.trim(),
  )

  return NextResponse.json({
    ok: token && chatId,
    telegram: {
      token: token ? 'set' : 'missing',
      chatId: chatId ? 'set' : 'missing',
    },
  })
}

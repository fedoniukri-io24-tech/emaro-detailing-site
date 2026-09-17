export type LeadPayload = {
  source: 'contact' | 'booking'
  name: string
  phone: string
  email?: string
  service?: string
  comment?: string
  locale?: string
  website?: string
}

export async function submitLead(payload: LeadPayload) {
  const response = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Lead submit failed (${response.status})`)
  }

  const data = (await response.json().catch(() => null)) as { ok?: boolean } | null
  if (!data?.ok) {
    throw new Error('Lead submit rejected')
  }
}

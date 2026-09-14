export const locales = ['pl', 'uk'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pl'

export const localeNames: Record<Locale, string> = {
  pl: 'PL',
  uk: 'UA',
}

export const localeHtmlLang: Record<Locale, string> = {
  pl: 'pl',
  uk: 'uk',
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

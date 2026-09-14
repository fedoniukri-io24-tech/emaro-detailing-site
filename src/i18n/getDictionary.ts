import type { Locale } from './config'
import type { Dictionary } from './types'
import { pl } from './dictionaries/pl'
import { uk } from './dictionaries/uk'

const dictionaries = { pl, uk } as const

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (dictionaries[locale] ?? dictionaries.pl) as Dictionary
}

export function getDictionarySync(locale: Locale): Dictionary {
  return (dictionaries[locale] ?? dictionaries.pl) as Dictionary
}

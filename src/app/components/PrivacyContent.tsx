import Link from 'next/link'
import type { Dictionary } from '../../i18n/types'
import type { Locale } from '../../i18n/config'
import { localePath } from '../../i18n/paths'
import styles from './PrivacyContent.module.css'

export default function PrivacyContent({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: Locale
}) {
  const copy = dict.privacy

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <Link href={localePath(locale)} className={styles.back}>
          ← {copy.back}
        </Link>

        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.updated}>{copy.updated}</p>

        <div className={styles.sections}>
          {copy.sections.map((section) => (
            <section key={section.title}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className={styles.sectionText}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  )
}

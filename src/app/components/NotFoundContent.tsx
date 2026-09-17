'use client'

import Image from 'next/image'
import Link from 'next/link'
import Navbar from './Navbar'
import { useDictionary, useLocale } from '../../i18n/LocaleProvider'
import { localePath } from '../../i18n/paths'
import styles from './NotFoundContent.module.css'

const CAR_SRC = '/images/emaro/about-cta-car.png'

export default function NotFoundContent() {
  const dict = useDictionary()
  const locale = useLocale()

  return (
    <div className={styles.page}>
      <Navbar transparent />
      <main id="main-content" className={styles.main}>
        <div className={styles.glow} aria-hidden="true" />

        <div className={styles.copy}>
          <p className={styles.code}>{dict.notFound.code}</p>
          <h1 className={styles.heading}>{dict.notFound.heading}</h1>
          <p className={styles.text}>{dict.notFound.text}</p>
          <Link href={localePath(locale)} className={styles.primary}>
            {dict.notFound.home}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 14 L14 2 M6 2 H14 V10" />
            </svg>
          </Link>
        </div>

        <div className={styles.visual}>
          <Image
            src={CAR_SRC}
            alt={dict.notFound.imageAlt}
            width={1200}
            height={900}
            priority
            className={styles.car}
            sizes="(max-width: 900px) 92vw, 56vw"
          />
        </div>
      </main>
    </div>
  )
}

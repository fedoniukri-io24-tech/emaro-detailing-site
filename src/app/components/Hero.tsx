'use client'
import Image from 'next/image'
import { BookingTrigger } from './booking/BookingProvider'
import { BRAND } from '../brand'
import { useDictionary } from '../../i18n/LocaleProvider'
import styles from './Hero.module.css'

export default function Hero() {
  const dict = useDictionary()

  return (
    <section id="hero" className={styles.hero} aria-label={BRAND.name}>
      <div className={styles.bg} aria-hidden="true">
        <Image
          src={BRAND.heroDesktop}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`${styles.bgImage} ${styles.bgDesktop}`}
        />
        <Image
          src={BRAND.heroMobile}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`${styles.bgImage} ${styles.bgMobile}`}
        />
      </div>
      <div className={styles.overlay} />

      <div className={styles.body}>
        <div className={styles.copy}>
          <h1 className={styles.headline}>
            {BRAND.name} — <em>{dict.hero.sloganEm}</em>
          </h1>
          <p className={styles.lead}>
            {dict.hero.mobileLabel}. {dict.hero.mobileText}
          </p>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.contact}>
            <a className={styles.phone} href={`tel:${BRAND.phone.replace(/\s/g, '')}`}>
              {BRAND.phone}
            </a>
            <address className={styles.address}>
              {BRAND.address}<br />{BRAND.city}
            </address>
          </div>

          <BookingTrigger className={styles.card}>
            <div className={styles.cardText}>
              <p className={styles.cardTitle}>{dict.hero.ctaTitle}</p>
              <p className={styles.cardSub}>{dict.hero.ctaSub}</p>
            </div>
            <div className={styles.cardArrow}>
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 14 L14 2 M6 2 H14 V10" />
              </svg>
            </div>
          </BookingTrigger>
        </div>
      </div>
    </section>
  )
}

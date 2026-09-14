'use client'

import { useEffect, useRef, useState } from 'react'
import { useDictionary } from '../../../i18n/LocaleProvider'
import styles from './BookingModal.module.css'

type FormState = { name: string; phone: string; consent: boolean }
type Status = 'idle' | 'loading' | 'success'

export default function BookingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const dict = useDictionary()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<FormState>({ name: '', phone: '', consent: false })
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle')
      setForm({ name: '', phone: '', consent: false })
      return
    }

    dialogRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.consent) return
    setStatus('loading')
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setStatus('success')
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label={dict.booking.close}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 4 L14 14 M14 4 L4 14" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className={styles.success}>
            <svg width="52" height="52" viewBox="0 0 48 48" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="24" cy="24" r="20" />
              <path d="M14 24 L21 31 L34 18" />
            </svg>
            <h2 id="booking-modal-title" className={styles.title}>{dict.booking.successTitle}</h2>
            <p className={styles.lead}>{dict.booking.successText}</p>
            <button type="button" className={styles.submit} onClick={onClose}>
              {dict.booking.close}
            </button>
          </div>
        ) : (
          <>
            <h2 id="booking-modal-title" className={styles.title}>{dict.booking.modalTitle}</h2>
            <p className={styles.lead}>{dict.booking.modalLead}</p>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="booking-name">{dict.booking.name}</label>
                <input
                  id="booking-name"
                  type="text"
                  placeholder={dict.booking.namePh}
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                  autoComplete="name"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="booking-phone">{dict.booking.phone}</label>
                <input
                  id="booking-phone"
                  type="tel"
                  placeholder={dict.booking.phonePh}
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  required
                  autoComplete="tel"
                />
              </div>
              <label className={styles.consent}>
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => setForm((prev) => ({ ...prev, consent: event.target.checked }))}
                  required
                />
                <span>{dict.booking.consent}</span>
              </label>
              <button type="submit" className={styles.submit} disabled={!form.consent || status === 'loading'}>
                {status === 'loading' ? dict.booking.submitting : dict.booking.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

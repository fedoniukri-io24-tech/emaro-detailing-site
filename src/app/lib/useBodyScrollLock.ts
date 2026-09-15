import { useEffect } from 'react'

let lockCount = 0
let savedScrollY = 0

/**
 * Locks page scroll while `locked` is true.
 * Safe for nested overlays (modal + menu + lightbox) via a shared counter.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return

    const html = document.documentElement
    const body = document.body

    if (lockCount === 0) {
      savedScrollY = window.scrollY
      html.classList.add('scroll-locked')
      body.classList.add('scroll-locked')
      body.style.top = `-${savedScrollY}px`
    }

    lockCount += 1

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) {
        html.classList.remove('scroll-locked')
        body.classList.remove('scroll-locked')
        body.style.top = ''
        window.scrollTo(0, savedScrollY)
      }
    }
  }, [locked])
}

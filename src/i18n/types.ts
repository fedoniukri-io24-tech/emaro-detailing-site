export type ServiceCopy = {
  title: string
  description: string
  price: string
  priceNote?: string
}

export type Dictionary = {
  seo: {
    defaultTitle: string
    defaultDescription: string
    keywords: string[]
    ogImageAlt: string
    siteName: string
  }
  notFound: {
    metaTitle: string
    metaDescription: string
    code: string
    heading: string
    text: string
    home: string
    imageAlt: string
  }
  nav: {
    about: string
    services: string
    prices: string
    gallery: string
    reviews: string
    contacts: string
    cta: string
    openMenu: string
    closeMenu: string
    mobileNav: string
  }
  hero: {
    lines: string[]
    accent: string
    pillars: [string, string, string]
    cardLabel: string
    cardTitle: string
    cardSub: string
  }
  about: {
    titleBefore: string
    titleEm: string
    paragraphs: string[]
    teamImageAlt: string
    quote: string
    ctaTitle: string
    ctaText: string
    ctaBtn: string
    ctaImageAlt: string
  }
  services: {
    titleBefore: string
    titleEm: string
    book: string
    prev: string
    next: string
    categories: Record<'cars' | 'vans' | 'trucks', string>
    notes: string[]
    items: Record<string, ServiceCopy>
  }
  prices: {
    titleBefore: string
    titleEm: string
    note: string
    book: string
    bentoLead: string
    bentoAccentTitle: string
    bentoAccentSub: string
    bentoWideTitle: string
    bentoWideSub: string
    categories: Record<'cars' | 'vans' | 'trucks', string>
    items: Record<string, { title: string; price: string; summary?: string; note?: string }>
  }
  beforeAfter: {
    titleBefore: string
    titleEm: string
    before: string
    after: string
    placeholder: string
    items: Record<string, { title: string }>
  }
  gallery: {
    titleBefore: string
    titleEm: string
    placeholder: string
    alts: Record<string, string>
  }
  reviews: {
    titleBefore: string
    titleEm: string
    placeholder: string
    items: Record<string, { name: string; text: string }>
  }
  booking: {
    promptTitle: string
    promptText: string
    promptBtn: string
    modalTitle: string
    namePh: string
    phonePh: string
    emailPh: string
    consent: string
    submit: string
    submitting: string
    or: string
    socialLead: string
    telegram: string
    whatsapp: string
    successTitle: string
    successText: string
    close: string
    error: string
  }
  contact: {
    heading: string
    headingEm: string
    lead: string
    visualLabel: string
    visualText: string
    visualAlt: string
    formTitle: string
    name: string
    namePh: string
    phone: string
    phonePh: string
    service: string
    servicePh: string
    comment: string
    commentPh: string
    consent: string
    submit: string
    submitting: string
    successTitle: string
    successText: string
    services: string[]
    error: string
  }
  footer: {
    navLabel: string
    links: string[]
    contactsTitle: string
    social: string
    instagramLabel: string
    rights: string
    privacy: string
    developedBy: string
  }
  privacy: {
    metaTitle: string
    metaDescription: string
    title: string
    updated: string
    back: string
    sections: Array<{
      title: string
      paragraphs: string[]
    }>
  }
}

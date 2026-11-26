// Zajednička struktura menija: koristi je glavni meni (Header).
// Nazivi stavki dolaze iz lib/i18n.ts (footerAssortment, footerAboutUsLinks...).
import { categoryHref } from '@/lib/categories.mjs'
import type { T } from '@/lib/i18n'

export type MenuLink = { label: string; href: string; pdf?: boolean }

export type MenuColumn = {
  heading: string
  links: MenuLink[]
}

// Katalozi u meniju: PDF fajlovi stoje u public/katalozi/
// Novi katalog: ubaci PDF u taj folder i dodaj red ovde (naziv u meniju + naziv fajla).
const CATALOGS: { label: string; file: string }[] = [
  { label: '2026', file: 'venting-katalog-2026.pdf' },
  { label: '2025', file: 'venting-katalog-2025.pdf' },
]

export function getMenu(t: T): MenuColumn[] {
  const groups = [
    {
      heading: t.footerAssortment,
      labels: t.footerAssortmentLinks,
      hrefs: [
        categoryHref(0), // Kućni klima uređaji
        categoryHref(1), // Komercijalni klima uređaji
        categoryHref(2), // Flex Fit
        categoryHref(3), // Rekuperatori
        categoryHref(4), // Fancoili
        categoryHref(5), // Kondenz pumpe
        categoryHref(6), // Vazdušne zavese
        categoryHref(7), // Dodatna oprema
      ],
    },
    {
      heading: t.footerAboutUs,
      labels: t.footerAboutUsLinks,
      hrefs: ['/o-nama', '/blog', '/privatnost', '/uslovi', '/kolacici'],
    },
    {
      heading: t.footerSupport,
      labels: t.footerSupportLinks,
      hrefs: ['/servis', '/kontakt'],
    },
  ]

  const columns: MenuColumn[] = groups.map((g) => ({
    heading: g.heading,
    links: g.labels.map((label, i) => ({ label, href: g.hrefs[i] ?? '#' })),
  }))

  columns.push({
    heading: 'Katalozi',
    links: CATALOGS.map((c) => ({ label: c.label, href: `/katalozi/${encodeURIComponent(c.file)}`, pdf: true })),
  })

  return columns
}
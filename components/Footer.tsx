'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'
import { categoryHref } from '@/lib/categories.mjs'

// Kontakt podaci - izmeni ovde.
const CONTACT_PHONE   = '011 4072081'
const CONTACT_EMAIL   = 'office@venting.rs'
const CONTACT_ADDRESS = 'Autoput za Novi Sad, Beograd'
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Venting d.o.o. ' + CONTACT_ADDRESS)}`

const RED = '#c0392f'
const GAP = 14 // razmak (px) između linija na mestu gde su se sekle

// Linija bledi na oba kraja: kratko prema sredini (do 20%), dugo prema spoljnom kraju.
const fade = (dir: string) =>
  `linear-gradient(${dir}, transparent 0%, ${RED} 20%, ${RED} 50%, transparent 100%)`

export default function Footer() {
  const { t } = useLanguage()

  // Izvedeno iz lib/categories.mjs da linkovi ne zastare kad se doda kategorija.
  const ASSORTMENT_HREFS = [
    categoryHref(0), // Kućni klima uređaji
    categoryHref(1), // Komercijalni klima uređaji
    categoryHref(2), // Flex Fit (sopstvena stranica)
    categoryHref(3), // Rekuperatori
    categoryHref(4), // Fancoili
    categoryHref(5), // Kondenz pumpe
    categoryHref(6), // Vazdušne zavese
    categoryHref(7), // Dodatna oprema
  ]

  const ABOUT_HREFS = ['/o-nama', '/blog', '/privatnost', '/uslovi', '/kolacici']

  const SUPPORT_HREFS = ['/servis', '/kontakt']

  const columns = [
    { heading: t.footerAssortment, links: t.footerAssortmentLinks, hrefs: ASSORTMENT_HREFS },
    { heading: t.footerAboutUs,    links: t.footerAboutUsLinks,    hrefs: ABOUT_HREFS    },
    { heading: t.footerSupport,    links: t.footerSupportLinks,    hrefs: SUPPORT_HREFS  },
  ]

  const linkHover = "relative inline-block transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:bg-white after:origin-center after:scale-x-0 after:transition-transform after:duration-[600ms] after:ease-out hover:after:scale-x-100"

  return (
    <footer style={{ background: '#2a2b2e' }}>
      <div className="relative px-6 lg:px-20">
        <div className="relative grid grid-cols-1 lg:grid-cols-2" style={{ position: 'relative' }}>

          {/* Crvene linije: blede na oba kraja i ne dodiruju se (samo desktop) */}
          <style>{`.footer-line{position:absolute;bottom:0;z-index:1;pointer-events:none}@media (max-width:1023px){.footer-line{display:none}}`}</style>
          <div aria-hidden="true" className="footer-line"
            style={{ left: '50%', bottom: GAP, width: 1, height: `calc(85% - ${GAP}px)`, background: fade('to top') }} />
          <div aria-hidden="true" className="footer-line"
            style={{ left: 0, width: `calc(50% - ${GAP}px)`, height: 1, background: fade('to left') }} />
          <div aria-hidden="true" className="footer-line"
            style={{ left: `calc(50% + ${GAP}px)`, right: 0, height: 1, background: fade('to right') }} />

          {/* Levo polje: o firmi + kontakt */}
          <div className="py-10 lg:px-16 flex justify-center items-center border-b border-white/10 lg:border-b-0">
            <div className="w-full grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-8">
              <div>
                <Image src="/logo.png" alt="Venting" width={138} height={32} className="h-7 w-auto mb-5" />
                <div className="flex gap-3">
                  <span aria-hidden="true" className="shrink-0 mt-[8px] w-1.5 h-1.5 rounded-full" style={{ background: RED }} />
                  <p className="font-sans text-[13.5px] leading-relaxed text-white/60">
                    Venting d.o.o. je kompanija iz Beograda specijalizovana za klima uređaje, rekuperatore i opremu za grejanje i hlađenje.
                    Nudimo rešenja za domove i poslovne objekte, uz stručnu podršku od izbora uređaja do servisa.
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-4 font-sans text-[13.5px] text-white/60 whitespace-nowrap sm:pt-12">
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
                  <a href="tel:+381114072081" className={linkHover}>{CONTACT_PHONE}</a>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                  <a href={`mailto:${CONTACT_EMAIL}`} className={linkHover}>{CONTACT_EMAIL}</a>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={linkHover}>{CONTACT_ADDRESS}</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Desno polje: kolone */}
          <div className="py-14 lg:px-16 flex justify-center items-center">
            <div className="w-full grid grid-cols-1 sm:grid-cols-[auto_auto_auto] sm:justify-between gap-10">
              {columns.map((col, ci) => (
                <div key={col.heading} className={ci === 0 ? 'flex flex-col items-center' : ''}>
                  <h3 className="inline-block font-sans text-[15px] font-bold uppercase tracking-[1.5px] text-white pb-2 mb-5 border-b-2 border-white">
                    {col.heading}
                  </h3>
                  <ul className={`${ci === 0 ? 'grid grid-cols-2 gap-x-8 gap-y-2.5' : 'flex flex-col gap-2.5'} whitespace-nowrap`}>
                    {col.links.map((link, i) => (
                      <li key={link}>
                        <a href={col.hrefs[i] ?? '#'} className={`font-sans text-[13.5px] text-white/60 ${linkHover}`}>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donja traka: copyright centriran */}
        <div className="py-4 text-center">
          <p className="font-sans text-[14px] text-white/60">{t.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
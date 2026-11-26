'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'
import { categoryHref } from '@/lib/categories.mjs'
import { type Locale } from '@/lib/i18n'
import { getMenu } from '@/lib/menu'

/* Search helpers */
type ProductHit = { id: string; name: string; categoryName: string; image: string | null }

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ|ð/g, 'd')
}

function highlight(text: string, query: string): string {
  if (!query) return text
  const q = normalize(query)
  const n = normalize(text)
  const idx = n.indexOf(q)
  if (idx === -1) return text
  return text.slice(0, idx) + '<mark>' + text.slice(idx, idx + q.length) + '</mark>' + text.slice(idx + q.length)
}

/* Constants */
const LANGUAGES: { code: Locale; nativeName: string; flag: string }[] = [
  { code: 'sr', nativeName: 'SRB', flag: '🇷🇸' },
  { code: 'en', nativeName: 'EN',  flag: '🇬🇧' },
]

/* Language Switcher */
function LanguageSwitcher({ locale, setLocale }: { locale: Locale; setLocale: (l: Locale) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [open])

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0]

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="flex items-center gap-[5px] px-2 py-2 font-sans text-[13px] font-medium text-brand-text hover:opacity-60 transition-opacity select-none"
      >
        {/* Globe */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9"/>
          <ellipse cx="12" cy="12" rx="4.5" ry="9"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="3" y1="15" x2="21" y2="15"/>
        </svg>
        <span>{current.nativeName}</span>
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M1 1l3 3 3-3"/>
        </svg>
      </button>

      <div className={`absolute top-[calc(100%+8px)] right-0 z-50 w-48 bg-white rounded-xl border border-[#e8e8e8] shadow-[0_8px_32px_rgba(0,0,0,0.12)] py-1.5 origin-top-right transition-all duration-200 ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
        {LANGUAGES.map(lang => (
          <button key={lang.code} onClick={() => { setLocale(lang.code); setOpen(false) }}
            className={`flex items-center gap-3 w-full px-4 py-2.5 text-left font-sans text-[13px] transition-colors ${lang.code === locale ? 'bg-[#f5f5f5] font-semibold' : 'text-[#333] hover:bg-[#f9f9f9]'}`}>
            <span className="text-[17px] leading-none">{lang.flag}</span>
            <span className="flex-1">{lang.nativeName}</span>
            {lang.code === locale && (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6.5l3.5 3.5 5.5-6"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/* Header */
export default function Header({ autoHide = false }: { autoHide?: boolean }) {
  const { t, locale, setLocale } = useLanguage()
  const menu = getMenu(t)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [query, setQuery]             = useState('')
  const [allProducts, setAllProducts] = useState<ProductHit[]>([])
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const searchInputRef                = useRef<HTMLInputElement>(null)
  const resultsRef                    = useRef<HTMLDivElement>(null)
  const [inlineOpen, setInlineOpen]   = useState(false)   // desktop polje za pretragu

  /* Početna (desktop): header se sam spušta posle učitavanja */
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    if (!autoHide) return
    const timer = setTimeout(() => setScrolled(true), 400)
    return () => clearTimeout(timer)
  }, [autoHide])
  const hidden = autoHide && !scrolled && !menuOpen && !searchOpen

  /* Fetch product list once on first search open */
  useEffect(() => {
    if (!(searchOpen || inlineOpen) || allProducts.length > 0) return
    fetch('/data/products.json')
      .then(r => r.json())
      .then(d => setAllProducts(
        d.products
          .filter((p: ProductHit & { inStock: boolean }) => p.inStock)
          .map((p: ProductHit & { inStock: boolean }) => ({ id: p.id, name: p.name, categoryName: p.categoryName, image: p.image }))
      ))
  }, [searchOpen, inlineOpen, allProducts.length])

  /* Live-filter results */
  const results = useMemo<ProductHit[]>(() => {
    const q = query.trim()
    if (q.length < 2) return []
    const nq = normalize(q)
    return allProducts
      .filter(p => normalize(p.name).includes(nq) || normalize(p.categoryName).includes(nq))
      .slice(0, 7)
  }, [query, allProducts])

  /* Reset selected when results change */
  useEffect(() => { setSelectedIdx(-1) }, [results])

  /* focus input when search opens */
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
    else { setQuery(''); setSelectedIdx(-1) }
  }, [searchOpen])

  /* Escape closes both panels */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false) }
    }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [])

  /* Tastatura u pretrazi: strelice i Enter */
  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, -1)) }
    else if (e.key === 'Enter') {
      const target = selectedIdx >= 0 ? results[selectedIdx] : results[0]
      if (target) { window.location.href = `/product/${target.id}`; setSearchOpen(false) }
    }
  }

  /* Rezultati pretrage - isti za desktop polje i za mobilni panel */
  const resultItems = results.map((p, i) => (
    <a
      key={p.id}
      href={`/product/${p.id}`}
      onClick={() => setSearchOpen(false)}
      className={`flex items-center gap-4 px-5 py-3 transition-colors ${i === selectedIdx ? 'bg-[#f3f4f6]' : 'hover:bg-[#f9fafb]'}`}
    >
      <div style={{ width: 44, height: 44, flexShrink: 0, background: '#f3f4f6', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {p.image
          ? <Image src={p.image} alt="" width={44} height={44} style={{ objectFit: 'contain' }} />
          : <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          className="font-sans text-[13px] text-brand-text truncate"
          dangerouslySetInnerHTML={{ __html: highlight(p.name, query) }}
          style={{ fontWeight: 600 }}
        />
        <p className="font-sans text-[11px] text-[#9ca3af] mt-0.5">{p.categoryName}</p>
      </div>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M3 8h10M9 4l4 4-4 4"/>
      </svg>
    </a>
  ))

  /* close search when menu opens and vice-versa */
  const openSearch = () => { setMenuOpen(false); setSearchOpen(v => !v) }
  const openMenu   = () => { setSearchOpen(false); setMenuOpen(v => !v) }

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white border-b border-[#e2e2e2] ${autoHide ? `lg:fixed lg:inset-x-0 lg:transition-transform lg:duration-500 lg:ease-out ${hidden ? 'lg:-translate-y-full' : 'lg:translate-y-0'}` : ''}`}>
        <div className="w-full px-10">
          <div className="flex items-center h-[105px]">

            {/* Logo */}
                        <a href="/" className="shrink-0 inline-block origin-left transition-transform duration-300 ease-out hover:scale-105 active:scale-95 active:duration-100" aria-label="Venting home">
              <Image src="/logo.png" alt="Venting" width={138} height={32} priority className="h-8 w-auto"/>
            </a>

            {/* Primary nav - desktop: 3 stavke sa podmenijem (kao u footeru) */}
            <nav className="hidden xl:flex flex-1 self-stretch items-stretch justify-start pl-20 min-[1400px]:pl-32 2xl:pl-44" aria-label="Primary navigation">
              <ul className="flex items-stretch gap-10 2xl:gap-14">
                {menu.map((col) => (
                  <li key={col.heading} className="relative group flex items-center">
                    <span
                      tabIndex={0}
                      className="relative flex items-center gap-1.5 cursor-default font-sans text-[15px] font-bold uppercase tracking-[0.9px] text-brand-text whitespace-nowrap outline-none transition-colors duration-300 group-hover:text-[#c0392f] group-focus-within:text-[#c0392f] after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:w-full after:bg-[#c0392f] after:origin-center after:scale-x-0 after:transition-transform after:duration-[600ms] after:ease-out group-hover:after:scale-x-100 group-focus-within:after:scale-x-100"
                    >
                      {col.heading}
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true">
                        <path d="M2.5 4.5L6 8l3.5-3.5" />
                      </svg>
                    </span>

                    {/* Podmeni */}
                    <div className="absolute left-1/2 top-full -translate-x-1/2 translate-y-2 opacity-0 invisible transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible">
                      <ul className="min-w-[240px] bg-white border border-[#e2e2e2] border-t-2 border-t-[#c0392f] rounded-b-xl shadow-[0_12px_32px_rgba(0,0,0,0.08)] py-3">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} {...(link.pdf ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                              className="group/item flex items-center gap-2.5 px-6 py-2.5 font-sans text-[14px] text-brand-text whitespace-nowrap transition-colors duration-200 hover:text-[#c0392f] hover:bg-[#FFFAFA]  active:bg-[#fdf5f4] active:text-[#a93226] active:scale-[0.98] transition-transform">
                              {link.pdf && (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><text x="12" y="17.5" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#c0392f" stroke="none">PDF</text></svg>)}
                              {link.label}
                                                            {link.pdf && (
                                <span className="ml-auto pl-6 flex items-center gap-1 text-[12px] font-semibold text-[#c0392f] opacity-0 -translate-x-1 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0">
                                  Pogledaj PDF
                                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5" /></svg>
                                </span>
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right controls */}
            <div className="flex items-center ml-auto shrink-0" style={{ gap: '2px' }}>

              {/* Pretraga - desktop: polje stoji u headeru */}
              <div className="hidden xl:block relative mr-10 2xl:mr-16">
                <div className="flex items-center gap-2.5 w-[300px] min-[1400px]:w-[380px] 2xl:w-[460px] h-11 px-4 rounded-full border border-[#e2e2e2] bg-[#fafafa] transition-all duration-200 hover:border-[#e8b4b0] focus-within:border-[#c0392f] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(192,57,47,0.08)]">
                  <svg viewBox="0 0 18 17.99" style={{ width: '16px', height: '16px', fill: 'rgb(12,12,13)', stroke: 'none', flexShrink: 0, opacity: 0.45 }} aria-hidden="true">
                    <path fillRule="evenodd" d="M6.5 0a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"/>
                    <path d="M9.89 11.31L11.31 9.89 17.99 16.79 16.79 17.99z"/>
                  </svg>
                  <input
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setInlineOpen(true)}
                    onBlur={() => setTimeout(() => setInlineOpen(false), 150)}
                    onKeyDown={onSearchKey}
                    placeholder="Pretraži proizvode…"
                    aria-label="Pretraži proizvode"
                    className="flex-1 min-w-0 bg-transparent font-sans text-[14px] text-brand-text placeholder:text-[#aaa] outline-none"
                  />
                </div>

                {inlineOpen && query.trim().length >= 2 && (
                  <div className="absolute right-0 top-full mt-2 w-[380px] z-50 bg-white border border-[#e2e2e2] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden">
                    {results.length > 0
                      ? resultItems
                      : <p className="px-5 py-4 font-sans text-[13px] text-[#9ca3af]">Nema rezultata za <strong className="text-brand-text">{query}</strong></p>}
                  </div>
                )}
              </div>

              {/* Language */}
              <LanguageSwitcher locale={locale} setLocale={setLocale}/>

              {/* Search - bigger & bolder */}
              <button
                onClick={openSearch}
                aria-label="Search"
                aria-expanded={searchOpen}
                style={{ background: 'transparent', border: 'none', padding: '0 10px', cursor: 'pointer' }}
                className={`xl:hidden transition-opacity duration-200 ${searchOpen ? 'opacity-40' : 'hover:opacity-60'}`}
              >
                <span style={{ display: 'block', width: '26px', height: '34px', padding: 0, background: 'transparent' }}>
                  <svg
                    viewBox="0 0 18 17.99"
                    style={{ width: '26px', height: '26px', fill: 'rgb(12,12,13)', stroke: 'none' }}
                    aria-hidden="true"
                  >
                    {/* Ring: outer r=6.5, inner r=4.1 → 2.4-unit wall */}
                    <path
                      fillRule="evenodd"
                      d="M6.5 0a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"
                    />
                    {/* Handle */}
                    <path d="M9.89 11.31L11.31 9.89 17.99 16.79 16.79 17.99z"/>
                  </svg>
                </span>
              </button>

              {/* Burger - bigger & bolder */}
              <button
                onClick={openMenu}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  padding: 0,
                  margin: 0,
                  border: 0,
                  borderRadius: 0,
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease',
                }}
                className={`flex xl:hidden ${menuOpen ? 'opacity-40' : 'hover:opacity-60'}`}
              >
                {menuOpen ? (
                  <svg
                    viewBox="0 0 24.88 24.87"
                    style={{ width: '30px', height: '30px', fill: 'rgb(12,12,13)', stroke: 'none' }}
                    aria-hidden="true"
                  >
                    <path d="M2.1 0 0 2.1l10.34 10.34L0 22.77l2.1 2.1 10.34-10.34 10.34 10.34 2.1-2.1-10.34-10.33L24.88 2.1 22.78 0 12.44 10.33z"/>
                  </svg>
                ) : (
                  /* Bolder bars: 4-unit tall bars (was 2.5), evenly spaced */
                  <svg
                    viewBox="0 0 24.88 24.87"
                    style={{ width: '30px', height: '30px', fill: 'rgb(0,0,0)', stroke: 'none' }}
                    aria-hidden="true"
                  >
                    <path d="M0 4.3h24.88v2.5H0zm0 6.84h24.88v2.5H0zm0 6.84h24.88v2.5H0z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar + live results */}
        <div className={`overflow-visible transition-all duration-300 xl:hidden ${searchOpen ? 'border-t border-[#e2e2e2]' : 'hidden'}`}>
          <div className="w-full px-10 py-4 relative">
            <div className="flex items-center gap-3 border-b-2 border-brand-text pb-1 transition-colors duration-200 hover:border-[#e8b4b0] focus-within:border-[#c0392f]">
              <svg viewBox="0 0 18 17.99" style={{ width: '17px', height: '17px', fill: 'rgb(12,12,13)', stroke: 'none', flexShrink: 0, opacity: 0.4 }} aria-hidden="true">
                <path fillRule="evenodd" d="M6.5 0a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"/>
                <path d="M9.89 11.31L11.31 9.89 17.99 16.79 16.79 17.99z"/>
              </svg>
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Pretraži proizvode…"
                className="flex-1 bg-transparent font-sans text-[16px] text-brand-text placeholder:text-[#bbb] outline-none"
                onKeyDown={onSearchKey}
              />
              {query && (
                <button onClick={() => setQuery('')} className="shrink-0 opacity-40 hover:opacity-80 transition-opacity" aria-label="Clear">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                    <line x1="2" y1="2" x2="14" y2="14"/><line x1="14" y1="2" x2="2" y2="14"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Results dropdown */}
            {results.length > 0 && (
              <div ref={resultsRef} className="absolute left-10 right-10 top-full z-50 bg-white border border-[#e2e2e2] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden mt-1">
                {resultItems}
                {/* "See all" footer when many matches */}
                {allProducts.filter(p => normalize(p.name).includes(normalize(query)) || normalize(p.categoryName).includes(normalize(query))).length > 7 && (
                  <a href={`/shop`} onClick={() => setSearchOpen(false)} className="flex items-center justify-center gap-2 px-5 py-3 border-t border-[#f0f0f0] text-[12px] font-medium text-[#6b7280] hover:text-brand-text hover:bg-[#f9fafb] transition-colors">
                    Pogledaj sve rezultate
                  </a>
                )}
              </div>
            )}

            {/* No results */}
            {query.trim().length >= 2 && results.length === 0 && allProducts.length > 0 && (
              <div className="absolute left-10 right-10 top-full z-50 bg-white border border-[#e2e2e2] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] px-5 py-4 mt-1">
                <p className="font-sans text-[13px] text-[#9ca3af]">Nema rezultata za <strong className="text-brand-text">{query}</strong></p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Burger menu overlay */}
      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-30 bg-black transition-opacity duration-300 ${menuOpen ? 'opacity-20 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />

      {/* Drawer - slides down from under the sticky header */}
      <div className={`fixed top-[106px] left-0 right-0 z-30 bg-white border-b border-[#e2e2e2] shadow-[0_8px_40px_rgba(0,0,0,0.1)] transition-all duration-300 origin-top ${menuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}`}>
        <div className="w-full px-10 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,360px)] gap-10">

            {/* Glavni meni: 3 grupe kao u footeru */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {menu.map((col) => (
                <div key={col.heading}>
                  <p className="inline-block font-sans text-[16px] font-bold uppercase tracking-[1.5px] text-brand-text pb-2 mb-4 border-b-2 border-[#c0392f]">
                    {col.heading}
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href} onClick={() => setMenuOpen(false)} {...(link.pdf ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="inline-flex items-center gap-2 font-sans text-[16px] text-[#444] transition-colors duration-200 hover:text-[#c0392f]">
                          {link.pdf && (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><text x="12" y="17.5" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#c0392f" stroke="none">PDF</text></svg>)}
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Pomoć pri izboru + kontakt */}
            <div className="rounded-2xl bg-[#fdf5f4] border border-[#f6e3e1] p-6 flex flex-col gap-4 self-start transition-all duration-300 hover:border-[#e07a73] hover:bg-[#fffafa] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
              <div className="flex items-start gap-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0392f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true">
                  <path d="M3 14v-2a9 9 0 0 1 18 0v2" /><path d="M21 14a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2zM3 14a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2z" /><path d="M18 16v1a3 3 0 0 1-3 3h-2" />
                </svg>
                <p className="font-sans text-[16px] font-bold leading-snug text-brand-text">Potrebna vam je pomoć pri izboru opreme?</p>
              </div>
              <p className="font-sans text-[14px] leading-relaxed text-[#555]">
                Naš tim vam stoji na raspolaganju za tehničku podršku i odabir odgovarajućeg HVAC rešenja.
              </p>
              <a href="/kontakt" onClick={() => setMenuOpen(false)}
                className="group inline-flex items-center gap-1.5 w-fit font-sans text-[14px] font-bold text-brand-text transition-colors duration-200 hover:text-[#c0392f]">
                Kontaktirajte nas
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
                  <path d="M3 9l6-6M4 3h5v5" />
                </svg>
              </a>

              <div className="h-px bg-[#f0d9d6] my-1" />

              <ul className="flex flex-col gap-3 font-sans text-[14px] text-[#555]">
                <li>
                  <a href="https://www.google.com/maps/search/?api=1&query=Venting%20d.o.o.%20Autoput%20za%20Novi%20Sad%2C%20Beograd" target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-3 transition-colors duration-200 hover:text-[#c0392f]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    Autoput za Novi Sad, Beograd
                  </a>
                </li>
                <li>
                  <a href="tel:+381114072081" className="flex items-start gap-3 transition-colors duration-200 hover:text-[#c0392f]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
                    011 4072081
                  </a>
                </li>
                <li>
                  <a href="mailto:office@venting.rs" className="flex items-start gap-3 transition-colors duration-200 hover:text-[#c0392f]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                    office@venting.rs
                  </a>
                </li>
              </ul>
            </div>

            {/* Izbor jezika - samo na telefonu (na većim ekranima je u headeru) */}
            <div className="sm:hidden">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-brand-muted mb-3">Language</p>
              <div className="grid grid-cols-2 gap-1">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLocale(lang.code); setMenuOpen(false) }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left font-sans text-[13px] transition-colors
                      ${lang.code === locale ? 'bg-[#f0f0f0] font-semibold text-brand-text' : 'text-[#444] hover:bg-[#f8f8f8]'}`}
                  >
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    {lang.code === locale && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
                        <path d="M1.5 6l3 3 6-5.5"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
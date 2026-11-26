'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import FaqChat from '@/components/FaqChat'

const RED = '#c0392f'

export default function FloatingButtons() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const btn = 'flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-brand-text bg-white border border-[#c0392f] rounded-pill px-4 py-2.5 shadow-[0_2px_16px_rgba(0,0,0,0.12)] transition-all duration-200 hover:shadow-[0_6px_28px_rgba(0,0,0,0.18)] hover:-translate-y-px whitespace-nowrap'

  return (
    <>
      <div className="fixed bottom-7 right-7 flex flex-col gap-2.5 z-50" aria-label="Quick actions">
        <button type="button" onClick={() => setFaqOpen(true)} className={`${btn} self-end w-[60%] justify-center`} aria-haspopup="dialog">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          </svg>
          FAQ
        </button>

        <button type="button" onClick={() => setOpen(true)} className={`${btn} self-end w-[80%] justify-center`} aria-haspopup="dialog">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path strokeLinecap="round" d="M3 8l9 6 9-6" />
          </svg>
          {t.newsletter}
        </button>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t.backToTop}
          className={`${btn} ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          {t.backToTop}
        </button>
      </div>

      {open && <NewsletterModal onClose={() => setOpen(false)} />}
      {faqOpen && <FaqChat onClose={() => setFaqOpen(false)} />}
    </>
  )
}

/* Popup za prijavu na bilten */
function NewsletterModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // zamka za botove
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = prev
    }
  }, [onClose])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, website }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || 'Slanje nije uspelo. Pokušajte ponovo.')
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Slanje nije uspelo. Pokušajte ponovo.')
      setStatus('error')
    }
  }

    const input = 'w-full h-12 px-4 rounded-xl border border-[#e2e2e2] bg-white font-sans text-[14px] text-brand-text placeholder:text-[#aaa] outline-none transition-all duration-200 hover:border-[#e8b4b0] focus:border-[#c0392f] focus:shadow-[0_0_0_3px_rgba(192,57,47,0.08)]'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-title"
    >
      <div
        className="relative w-full max-w-[440px] bg-white rounded-2xl p-8 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
        style={{ borderTop: `3px solid ${RED}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} aria-label="Zatvori"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-[#888] transition-colors hover:text-brand-text hover:bg-[#f3f4f6]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>

        {status === 'done' ? (
          <div className="text-center py-6">
            <div className="mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#fdf5f4' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
            </div>
            <h2 id="newsletter-title" className="font-sans text-[20px] font-bold text-brand-text mb-2">Hvala na prijavi!</h2>
            <p className="font-sans text-[14px] text-[#666] leading-relaxed">Uskoro ćete dobijati novosti i ponude iz Ventinga.</p>
            <button type="button" onClick={onClose}
              className="mt-7 inline-flex items-center font-sans text-[14px] font-semibold rounded-pill px-7 py-2.5 border-2 border-brand-text text-brand-text transition-colors duration-300 hover:border-[#c0392f] hover:bg-[#c0392f] hover:text-white">
              Zatvori
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate={false}>
            <h2 id="newsletter-title" className="font-sans text-[22px] font-bold text-brand-text mb-2">Prijavite se na bilten</h2>
            <p className="font-sans text-[14px] text-[#666] leading-relaxed mb-7">
              Novosti, akcije i saveti o klimatizaciji i ventilaciji, direktno u vaš inbox.
            </p>

            <div className="flex flex-col gap-3">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ime (opciono)" autoComplete="name" className={input} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail adresa" autoComplete="email" className={input} />
              {/* Zamka za botove - skriveno od korisnika */}
              <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)}
                className="absolute -left-[9999px] w-px h-px opacity-0" aria-hidden="true" />
            </div>

            <label className="flex items-start gap-3 mt-5 cursor-pointer">
              <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 shrink-0" style={{ accentColor: RED }} />
              <span className="font-sans text-[12.5px] text-[#666] leading-relaxed">
                Slažem se da Venting koristi moju e-mail adresu za slanje biltena, u skladu sa{' '}
                <a href="/privatnost" target="_blank" className="underline hover:text-[#c0392f]">Politikom privatnosti</a>.
                Odjava je moguća u svakom trenutku.
              </span>
            </label>

            {status === 'error' && (
              <p className="mt-4 font-sans text-[13px]" style={{ color: RED }}>{error}</p>
            )}

            <button type="submit" disabled={status === 'sending' || !consent}
              className="mt-7 w-full h-12 rounded-xl font-sans text-[14px] font-bold text-white bg-brand-text transition-all duration-300 hover:bg-[#c0392f] active:bg-[#d9655c] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none">
              {status === 'sending' ? 'Šaljem…' : 'Prijavi se'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
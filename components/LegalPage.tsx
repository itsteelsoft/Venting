import type { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'

const RED = '#c0392f'

const LEGAL_PAGES = [
  { href: '/privatnost', title: 'Politika privatnosti' },
  { href: '/uslovi', title: 'Uslovi korišćenja' },
  { href: '/kolacici', title: 'Politika kolačića' },
]

export type LegalSection = { title: string; body: ReactNode }

// Zajednički izgled za pravne stranice (privatnost, uslovi, kolačići)
export default function LegalPage({
  current,
  title,
  intro,
  sections,
}: {
  current: string // href trenutne stranice, npr. '/privatnost'
  title: string
  intro: ReactNode
  sections: LegalSection[]
}) {
  const others = LEGAL_PAGES.filter((p) => p.href !== current)

  return (
    <>
      <Header />
      <main style={{ background: '#fff', minHeight: '60vh', position: 'relative' }}>
        {/* Pozadina: jedva vidljiva mreža kao na tehničkom crtežu, bledi naniže */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(#eceff2 1px, transparent 1px), linear-gradient(90deg, #eceff2 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 45%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 45%)',
        }} />

        <style>{`
          .legal-line { position: absolute; top: 0; bottom: 0; width: 1px; pointer-events: none; background: linear-gradient(to bottom, transparent 0%, #e8b4b0 15%, #e8b4b0 85%, transparent 100%); }
          @media (max-width: 767px) { .legal-line { display: none; } }
          .legal-section { display: flex; gap: 20px; padding: 26px 22px; margin: 0 -22px; border-radius: 14px; transition: background-color .3s ease; }
          .legal-section:hover { background: #fffafa; }
          .legal-num { flex-shrink: 0; width: 34px; height: 34px; border-radius: 10px; background: #fdf5f4; color: ${RED}; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: background-color .3s ease, color .3s ease; }
          .legal-section:hover .legal-num { background: ${RED}; color: #fff; }
          .legal-sep { height: 1px; background: linear-gradient(to right, transparent 0%, #e8b4b0 50%, transparent 100%); }
          .legal-body a { color: ${RED}; text-decoration: underline; text-underline-offset: 3px; transition: opacity .2s ease; }
          .legal-body a:hover { opacity: .7; }
          .legal-card { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 22px; border: 1px solid #f6e3e1; border-radius: 14px; background: #fff; color: #0c0c0d; text-decoration: none; font-size: 15px; font-weight: 600; transition: border-color .3s ease, background-color .3s ease, transform .3s ease; }
          .legal-card:hover { border-color: #e07a73; background: #fffafa; transform: translateY(-3px); }
          .legal-card svg { transition: transform .3s ease, color .3s ease; }
          .legal-card:hover svg { transform: translateX(4px); color: ${RED}; }
        `}</style>

        <article style={{ maxWidth: 820, margin: '0 auto', padding: '80px 56px 100px', position: 'relative' }}>
          <div aria-hidden="true" className="legal-line" style={{ left: 0 }} />
          <div aria-hidden="true" className="legal-line" style={{ right: 0 }} />

          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#6b7280', marginBottom: 16 }}>Pravno</p>
          <h1 style={{ fontFamily: 'var(--font-archivo-black), sans-serif', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 900, color: '#0c0c0d', margin: '0 0 20px', lineHeight: 1.1 }}>
            {title}
          </h1>
          <div aria-hidden="true" style={{ width: 64, height: 2, background: RED, marginBottom: 28 }} />

          <div className="legal-body" style={{ fontSize: 17, color: '#374151', lineHeight: 1.8, marginBottom: 36 }}>
            {intro}
          </div>

          <div className="legal-sep" />
          {sections.map((s, i) => (
            <div key={s.title}>
              <section className="legal-section">
                <span className="legal-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className="legal-body" style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0c0c0d', margin: '4px 0 8px' }}>{s.title}</h2>
                  <div style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8 }}>{s.body}</div>
                </div>
              </section>
              <div className="legal-sep" />
            </div>
          ))}

          <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#6b7280', margin: '56px 0 16px' }}>
            Ostala pravna dokumenta
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {others.map((p) => (
              <a key={p.href} href={p.href} className="legal-card">
                {p.title}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
              </a>
            ))}
          </div>
        </article>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
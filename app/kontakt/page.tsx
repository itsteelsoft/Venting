'use client'

import { useState, type FormEvent } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'

const RED = '#c0392f'

// Kontakt podaci - isti kao u footeru
const PHONE = '011 4072081'
const EMAIL = 'office@venting.rs'
const ADDRESS = 'Autoput za Novi Sad, Beograd'
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Venting d.o.o. ' + ADDRESS)}`

// Adresa na koju forma šalje upit
const FORM_TO = 'prodaja@steelsoft.rs'

export default function KontaktPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const subject = `Upit sa sajta${name ? ` - ${name}` : ''}`
    const body = `Ime i prezime: ${name}\nE-pošta: ${email}\n\n${message}`
    window.location.href = `mailto:${FORM_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <>
      <Header />
      <main style={{ background: '#fff', minHeight: '60vh', position: 'relative' }}>
        {/* Pozadina: jedva vidljiva mreža kao na tehničkom crtežu, bledi naniže */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(#eceff2 1px, transparent 1px), linear-gradient(90deg, #eceff2 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)',
        }} />

        <style>{`
          .kt-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 40px; align-items: start; }
          @media (max-width: 860px) { .kt-grid { grid-template-columns: 1fr; } }
          .kt-label { display: block; font-size: 12px; font-weight: 600; color: #0c0c0d; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
          .kt-input { width: 100%; box-sizing: border-box; padding: 13px 16px; border: 1.5px solid #e9e4e3; border-radius: 12px; font-size: 14px; color: #0c0c0d; background: #fff; outline: none; font-family: inherit; transition: border-color .2s ease, box-shadow .2s ease; }
          .kt-input::placeholder { color: #9ca3af; }
          .kt-input:hover { border-color: #e8b4b0; }
          .kt-input:focus { border-color: ${RED}; box-shadow: 0 0 0 3px rgba(192,57,47,.08); }
          .kt-btn { align-self: flex-start; background: #0c0c0d; color: #fff; border: 2px solid #0c0c0d; border-radius: 12px; padding: 14px 32px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background-color .3s ease, border-color .3s ease, transform .15s ease; }
          .kt-btn:hover { background: ${RED}; border-color: ${RED}; }
          .kt-btn:active { background: #d9655c; border-color: #d9655c; transform: scale(.98); }
          .kt-card { background: #fdf5f4; border: 1px solid #f6e3e1; border-left: 3px solid ${RED}; border-radius: 18px; padding: 30px 28px; }
          .kt-row { display: flex; align-items: center; gap: 14px; padding: 12px 14px; margin: 0 -14px; border-radius: 12px; color: #374151; text-decoration: none; font-size: 15px; transition: background-color .3s ease, color .3s ease; }
          .kt-row:hover { background: #fff; color: ${RED}; }
          .kt-ico { width: 40px; height: 40px; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background-color .3s ease; }
          .kt-row:hover .kt-ico { background: #fdf5f4; }
        `}</style>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 28px 100px', position: 'relative' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#6b7280', marginBottom: 16 }}>Kontakt</p>
          <h1 style={{ fontFamily: 'var(--font-archivo-black), sans-serif', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 900, color: '#0c0c0d', margin: '0 0 20px', lineHeight: 1.1 }}>
            Kako možemo da pomognemo?
          </h1>
          <div aria-hidden="true" style={{ width: 64, height: 2, background: RED, marginBottom: 24 }} />
          <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.7, marginBottom: 48 }}>
            Pošaljite nam upit - brzo odgovaramo na sve poruke.
          </p>

          <div className="kt-grid">
            {/* Forma */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label className="kt-label" htmlFor="kt-name">Ime i prezime</label>
                <input id="kt-name" type="text" required placeholder="Vaše ime" value={name} onChange={(e) => setName(e.target.value)} className="kt-input" />
              </div>
              <div>
                <label className="kt-label" htmlFor="kt-email">E-pošta</label>
                <input id="kt-email" type="email" required placeholder="vasa@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="kt-input" />
              </div>
              <div>
                <label className="kt-label" htmlFor="kt-msg">Poruka</label>
                <textarea id="kt-msg" required placeholder="Kako možemo da pomognemo?" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} className="kt-input" style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="kt-btn">Pošalji poruku</button>
            </form>

            {/* Kontakt podaci */}
            <aside className="kt-card">
              <h2 style={{ fontSize: 15, fontWeight: 700, color: RED, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Kontakt podaci</h2>
              <a href="tel:+381114072081" className="kt-row">
                <span className="kt-ico">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
                </span>
                {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`} className="kt-row">
                <span className="kt-ico">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                </span>
                {EMAIL}
              </a>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="kt-row">
                <span className="kt-ico">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                {ADDRESS}
              </a>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
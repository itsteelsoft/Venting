'use client'

import { useEffect, useRef, useState } from 'react'
import { FAQ, type FaqItem } from '@/lib/faq'

const RED = '#c0392f'

type Msg = { from: 'bot' | 'user'; text: string; link?: FaqItem['link'] }

const GREETING: Msg = {
  from: 'bot',
  text: 'Zdravo! Ja sam Venting asistent. Izaberite pitanje ispod i odmah ću vam odgovoriti.',
}

export default function FaqChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [asked, setAsked] = useState<number[]>([])
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Esc zatvara prozor
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  // Uvek prikaži poslednju poruku
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  function ask(i: number) {
    if (typing) return
    const item = FAQ[i]
    setMessages((m) => [...m, { from: 'user', text: item.q }])
    setAsked((a) => [...a, i])
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: item.a, link: item.link }])
      setTyping(false)
    }, 650)
  }

  const remaining = FAQ.map((_, i) => i).filter((i) => !asked.includes(i))

  return (
    <div
      role="dialog"
      aria-label="Najčešća pitanja"
      className="fixed z-[60] bottom-4 right-4 left-4 sm:left-auto sm:bottom-7 sm:right-7 sm:w-[380px] h-[min(600px,calc(100vh-2rem))] flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.25)] border border-[#e2e2e2]"
    >
      {/* Zaglavlje */}
      <div className="flex items-center gap-3 px-5 py-4 text-white" style={{ background: RED }}>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[15px] font-bold leading-tight">Venting asistent</p>
          <p className="font-sans text-[12px] text-white/80">Najčešća pitanja</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Zatvori"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/20">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </div>

      {/* Poruke */}
      <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 bg-[#fffafa]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-3 font-sans text-[13.5px] leading-relaxed ${
                m.from === 'user'
                  ? 'text-white rounded-2xl rounded-br-md'
                  : 'bg-white text-brand-text border border-[#f0e2e0] rounded-2xl rounded-bl-md'
              }`}
              style={m.from === 'user' ? { background: RED } : undefined}
            >
              {m.text}
              {m.link && (
                <a href={m.link.href}
                  className="mt-2.5 flex w-fit items-center gap-1.5 font-semibold text-[13px] transition-opacity hover:opacity-70"
                  style={{ color: RED }}>
                  {m.link.label}
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                </a>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#f0e2e0] rounded-2xl rounded-bl-md px-4 py-3.5 flex gap-1.5" aria-label="Kucam odgovor">
              {[0, 1, 2].map((d) => (
                <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#c9a9a5] animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pitanja */}
      <div className="border-t border-[#eee] bg-white px-4 py-3 max-h-[42%] overflow-y-auto">
        {remaining.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {remaining.map((i) => (
              <button key={i} type="button" onClick={() => ask(i)} disabled={typing}
                className="text-left font-sans text-[12.5px] text-brand-text bg-white border border-[#e07a73] rounded-full px-3.5 py-1.5 transition-colors duration-200 hover:bg-[#fdf5f4] hover:text-[#c0392f] disabled:opacity-50">
                {FAQ[i].q}
              </button>
            ))}
          </div>
        ) : (
          <p className="font-sans text-[13px] text-[#666] text-center py-1">
            Niste našli odgovor?{' '}
            <a href="/kontakt" className="font-semibold hover:opacity-70" style={{ color: RED }}>Kontaktirajte nas</a>
          </p>
        )}
      </div>
    </div>
  )
}
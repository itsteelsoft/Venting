'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

// Sekcija se pojavljuje (fade + blago podizanje) svaki put kad uđe u ekran,
// a sakriva se kad izađe iz njega. Animacija je samo na desktopu - pravila
// su u app/globals.css (.reveal).
export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal${visible ? ' is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}
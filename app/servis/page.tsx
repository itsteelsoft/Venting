import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'

export const metadata = { title: 'Servis i podrška' }

const RED = '#c0392f'

const SERVICES = [
  {
    title: 'Ugradnja',
    desc: 'Profesionalna ugradnja klima uređaja, rekuperatora i fancoila od strane sertifikovanih tehničara.',
    icon: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />,
  },
  {
    title: 'Redovno održavanje',
    desc: 'Godišnji servis i čišćenje uređaja za optimalne performanse i duži vek trajanja.',
    icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18M9 16l2 2 4-4" /></>,
  },
  {
    title: 'Popravka i dijagnostika',
    desc: 'Brza dijagnostika i popravka kvara na svim Venting uređajima.',
    icon: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v3l2 2" /></>,
  },
]

export default function ServisPage() {
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
          .srv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 56px; }
          @media (max-width: 860px) { .srv-grid { grid-template-columns: 1fr; } }
          .srv-card { background: #fff; border: 1px solid #f6e3e1; border-radius: 18px; padding: 30px 26px; transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease, background-color .3s ease; }
          .srv-card:hover { transform: translateY(-6px); border-color: #e07a73; background: #fffafa; box-shadow: 0 14px 34px rgba(0,0,0,.08); }
          .srv-icon { width: 46px; height: 46px; border-radius: 12px; background: #fdf5f4; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; transition: background-color .3s ease; }
          .srv-card:hover .srv-icon { background: #fff; }
          .srv-btn { display: inline-block; background: #0c0c0d; color: #fff; border: 2px solid #0c0c0d; border-radius: 12px; padding: 14px 28px; font-size: 14px; font-weight: 600; text-decoration: none; white-space: nowrap; transition: background-color .3s ease, border-color .3s ease, color .3s ease, transform .15s ease; }
          .srv-btn:hover { background: ${RED}; border-color: ${RED}; }
          .srv-btn:active { background: #d9655c; border-color: #d9655c; transform: scale(.98); }
          .srv-btn-outline { background: transparent; color: #0c0c0d; }
          .srv-btn-outline:hover { color: #fff; }
        `}</style>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 28px 100px', position: 'relative' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#6b7280', marginBottom: 16 }}>Podrška</p>
          <h1 style={{ fontFamily: 'var(--font-archivo-black), sans-serif', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 900, color: '#0c0c0d', margin: '0 0 20px', lineHeight: 1.1 }}>
            Servis i podrška
          </h1>
          <div aria-hidden="true" style={{ width: 64, height: 2, background: RED, marginBottom: 24 }} />
          <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 56, maxWidth: 580, lineHeight: 1.7 }}>
            Naš tim sertifikovanih tehničara spreman je da vam pomogne u svakom trenutku, od ugradnje do redovnog održavanja.
          </p>

          <div className="srv-grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="srv-card">
                <div className="srv-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {s.icon}
                  </svg>
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0c0c0d', marginBottom: 10 }}>{s.title}</h2>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background: '#fdf5f4', border: '1px solid #f6e3e1', borderLeft: `3px solid ${RED}`, borderRadius: 18, padding: '36px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0c0c0d', marginBottom: 8 }}>Zakažite servis</h2>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Pišite nam ili nas pozovite i dogovorićemo termin koji vam odgovara.</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="tel:+381114072081" className="srv-btn srv-btn-outline">011 4072081</a>
              <a href="mailto:servis@steelsoft.rs?subject=Zakazivanje%20servisa" className="srv-btn">servis@steelsoft.rs</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
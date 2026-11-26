import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'

export const metadata = { title: 'O nama' }

const RED = '#c0392f'

const PROGRAM = [
  'Split klima uređaji',
  'Multi split klima uređaji',
  'Komercijalni klima uređaji',
  'Rekuperatori',
  'Fancoili',
  'Pumpe za kondenz',
  'Pumpe za pranje',
  'Termostati',
]

export default function ONamaPage() {
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
          .about-item { display: flex; align-items: center; gap: 12px; font-size: 15px; color: #374151; padding: 12px 16px; border: 1px solid #f6e3e1; border-radius: 10px; background: #fff; transition: border-color .3s ease, background-color .3s ease, transform .3s ease; }
          .about-item:hover { border-color: #e07a73; background: #fffafa; transform: translateX(4px); }
          .about-btn { display: inline-block; margin-top: 48px; background: #0c0c0d; color: #fff; border: 2px solid #0c0c0d; border-radius: 12px; padding: 14px 32px; font-size: 14px; font-weight: 600; text-decoration: none; transition: background-color .3s ease, border-color .3s ease, transform .15s ease; }
          .about-btn:hover { background: ${RED}; border-color: ${RED}; }
          .about-btn:active { background: #d9655c; border-color: #d9655c; transform: scale(.98); }
        `}</style>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 28px 100px', position: 'relative' }}>

          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#6b7280', marginBottom: 16 }}>
            O brendu
          </p>
          <h1 style={{ fontFamily: 'var(--font-archivo-black), sans-serif', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 900, color: '#0c0c0d', margin: '0 0 20px', lineHeight: 1.1 }}>
            Kvalitet i ekonomičnost u jednom brendu
          </h1>
          <div aria-hidden="true" style={{ width: 64, height: 2, background: RED, marginBottom: 44 }} />

          <div style={{ fontSize: 16, color: '#374151', lineHeight: 1.85, display: 'flex', flexDirection: 'column', gap: 28 }}>

            <p>
              Brend Venting osnovan je 2010. godine od strane preduzeća <strong style={{ color: '#0c0c0d' }}>Steelsoft d.o.o.</strong> kao robna marka pod kojom bi se koristili proizvodi najboljeg odnosa cene i kvaliteta više kineskih, evropskih ali i srpskih, domaćih proizvođača opreme i HVAC komponenti.
            </p>

            <p>
              Steelsoft d.o.o. je glavni distributer Venting opreme, gde se odlikujemo odličnom post-prodajnom podrškom kao i lagerom servisnih delova radi pružanja najbolje usluge.
            </p>

            {/* Istaknuta rečenica */}
            <p style={{ margin: 0, padding: '4px 0 4px 22px', borderLeft: `3px solid ${RED}`, fontSize: 19, fontWeight: 600, color: '#0c0c0d', lineHeight: 1.5 }}>
              Brend Venting je prepoznatljiv po kvalitetu, ekonomičnosti i funkcionalnosti.
            </p>

            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0c0c0d', marginBottom: 16 }}>Program</h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                {PROGRAM.map((item) => (
                  <li key={item} className="about-item">
                    <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: RED, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#fdf5f4', border: '1px solid #f6e3e1', borderLeft: `3px solid ${RED}`, borderRadius: 16, padding: '28px 32px' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: RED, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Vizija</h2>
              <p style={{ margin: 0, fontSize: 16, color: '#374151', lineHeight: 1.8 }}>
                Vizija Venting-a jeste da brend Venting bude sinonim za klima uređaje koji su ekonomični i kvalitetni i koji prate nove standarde u tehnologiji i održivom razvoju.
              </p>
            </div>

          </div>

          <a href="/kontakt" className="about-btn">
            Kontaktirajte nas
          </a>

        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
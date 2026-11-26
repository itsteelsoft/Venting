import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'Politika kolačića - Venting' }

export default function KolaciciPage() {
  return (
    <LegalPage
      current="/kolacici"
      title="Politika kolačića"
      intro={<p>Sajt ventinghvac.com koristi kolačiće (cookies) kako bi osigurao ispravno funkcionisanje i poboljšao korisničko iskustvo.</p>}
      sections={[
        {
          title: 'Šta su kolačići?',
          body: <p>Kolačići su male tekstualne datoteke koje se čuvaju na vašem uređaju kada posećujete sajt. Koristimo ih za pamćenje vaših podešavanja (npr. odabrani jezik).</p>,
        },
        {
          title: 'Koje kolačiće koristimo?',
          body: <p><strong style={{ color: '#0c0c0d' }}>Neophodne</strong>: obezbeđuju osnovno funkcionisanje sajta (npr. čuvanje odabranog jezika). Ovi kolačići ne mogu biti isključeni.</p>,
        },
        {
          title: 'Upravljanje kolačićima',
          body: <p>Možete obrisati ili blokirati kolačiće u podešavanjima vašeg pregledača. Imajte u vidu da blokiranje kolačića može uticati na funkcionalnost sajta.</p>,
        },
        {
          title: 'Kontakt',
          body: <p>Za pitanja: <a href="mailto:prodaja@steelsoft.rs">prodaja@steelsoft.rs</a></p>,
        },
      ]}
    />
  )
}
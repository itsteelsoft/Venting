import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'Uslovi korišćenja - Venting' }

export default function UsloviPage() {
  return (
    <LegalPage
      current="/uslovi"
      title="Uslovi korišćenja"
      intro={<p>Korišćenjem sajta ventinghvac.com slažete se sa sledećim uslovima. Ukoliko se ne slažete, molimo vas da ne koristite sajt.</p>}
      sections={[
        {
          title: 'Sadržaj sajta',
          body: <p>Sav sadržaj na sajtu (tekst, slike, logotipi) vlasništvo je kompanije Steelsoft d.o.o. i zaštićen je autorskim pravima. Nije dozvoljena upotreba bez pismene dozvole.</p>,
        },
        {
          title: 'Tačnost informacija',
          body: <p>Trudimo se da informacije budu tačne i ažurne. Steelsoft d.o.o. ne preuzima odgovornost za eventualne greške u opisima proizvoda ili tehničkim specifikacijama.</p>,
        },
        {
          title: 'Izmene uslova',
          body: <p>Zadržavamo pravo izmene ovih uslova u bilo kom trenutku. Izmene stupaju na snagu objavljivanjem na sajtu.</p>,
        },
        {
          title: 'Kontakt',
          body: <p>Za pitanja u vezi sa uslovima korišćenja: <a href="mailto:prodaja@steelsoft.rs">prodaja@steelsoft.rs</a></p>,
        },
      ]}
    />
  )
}
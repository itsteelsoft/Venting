import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'Politika privatnosti - Venting' }

export default function PrivatnostPage() {
  return (
    <LegalPage
      current="/privatnost"
      title="Politika privatnosti"
      intro={<p>Steelsoft d.o.o. poštuje privatnost korisnika svog sajta. Ova politika objašnjava koje podatke prikupljamo, kako ih koristimo i štitimo.</p>}
      sections={[
        {
          title: 'Podaci koje prikupljamo',
          body: <p>Prikupljamo isključivo podatke koje nam dobrovoljno dostavite putem kontakt forme (ime, e-mail, poruka) i prijave na bilten (e-mail adresa i, po želji, ime). Ne prikupljamo podatke o plaćanju niti posebne kategorije ličnih podataka.</p>,
        },
        {
          title: 'Svrha obrade',
          body: <p>Podatke iz kontakt forme koristimo isključivo u svrhu odgovaranja na vaše upite i pružanja traženih informacija. E-mail adresu iz prijave na bilten koristimo samo za slanje novosti i ponuda, uz vašu saglasnost datu pri prijavi.</p>,
        },
        {
          title: 'Bilten i odjava',
          body: <p>Sa biltena se možete odjaviti u svakom trenutku, slanjem zahteva na adresu navedenu ispod. Posle odjave vašu adresu više ne koristimo za slanje biltena.</p>,
        },
        {
          title: 'Kolačići',
          body: <p>Sajt koristi neophodne kolačiće za ispravno funkcionisanje. Detaljnije informacije dostupne su u <a href="/kolacici">Politici kolačića</a>.</p>,
        },
        {
          title: 'Kontakt',
          body: <p>Za sva pitanja u vezi sa zaštitom podataka, kontaktirajte nas na <a href="mailto:prodaja@steelsoft.rs">prodaja@steelsoft.rs</a>.</p>,
        },
      ]}
    />
  )
}
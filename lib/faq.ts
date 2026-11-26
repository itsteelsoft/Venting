// Najčešća pitanja za FAQ asistent (dugme FAQ dole desno).
// Pitanje, odgovor i opcioni link - menjaj, dodaj ili obriši slobodno.

export type FaqItem = {
  q: string
  a: string
  link?: { label: string; href: string }
}

export const FAQ: FaqItem[] = [
  {
    q: 'Koji kapacitet klime mi treba?',
    a: 'Za prostoriju do oko 25 m² obično je dovoljan uređaj od 9.000 BTU (2,6 kW), a za prostor do oko 35 m² uređaj od 12.000 BTU (3,5 kW). Potkrovlja i prostorije okrenute jugu ili zapadu traže veći kapacitet. Za tačnu procenu pošaljite nam površinu i namenu prostora.',
    link: { label: 'Pošalji upit', href: '/kontakt' },
  },
  {
    q: 'Šta znači inverter?',
    a: 'Inverter klima menja brzinu rada kompresora umesto da ga stalno pali i gasi. Zato troši manje struje, tiša je i drži stabilniju temperaturu u prostoriji.',
  },
  {
    q: 'Da li klima može da greje zimi?',
    a: 'Da. Klima uređaji rade kao toplotne pumpe i efikasno greju i na niskim spoljnim temperaturama. Koliko je uređaj efikasan u grejanju pokazuje oznaka SCOP i energetska klasa za grejanje.',
  },
  {
    q: 'Koja je razlika između kućne i komercijalne klime?',
    a: 'Kućne (zidne) klime su namenjene stanovima i kućama. Komercijalni uređaji - kasetni, kanalski i podno-plafonski - pokrivaju veće prostore poput kancelarija, lokala i hala i lakše se uklapaju u spušteni plafon.',
    link: { label: 'Pogledaj ponudu', href: '/shop' },
  },
  {
    q: 'Šta je multi split sistem?',
    a: 'Multi split sistem povezuje jednu spoljnu jedinicu sa više unutrašnjih, pa jednom spoljnom jedinicom klimatizujete više prostorija, a svaku podešavate posebno.',
  },
  {
    q: 'Šta je VRF sistem?',
    a: 'VRF sistem povezuje jednu ili više spoljnih jedinica sa velikim brojem unutrašnjih i prilagođava protok rashladnog fluida potrebi svake zone. Pogodan je za poslovne objekte, hotele i stambene komplekse.',
  },
  {
    q: 'Čemu služi rekuperator?',
    a: 'Rekuperator stalno izbacuje ustajali i ubacuje svež vazduh, a toplotu odvedenog vazduha predaje svežem. Dobijate svež vazduh bez otvaranja prozora, manje vlage i buđi i niže troškove grejanja.',
    link: { label: 'Rekuperatori', href: '/shop?tab=3' },
  },
  {
    q: 'Šta je Flex Fit?',
    a: 'Flex Fit je Venting multi sistem sa Hidro box-om: jedna spoljna jedinica pokriva klimatizaciju, podno grejanje i pripremu sanitarne tople vode.',
    link: { label: 'Saznaj više', href: '/flexfit' },
  },
  {
    q: 'Koliko često treba servisirati klimu?',
    a: 'Preporuka je redovan servis jednom godišnje, najbolje pre sezone. Filtere unutrašnje jedinice tokom sezone treba čistiti na svake 2-4 nedelje.',
  },
  {
    q: 'Kako da zakažem servis?',
    a: 'Servis možete zakazati preko stranice Servis i podrška ili nas pozovite na 011 4072081.',
    link: { label: 'Servis i podrška', href: '/servis' },
  },
  {
    q: 'Kako da vas kontaktiram?',
    a: 'Pozovite nas na 011 4072081, pišite na office@venting.rs ili nas posetite na adresi Autoput za Novi Sad, Beograd.',
    link: { label: 'Kontakt', href: '/kontakt' },
  },
]
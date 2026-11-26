// Svi članci bloga na jednom mestu.
// Novi članak: dodaj objekat na POČETAK niza (najnoviji prvi).
// Slike stavi u public/images/blog/ i navedi putanju, npr. '/images/blog/klima-leto.webp'.

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; src: string; alt: string; caption?: string }

export type BlogPost = {
  slug: string // deo adrese: /blog/<slug>
  date: string // prikaz datuma
  readTime: string
  tag: string
  title: string
  titleEn?: string // naslov na početnoj kad je izabran engleski
  excerpt: string
  cover?: string // naslovna slika; bez nje se prikazuje gradijent
  gradient: string
  content: BlogBlock[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'kako-odabrati-klima-uredjaj',
    date: '05. jun 2026.',
    readTime: '4 min',
    tag: 'Saveti',
    title: 'Kako odabrati pravi klima uređaj za leto 2026.',
    titleEn: 'How to choose the right air conditioner for summer 2026',
    excerpt:
      'Investicija u dobar klima uređaj može biti ključna za udobnost tokom vrućih leta. Evo šta treba da znate pre kupovine.',
    gradient: 'linear-gradient(145deg, #b4c8d8 0%, #7a9ab0 100%)',
    cover: '/images/blog/kako-odabrati-klima-uredjaj.webp',
    content: [
      { type: 'p', text: 'Izbor klima uređaja počinje od prostorije, a ne od cene. Površina, visina plafona, orijentacija prozora i broj ljudi koji borave u prostoru određuju koji kapacitet vam je zaista potreban.' },
      { type: 'h2', text: 'Kapacitet' },
      { type: 'p', text: 'Za prosečnu sobu do 25 m² obično je dovoljan uređaj od 9.000 BTU (2,6 kW), a za dnevne boravke do 35 m² uređaj od 12.000 BTU (3,5 kW). Prostorije okrenute jugu ili zapadu i potkrovlja traže veći kapacitet.' },
      { type: 'h2', text: 'Na šta još obratiti pažnju' },
      { type: 'list', items: [
        'Inverter tehnologija troši manje struje i održava stabilniju temperaturu.',
        'Energetska klasa (SEER i SCOP) pokazuje koliko je uređaj efikasan leti i zimi.',
        'Nivo buke unutrašnje jedinice je važan za spavaće sobe.',
        'Grejanje na niskim spoljnim temperaturama, ako uređaj koristite i zimi.',
      ] },
      { type: 'p', text: 'Ako niste sigurni koji model odgovara vašem prostoru, kontaktirajte nas i pomoći ćemo vam da izaberete.' },
    ],
  },
  {
    slug: 'prednosti-rekuperatora',
    date: '28. maj 2026.',
    readTime: '4 min',
    tag: 'Rekuperatori',
    title: 'Prednosti rekuperatora za vaš dom',
    titleEn: 'The benefits of recuperators for your home',
    excerpt:
      'Rekuperatori nisu samo za poslovne prostore. Saznajte kako mogu poboljšati kvalitet vazduha u vašem domu i smanjiti račune za struju.',
    gradient: 'linear-gradient(145deg, #d4b4a8 0%, #b08878 100%)',
    cover: '/images/blog/prednosti-rekuperatora.webp',
    content: [
      { type: 'p', text: 'Rekuperator neprekidno izbacuje ustajali vazduh iz prostorija i ubacuje svež spoljni vazduh, pri čemu toplotu odvedenog vazduha predaje svežem.' },
      { type: 'h2', text: 'Zašto se isplati' },
      { type: 'list', items: [
        'Svež vazduh bez otvaranja prozora i gubitka toplote.',
        'Manja vlažnost i manje kondenzacije i buđi.',
        'Filtracija prašine i polena.',
        'Niži troškovi grejanja i hlađenja.',
      ] },
      { type: 'p', text: 'Za stanove postoje kompaktni zidni rekuperatori koji se ugrađuju bez kanala, a za kuće centralni sistemi sa razvodom.' },
    ],
  },
  {
    slug: 'fancoili-grejanje-i-hladjenje',
    date: '15. maj 2026.',
    readTime: '3 min',
    tag: 'Fancoili',
    title: 'Fancoili: efikasno grejanje i hlađenje',
    titleEn: 'Fan coils: efficient heating and cooling',
    excerpt:
      'Fancoil jedinice nude fleksibilno i energetski efikasno rešenje za grejanje i hlađenje stambenih i poslovnih prostora.',
    gradient: 'linear-gradient(145deg, #c0c8d0 0%, #8890a0 100%)',
    cover: '/images/blog/fancoili-grejanje-i-hladjenje.webp',
    content: [
      { type: 'p', text: 'Fancoil je jedinica sa izmenjivačem i ventilatorom kroz koju protiče topla ili hladna voda iz toplotne pumpe ili čilera. Ventilator prenosi toplotu u prostoriju brže od klasičnog radijatora.' },
      { type: 'h2', text: 'Gde se koriste' },
      { type: 'p', text: 'Fancoili su česti u kućama sa toplotnom pumpom, hotelima i kancelarijama, jer jedna instalacija služi i za grejanje i za hlađenje.' },
    ],
  },
  {
    slug: 'sta-je-vrf-sistem',
    date: '02. maj 2026.',
    readTime: '4 min',
    tag: 'Komercijalno',
    title: 'Šta je VRF sistem i kada ga koristiti?',
    titleEn: 'What is a VRF system and when to use it?',
    excerpt:
      'VRF sistemi su idealni za veće objekte koji zahtevaju preciznu kontrolu temperature u više zona. Saznajte više o prednostima.',
    gradient: 'linear-gradient(145deg, #1e2e4a 0%, #141e38 100%)',
    cover: '/images/blog/sta-je-vrf-sistem.webp',
    content: [
      { type: 'p', text: 'VRF (Variable Refrigerant Flow) sistem povezuje jednu ili više spoljnih jedinica sa velikim brojem unutrašnjih jedinica, pri čemu se protok rashladnog fluida prilagođava stvarnoj potrebi svake zone.' },
      { type: 'h2', text: 'Kada je VRF pravi izbor' },
      { type: 'list', items: [
        'Poslovni objekti, hoteli i stambeni kompleksi sa mnogo prostorija.',
        'Kada je potrebna nezavisna regulacija temperature po zonama.',
        'Kada nema mesta za veliki broj spoljnih jedinica na fasadi.',
      ] },
    ],
  },
]

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

// Prethodni = noviji članak, sledeći = stariji članak.
export function getAdjacent(slug: string) {
  const i = BLOG_POSTS.findIndex((p) => p.slug === slug)
  return {
    prev: i > 0 ? BLOG_POSTS[i - 1] : undefined,
    next: i >= 0 && i < BLOG_POSTS.length - 1 ? BLOG_POSTS[i + 1] : undefined,
  }
}

export function getRelated(slug: string, count = 3) {
  return BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, count)
}

import type { Metadata } from 'next'
import { getProducts } from '@/lib/products'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import ShopClient from './ShopClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Prodavnica',
  description:
    'Kompletna ponuda VENTING opreme: kućni i komercijalni klima uređaji, multi split sistemi, rekuperatori, fancoili i dodatna oprema.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Prodavnica | Venting',
    description:
      'Kompletna ponuda VENTING opreme: klima uređaji, rekuperatori, fancoili i dodatna oprema.',
    url: '/shop',
  },
}

export default async function ShopPage({ searchParams }: { searchParams: { tab?: string; page?: string } }) {
  const products = await getProducts()
  const tab = parseInt(searchParams.tab ?? '', 10)
  const initialTab = Number.isNaN(tab) ? -1 : tab
  const pg = parseInt(searchParams.page ?? '', 10)
  const initialPage = Number.isNaN(pg) || pg < 1 ? 1 : pg

  return (
    <>
      <Header />
      <main>
            <ShopClient products={products} initialTab={initialTab} initialPage={initialPage} />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}

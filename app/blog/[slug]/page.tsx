import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import { BLOG_POSTS, getPost, getAdjacent, getRelated, type BlogBlock } from '@/lib/blog'

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) return { title: 'Blog - Venting' }
  return { title: `${post.title} - Venting`, description: post.excerpt }
}

const muted = '#6b7280'
const ink = '#0c0c0d'

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 style={{ fontSize: 22, fontWeight: 700, color: ink, margin: '16px 0 0', lineHeight: 1.3 }}>{block.text}</h2>
    case 'p':
      return <p style={{ margin: 0 }}>{block.text}</p>
    case 'list':
      return (
        <ul style={{ margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )
    case 'image':
      return (
        <figure style={{ margin: '8px 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} style={{ width: '100%', height: 'auto', borderRadius: 8, display: 'block' }} />
          {block.caption && <figcaption style={{ fontSize: 13, color: muted, marginTop: 8 }}>{block.caption}</figcaption>}
        </figure>
      )
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const { prev, next } = getAdjacent(post.slug)
  const related = getRelated(post.slug)

  return (
    <>
      <Header />
      <main style={{ background: '#fff', minHeight: '60vh' }}>
        <style>{`
          .post-back { display: inline-flex; align-items: center; gap: 6px; transition: color .3s ease, gap .3s ease; }
          .post-back:hover { color: #c0392f !important; gap: 10px; }
          .post-nav .post-nav-label { transition: color .3s ease; }
          .post-nav:hover .post-nav-label { color: #0c0c0d !important; }
          .post-card { display: block; transition: transform .3s ease; }
          .post-card:hover { transform: translateY(-4px); }
          .post-card .post-card-img img { transition: transform .5s ease; }
          .post-card:hover .post-card-img img { transform: scale(1.05); }
          .post-card .post-card-title { transition: color .3s ease; }
          .post-card:hover .post-card-title { color: #c0392f !important; }
        `}</style>

        <article style={{ maxWidth: 780, margin: '0 auto', padding: '64px 56px 40px', position: 'relative' }}>
          {/* Tanke crvene linije levo i desno od teksta, blede ka vrhu i dnu */}
          <style>{`.post-line{position:absolute;top:0;bottom:0;width:1px;pointer-events:none;background:linear-gradient(to bottom,transparent 0%,#e8b4b0 15%,#e8b4b0 85%,transparent 100%)}@media (max-width:767px){.post-line{display:none}}`}</style>
          <div aria-hidden="true" className="post-line" style={{ left: 0 }} />
          <div aria-hidden="true" className="post-line" style={{ right: 0 }} />

          <Link href="/blog" className="post-back" style={{ fontSize: 14, color: muted, textDecoration: 'none' }}>
            ← Svi članci
          </Link>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '32px 0 16px', fontSize: 13, color: muted }}>
            <span style={{ fontWeight: 700, color: ink, background: '#f3f4f6', borderRadius: 6, padding: '3px 10px' }}>{post.tag}</span>
            <span>{post.date}</span>
            <span>{post.readTime} čitanja</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-archivo-black), sans-serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 900, color: ink, margin: '0 0 32px', lineHeight: 1.15 }}>
            {post.title}
          </h1>

          <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden', background: post.gradient, marginBottom: 40 }}>
            {post.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
          </div>

          <div style={{ fontSize: 17, color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {post.content.map((block, i) => <Block key={i} block={block} />)}
          </div>

          {/* Prethodni / sledeći članak */}
          <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 64, paddingTop: 32, borderTop: '1px solid #edf1f5' }}>
            {prev ? (
              <Link href={`/blog/${prev.slug}`} className="post-nav" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="post-nav-label" style={{ fontSize: 13, color: muted }}>← Noviji članak</span>
                <p className="post-nav-title" style={{ fontSize: 16, fontWeight: 700, color: ink, margin: '6px 0 0', lineHeight: 1.35 }}>{prev.title}</p>
              </Link>
            ) : <span />}
            {next && (
              <Link href={`/blog/${next.slug}`} className="post-nav" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'right' }}>
                <span className="post-nav-label" style={{ fontSize: 13, color: muted }}>Stariji članak →</span>
                <p className="post-nav-title" style={{ fontSize: 16, fontWeight: 700, color: ink, margin: '6px 0 0', lineHeight: 1.35 }}>{next.title}</p>
              </Link>
            )}
          </nav>
        </article>

        {/* Ostali članci */}
        {related.length > 0 && (
          <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 28px 100px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: ink, marginBottom: 24 }}>Pročitajte još</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="post-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="post-card-img" style={{ aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', background: p.gradient, marginBottom: 14 }}>
                    {p.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: muted }}>{p.date}</span>
                  <p className="post-card-title" style={{ fontSize: 16, fontWeight: 700, color: ink, margin: '6px 0 0', lineHeight: 1.35 }}>{p.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
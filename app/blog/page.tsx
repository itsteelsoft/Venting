import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import { BLOG_POSTS } from '@/lib/blog'

export const metadata = { title: 'Blog - Venting' }

export default function BlogPage() {
  return (
    <>
      <Header />
      <main style={{ background: '#fff', minHeight: '60vh', position: 'relative' }}>
        {/* Pozadina: jedva vidljiva mreža kao na tehničkom crtežu, bledi naniže */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(#eceff2 1px, transparent 1px), linear-gradient(90deg, #eceff2 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 75%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 75%)',
        }} />

        {/* Hover za članke i bledocrvene linije između njih */}
        <style>{`
          .blog-row { display: block; color: inherit; text-decoration: none; padding: 30px 20px; margin: 0 -20px; border-radius: 14px; transition: background-color .3s ease; }
          .blog-row:hover { background: #fffafa; }
          .blog-thumb img { transition: transform .5s ease; }
          .blog-row:hover .blog-thumb img { transform: scale(1.05); }
          .blog-more { display: inline-flex; align-items: center; gap: 6px; transition: color .3s ease, gap .3s ease; }
          .blog-row:hover .blog-more { color: #c0392f; gap: 10px; }
          .blog-sep { height: 1px; background: linear-gradient(to right, transparent 0%, #e8b4b0 50%, transparent 100%); }
        `}</style>

        <div style={{ maxWidth: 940, margin: '0 auto', padding: '80px 28px', position: 'relative' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#6b7280', marginBottom: 16 }}>Venting</p>
          <h1 style={{ fontFamily: 'var(--font-archivo-black), sans-serif', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 900, color: '#0c0c0d', margin: '0 0 20px', lineHeight: 1.1 }}>
            Blog
          </h1>
          <div aria-hidden="true" style={{ width: 64, height: 2, background: '#c0392f', marginBottom: 48 }} />

          <div>
            <div className="blog-sep" />
            {BLOG_POSTS.map((post) => (
              <div key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="blog-row">
                  <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="blog-thumb" style={{ flexShrink: 0, width: 200, aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', background: post.gradient }}>
                      {post.cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.cover} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#6b7280', background: '#f3f4f6', borderRadius: 6, padding: '3px 10px' }}>{post.tag}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>{post.date}</span>
                      </div>
                      <h2 style={{ fontSize: 19, fontWeight: 700, color: '#0c0c0d', marginBottom: 10, lineHeight: 1.3 }}>{post.title}</h2>
                      <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, margin: '0 0 12px' }}>{post.excerpt}</p>
                      <span className="blog-more" style={{ fontSize: 13, fontWeight: 700, color: '#0c0c0d' }}>
                        Pročitaj članak
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="blog-sep" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
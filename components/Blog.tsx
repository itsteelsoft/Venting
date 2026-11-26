'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { BLOG_POSTS } from '@/lib/blog'

export default function Blog() {
  const { t, locale } = useLanguage()

  return (
    <section className="py-20 bg-white">
      <div className="max-w-site mx-auto px-10">
        <h2 className="font-sans text-[28px] font-black uppercase tracking-heading text-brand-text text-center mb-12">
          {t.blog}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {BLOG_POSTS.slice(0, 4).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block transition-opacity duration-200 hover:opacity-80">
              <div className="w-full rounded-lg mb-4 overflow-hidden"
                style={{ aspectRatio: '4/3', background: post.gradient }}>
                {post.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover} alt={post.title} className="w-full h-full object-cover block" />
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-[1px] text-[#aaa]">{t.readLabel}</span>
                <span className="text-[#ddd] text-xs">·</span>
                <span className="font-sans text-[11px] text-[#aaa]">{post.date}</span>
                <span className="text-[#ddd] text-xs">·</span>
                <span className="font-sans text-[11px] text-[#aaa]">{post.readTime}</span>
              </div>
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.3px] leading-snug text-brand-text">
                {locale === 'en' && post.titleEn ? post.titleEn : post.title}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog" className="inline-flex items-center font-sans text-base font-medium rounded-pill px-7 py-2.5 border-2 border-brand-text text-brand-text bg-transparent transition-colors duration-300 hover:border-[#c0392f] hover:bg-[#c0392f] hover:text-white  active:bg-[#d9655c] active:border-[#d9655c] active:scale-[0.98]">
            {t.seeMore}
          </Link>
        </div>
      </div>
    </section>
  )
}

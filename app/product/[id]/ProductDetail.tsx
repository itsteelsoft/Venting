'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'
import type { Product } from '@/lib/sync'
import styles from './ProductDetail.module.css'
import Reveal from '@/components/Reveal'
import { NAV_CATEGORY_MAP, categoryHref } from '@/lib/categories.mjs'
import { docUrl, docType, hasDoc } from '@/lib/docs.mjs'

interface Props {
  product: Product
  related?: Product[]
}

function ImagePlaceholder() {
  return (
    <div className={styles.imagePlaceholder}>
      <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="120" height="90" rx="8" fill="#edf1f5" />
        <path d="M30 64 L48 42 L62 56 L78 36 L94 64" stroke="#c8d4de" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="42" cy="34" r="7" fill="#c8d4de" />
      </svg>
    </div>
  )
}

export default function ProductDetail({ product, related = [] }: Props) {
  const { t } = useLanguage()
  const [zoomOpen, setZoomOpen] = useState(false)
  const [tab, setTab] = useState<'specs' | 'docs'>('specs')

  // Dokumentacija sa adresama (prazno ako adresa servera za dokumenta nije podešena)
  const docs = (product.docs ?? [])
    .map((d) => ({ ...d, url: docUrl(d.file) as string, type: docType(d.file) as string }))
    .filter((d) => d.url && hasDoc(d.file))

  // Uvećana slika: Esc zatvara, stranica ispod se ne skroluje
  useEffect(() => {
    if (!zoomOpen) return
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomOpen(false) }
    document.addEventListener('keydown', esc)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = prev }
  }, [zoomOpen])

  // Group specs by their group label (empty group → 'Opšte')
  const specGroups = product.specs.reduce<Record<string, typeof product.specs>>((acc, spec) => {
    const key = spec.group || 'Opšte'
    acc[key] = acc[key] ?? []
    acc[key].push(spec)
    return acc
  }, {})

  // Quick stats: up to 4 items, best available data first
  const quickStats: { label: string; value: string; attr?: string; unit?: string }[] = []
  const seenNames = new Set<string>()

  // Top-level fields first (only block the name if we actually used it)
  if (product.energyClass) {
    quickStats.push({ label: t.shop.energyClass, value: product.energyClass })
    seenNames.add('Energetski razred')
    seenNames.add('Energetska Klasa')
  }
  if (product.inverter) {
    quickStats.push({ label: t.shop.inverter, value: product.inverter })
    seenNames.add('Inverter')
  }

  // Pass 1: API-flagged basic specs
  for (const spec of product.specs) {
    if (quickStats.length >= 4) break
    if (spec.basic && !seenNames.has(spec.name.trim()) && spec.value) {
      quickStats.push({ label: spec.name.replace(/:$/, '').trim(), value: spec.value, attr: spec.attr || undefined, unit: spec.unit || undefined })
      seenNames.add(spec.name.trim())
    }
  }

  // Pass 2: any spec with a short displayable value (≤ 14 chars total)
  for (const spec of product.specs) {
    if (quickStats.length >= 4) break
    const cleanName = spec.name.replace(/:$/, '').trim()
    const displayLen = spec.value.length + (spec.unit ? spec.unit.length + 1 : 0)
    if (!seenNames.has(spec.name.trim()) && spec.value && displayLen <= 14) {
      quickStats.push({ label: cleanName, value: spec.value, attr: spec.attr || undefined, unit: spec.unit || undefined })
      seenNames.add(spec.name.trim())
    }
  }

  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>

          {/* Left: text */}
          <div className={product.image ? styles.heroText : styles.heroTextFull}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <a href="/">Venting</a>
              <span aria-hidden="true">/</span>
                  <a href={categoryHrefFor(product.category)}>{product.categoryName}</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{product.name}</span>
            </nav>

            {/* Type eyebrow */}
            {product.type && <p className={styles.eyebrow}>{product.type}</p>}

            {/* Product name */}
            <h1 className={styles.title}>{product.name}</h1>

            {/* Model */}
            {product.model && (
              <p className={styles.model}>{product.model}</p>
            )}

            {/* Opis iz kataloga 2026 (kad ga API nema) */}
            {product.description && (
              <p className={styles.description}>{product.description}</p>
            )}

            {/* Subcategory + barcode meta row */}
            <div className={styles.metaRow}>
              {product.subcategoryName && (
                <span className={styles.metaTag}>{product.subcategoryName}</span>
              )}
              {product.barcode && (
                <span className={styles.metaBarcode}>EAN {product.barcode}</span>
              )}
            </div>

            {/* Quick stats */}
            {quickStats.length > 0 && (
              <div className={styles.quickStats}>
                {quickStats.map((stat, i) => (
                  <div key={i} className={styles.statItem}>
                    <span className={styles.statValue}>
                      {stat.value}
                      {stat.unit && <span className={styles.statUnit}> {stat.unit}</span>}
                    </span>
                    {stat.attr && <span className={styles.statAttr}>{stat.attr}</span>}
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className={styles.ctas}>
              <a href="/shop" className={styles.ctaSecondary}>
                ← {t.shop.allProducts}
              </a>
            </div>
          </div>

          {/* Right: image - hidden entirely when no image exists */}
          {product.image && (
            <div className={styles.heroImage}>
              <button type="button" className={`${styles.heroImageWrap} ${styles.zoomable}`} onClick={() => setZoomOpen(true)} aria-label="Uvećaj sliku">
                <Image src={product.image} alt={product.name} fill sizes="(max-width:768px) 100vw, 50vw" style={{ objectFit: 'contain' }} priority />
                <span className={styles.zoomIcon} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
                  </svg>
                </span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Tehničke specifikacije i dokumentacija */}
      {(Object.keys(specGroups).length > 0 || docs.length > 0) && (
        <Reveal><section className={styles.specs}>
          <div className={styles.specsInner}>
            {docs.length > 0 ? (
              <div className={styles.tabs} role="tablist">
                {Object.keys(specGroups).length > 0 && (
                  <button type="button" role="tab" aria-selected={tab === 'specs'}
                    className={`${styles.tabBtn} ${tab === 'specs' ? styles.tabBtnActive : ''}`}
                    onClick={() => setTab('specs')}>
                    Tehničke specifikacije
                  </button>
                )}
                <button type="button" role="tab" aria-selected={tab === 'docs' || Object.keys(specGroups).length === 0}
                  className={`${styles.tabBtn} ${tab === 'docs' || Object.keys(specGroups).length === 0 ? styles.tabBtnActive : ''}`}
                  onClick={() => setTab('docs')}>
                  Dokumentacija <span className={styles.tabCount}>{docs.length}</span>
                </button>
              </div>
            ) : (
              <h2 className={styles.specsHeading}>Tehničke specifikacije</h2>
            )}

            {/* Dokumentacija */}
            {docs.length > 0 && (tab === 'docs' || Object.keys(specGroups).length === 0) && (
              <ul className={styles.docList}>
                {docs.map((d) => (
                  <li key={d.file}>
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className={styles.docItem}>
                      <span className={styles.docIcon} aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" />
                        </svg>
                      </span>
                      <span className={styles.docText}>
                        <span className={styles.docTitle}>{d.title}</span>
                        <span className={styles.docMeta}>{d.type}</span>
                      </span>
                      <span className={styles.docAction}>
                        Otvori
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
                        </svg>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {/* Tehničke specifikacije */}
            {Object.keys(specGroups).length > 0 && (tab === 'specs' || docs.length === 0) && Object.entries(specGroups).map(([group, specs]) => (
              <div key={group} className={styles.specGroup}>
                {group !== 'Opšte' && (
                  <h3 className={styles.specGroupTitle}>{group.charAt(0).toUpperCase() + group.slice(1)}</h3>
                )}
                <table className={styles.specTable}>
                  <tbody>
                    {specs.map((spec, i) => (
                      <tr key={i} className={styles.specRow}>
                        <td className={styles.specName}>
                          {spec.name.replace(/:$/, '')}
                          {spec.attr && <span className={styles.specAttrLabel}> ({spec.attr})</span>}
                        </td>
                        <td className={styles.specValue}>
                          {spec.value}
                          {spec.unit && <span className={styles.specUnit}> {spec.unit}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section></Reveal>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <Reveal><section className={styles.related}>
          <div className={styles.relatedInner}>
            <h2 className={styles.relatedHeading}>Slični proizvodi</h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <a key={p.id} href={`/product/${p.id}`} className={styles.relatedCard}>
                  <div className={styles.relatedImageWrap}>
                    {p.image
                      ? <Image src={p.image} alt={p.name} fill sizes="200px" style={{ objectFit: 'contain' }} />
                      : (
                        <svg viewBox="0 0 80 60" fill="none" aria-hidden="true" style={{ width: 64, opacity: 0.3 }}>
                          <rect width="80" height="60" rx="6" fill="#e2e8ef"/>
                          <path d="M16 44L28 28l10 12 12-16 14 20" stroke="#b0bec9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="24" cy="22" r="5" fill="#b0bec9"/>
                        </svg>
                      )
                    }
                  </div>
                  <div className={styles.relatedInfo}>
                    <p className={styles.relatedName}>{p.name}</p>
                    <p className={styles.relatedCat}>{p.categoryName}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section></Reveal>
      )}


      {/* Uvećana slika proizvoda */}
      {zoomOpen && product.image && (
        <div className={styles.lightbox} onClick={() => setZoomOpen(false)} role="dialog" aria-modal="true" aria-label={product.name}>
          <button type="button" className={styles.lightboxClose} onClick={() => setZoomOpen(false)} aria-label="Zatvori">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
          <div className={styles.lightboxImage} onClick={(e) => e.stopPropagation()}>
            <Image src={product.image} alt={product.name} fill sizes="90vw" style={{ objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </div>
  )
}

// Link na kategoriju proizvoda (tab u prodavnici ili sopstvena stranica, npr. Flex Fit)
function categoryHrefFor(code: string): string {
  const tab = NAV_CATEGORY_MAP.findIndex((codes: string[]) => codes.includes(code))
  return tab >= 0 ? categoryHref(tab) : '/shop'
}
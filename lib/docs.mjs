// Dokumentacija proizvoda iz Pantheona.
// API /api/dokumentacija/ vraća jedan red po dokumentu jednog artikla:
//   acIdent - šifra artikla, acName - naziv dokumenta, acURL - naziv fajla (npr. HN0914_HU091.pdf)
// Fajlovi stoje na serveru čija je adresa u NEXT_PUBLIC_DOCS_BASE_URL.

import { DOC_FILES } from './dokumentacija-spisak.mjs'

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|bmp)$/i
/** Izjave o usaglašenosti (DoC) se ne prikazuju na sajtu. */
const DOC_NAME = /^doc(?=$|[\s_\-.:(])/i
function isDoC(title, file) {
  const stem = file.replace(/\.[^.]+$/, '')
  return DOC_NAME.test(title.trim()) || DOC_NAME.test(stem)
}

/** Samo naziv fajla, bez foldera (radi i za P:\...\fajl.pdf i za .../fajl.pdf). */
export function fileName(path) {
  return String(path ?? '').trim().split(/[\\/]/).pop() ?? ''
}

/** acIdent → [{ title, file }] za artikle sa sajta. Slike se preskaču, duplikati takođe. */
export function buildDocsMap(rows, ids) {
  const map = new Map()
  for (const r of rows ?? []) {
    if (!r || !ids.has(r.acIdent)) continue
    const file = fileName(r.acURL)
    if (!file || IMAGE_EXT.test(file)) continue
    const list = map.get(r.acIdent) ?? []
    if (list.some((d) => d.file.toLowerCase() === file.toLowerCase())) continue
    const title = String(r.acName ?? '').trim() || file.replace(/\.[^.]+$/, '')
    if (isDoC(title, file)) continue
    list.push({ title, file })
    map.set(r.acIdent, list)
  }
  return map
}

/** Javna adresa dokumenta ('' ako adresa servera nije podešena). */
export function docUrl(file) {
  const base = (process.env.NEXT_PUBLIC_DOCS_BASE_URL ?? '').replace(/\/+$/, '')
  return base ? `${base}/${encodeURIComponent(file)}` : ''
}

/** Oznaka tipa fajla za prikaz (PDF, DOCX, ZIP...). */
export function docType(file) {
  const m = String(file).match(/\.([a-z0-9]+)$/i)
  return m ? m[1].toUpperCase() : 'FAJL'
}

const AVAILABLE = new Set(DOC_FILES.map((f) => String(f).toLowerCase()))

/** Da li fajl stvarno postoji u public/dokumentacija (prikazuju se samo takvi). */
export function hasDoc(file) {
  return AVAILABLE.has(String(file).toLowerCase())
}
#!/usr/bin/env node
/**
 * Pregled VENTING vazdušnih zavesa u SteelSoft bazi (klasifikacija 08VNTZAV).
 * Samo čita i ispisuje - ništa ne menja na sajtu.
 *
 * Pokretanje:  node scripts/pregled-zavesa.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// .env.local (isti format kao za npm run sync)
try {
  const envRaw = await readFile(join(ROOT, '.env.local'), 'utf-8')
  for (const line of envRaw.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const key = t.slice(0, i).trim()
    let val = t.slice(i + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
    if (!process.env[key]) process.env[key] = val
  }
} catch { /* nema .env.local */ }

const BASE = process.env.STEELSOFT_BASE || 'http://mail.steelsoft.rs:51337'
const AUTH = Buffer.from(`${process.env.STEELSOFT_USER}:${process.env.STEELSOFT_PASS}`).toString('base64')

async function get(path) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`${BASE}${path}`, { headers: { Authorization: `Basic ${AUTH}` } })
    if (res.ok) return res.json()
    if (res.status < 500 || attempt === 4) throw new Error(`${path} -> HTTP ${res.status}`)
    await new Promise((r) => setTimeout(r, attempt * 15000))
  }
}

console.log('Preuzimam artikle...')
const all = await get('/api/identi/')

const isVenting = (p) => {
  const brand = (p.Brand ?? '').trim()
  return brand ? brand === 'VENTING' : /\bVENTING\b/i.test(p.acName ?? '')
}
const zavese = all.filter((p) => isVenting(p) && (p.acClassif ?? '').trim().startsWith('08VNTZAV'))

console.log(`\nVENTING vazdušne zavese u bazi: ${zavese.length}\n`)
const rows = zavese.map((p) => ({
  ident: p.acIdent,
  naziv: p.acName,
  model: p.Model ?? '',
  podgrupa: p.acCLassif2Name ?? '',
  zaWeb: p.acShowAtena ?? '',
  slika: p._acWebImage ?? '',
}))
for (const r of rows) {
  console.log(`${r.ident}  |  ${r.naziv}  |  model: ${r.model}  |  za web: ${r.zaWeb}  |  slika: ${r.slika}`)
}

await writeFile(join(ROOT, 'zavese-pregled.json'), JSON.stringify(rows, null, 2), 'utf-8')
console.log('\nSpisak je sačuvan u zavese-pregled.json (koren projekta).')
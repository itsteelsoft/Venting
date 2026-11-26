// Prijava na bilten: šalje mejl sa podacima prijavljenog na NEWSLETTER_TO.
// Podešavanje (Vercel → Settings → Environment Variables, i .env.local lokalno):
//   NEWSLETTER_TO  - adresa na koju stižu prijave
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS - podaci mejl servera za slanje
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: { name?: string; email?: string; website?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Neispravan zahtev.' }, { status: 400 })
  }

  // Zamka za botove: pravi korisnici ovo polje ne vide i ne popunjavaju.
  if (body.website) return NextResponse.json({ ok: true })

  const email = (body.email ?? '').trim()
  const name = (body.name ?? '').trim().slice(0, 100)
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: 'Unesite ispravnu e-mail adresu.' }, { status: 400 })
  }

  const { NEWSLETTER_TO, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!NEWSLETTER_TO || !SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('[newsletter] Nedostaju NEWSLETTER_TO / SMTP_* promenljive.')
    return NextResponse.json({ ok: false, error: 'Prijava trenutno nije dostupna. Pokušajte kasnije.' }, { status: 503 })
  }

  const port = Number(SMTP_PORT || 587)
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  try {
    await transporter.sendMail({
      from: `"Venting sajt" <${SMTP_USER}>`,
      to: NEWSLETTER_TO,
      replyTo: email,
      subject: `Nova prijava na bilten: ${email}`,
      text: `Nova prijava na bilten sa sajta.\n\nIme: ${name || '-'}\nE-mail: ${email}\nVreme: ${new Date().toLocaleString('sr-RS', { timeZone: 'Europe/Belgrade' })}`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[newsletter] Slanje nije uspelo:', err)
    return NextResponse.json({ ok: false, error: 'Slanje nije uspelo. Pokušajte ponovo.' }, { status: 500 })
  }
}
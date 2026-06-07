import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  container: { maxWidth: '680px', margin: '0 auto', padding: '4rem 2.5rem', flex: 1, width: '100%' },
  label: { fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '1.5rem' },
  title: { fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, lineHeight: 1.25, marginBottom: '2rem' },
  body: { fontSize: '17px', lineHeight: 2, color: '#333', marginBottom: '3rem' },
  divider: { borderTop: '0.5px solid var(--border)', margin: '2.5rem 0' },
  contactTitle: { fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 500, marginBottom: '1.25rem' },
  contactItem: { fontSize: '15px', color: 'var(--text-muted)', marginBottom: '0.5rem' },
  authorSection: { marginTop: '3rem', paddingTop: '2rem', borderTop: '0.5px solid var(--border)' },
  authorName: { fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 500, marginBottom: '0.25rem' },
  authorRole: { fontSize: '13px', color: 'var(--text-faint)', letterSpacing: '0.06em' },
}

export default function About() {
  const [brand, setBrand] = useState(null)

  useEffect(() => {
    supabase.from('brand').select('*').limit(1).single()
      .then(({ data }) => setBrand(data))
  }, [])

  return (
    <div style={s.page}>
      <Nav />
      <div style={s.container}>
        <div style={s.label}>About</div>
        <h1 style={s.title}>The Lemon Theory</h1>
        <p style={s.body}>{brand?.about || 'The Lemon Theory is a quiet digital journal for ideas that unsettle before they clarify. It explores psychology, identity, society, environmental grief, and the emotional cost of awareness.'}</p>
        <div style={s.divider} />
        <div style={s.contactTitle}>Get in touch</div>
        {brand?.instagram && <div style={s.contactItem}>Instagram — {brand.instagram}</div>}
        {brand?.phone && <div style={s.contactItem}>Phone — {brand.phone}</div>}
        <div style={s.authorSection}>
          <div style={s.authorName}>Yara Al Khateeb</div>
          <div style={s.authorRole}>FOUNDER &amp; WRITER</div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

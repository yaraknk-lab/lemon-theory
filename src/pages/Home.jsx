import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  hero: { padding: '4rem 2.5rem 3rem', borderBottom: '0.5px solid var(--border)', maxWidth: '720px' },
  heroTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: 500, lineHeight: 1.2, marginBottom: '1.2rem' },
  heroSub: { fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.9, maxWidth: '480px' },
  sectionLabel: { fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '1.5rem' },
  featured: { padding: '2.5rem 2.5rem', borderBottom: '0.5px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' },
  featuredCategory: { fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.75rem' },
  featuredTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 500, lineHeight: 1.25, marginBottom: '1rem' },
  featuredExcerpt: { fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: '1.5rem' },
  featuredMeta: { fontSize: '12px', color: 'var(--text-faint)', marginBottom: '1.5rem' },
  btn: { display: 'inline-block', fontSize: '12px', letterSpacing: '0.08em', padding: '0.6rem 1.4rem', border: '0.5px solid var(--text)', color: 'var(--text)', background: 'transparent', cursor: 'pointer' },
  accentBlock: { background: 'var(--accent)', padding: '1.75rem' },
  accentText: { fontFamily: 'var(--serif)', fontSize: '20px', fontStyle: 'italic', color: '#333', lineHeight: 1.6, marginBottom: '0.75rem' },
  accentTag: { fontSize: '11px', letterSpacing: '0.1em', color: 'var(--accent-dark)', textTransform: 'uppercase' },
  latest: { padding: '2.5rem 2.5rem', flex: 1 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginTop: '1.5rem' },
  card: { borderTop: '0.5px solid var(--border)', paddingTop: '1.2rem', cursor: 'pointer' },
  cardCat: { fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.5rem' },
  cardTitle: { fontFamily: 'var(--serif)', fontSize: '21px', fontWeight: 500, lineHeight: 1.3, marginBottom: '0.6rem' },
  cardExcerpt: { fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '0.75rem' },
  cardDate: { fontSize: '11px', color: 'var(--text-faint)' },
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function Home() {
  const [featured, setFeatured] = useState(null)
  const [articles, setArticles] = useState([])

  useEffect(() => {
    supabase.from('articles').select('*').eq('featured', true).limit(1).single()
      .then(({ data }) => setFeatured(data))
    supabase.from('articles').select('*').order('published_date', { ascending: false }).limit(6)
      .then(({ data }) => setArticles(data || []))
  }, [])

  return (
    <div style={s.page}>
      <Nav />
      <div style={s.hero}>
        <h1 style={s.heroTitle}>A calm place for the ideas that leave a sharp aftertaste.</h1>
        <p style={s.heroSub}>The kinds of truths that feel uncomfortable before they feel useful.</p>
      </div>

      {featured && (
        <div style={s.featured}>
          <div>
            <div style={s.sectionLabel}>Featured</div>
            <div style={s.featuredCategory}>{featured.category}</div>
            <h2 style={s.featuredTitle}>{featured.title}</h2>
            <p style={s.featuredExcerpt}>{featured.excerpt}</p>
            <div style={s.featuredMeta}>{formatDate(featured.published_date)}</div>
            <Link to={`/articles/${featured.id}`}>
              <div style={s.btn}>Read article</div>
            </Link>
          </div>
          <div style={s.accentBlock}>
            <div style={s.accentText}>"{featured.excerpt?.split('.')[0]}."</div>
            <div style={s.accentTag}>From the article</div>
          </div>
        </div>
      )}

      <div style={s.latest}>
        <div style={s.sectionLabel}>Latest articles</div>
        <div style={s.grid}>
          {articles.map(a => (
            <Link to={`/articles/${a.id}`} key={a.id}>
              <div style={s.card}>
                <div style={s.cardCat}>{a.category}</div>
                <div style={s.cardTitle}>{a.title}</div>
                <div style={s.cardExcerpt}>{a.excerpt}</div>
                <div style={s.cardDate}>{formatDate(a.published_date)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

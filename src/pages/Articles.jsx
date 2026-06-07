import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: { padding: '3rem 2.5rem 2rem', borderBottom: '0.5px solid var(--border)' },
  headerTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, marginBottom: '0.5rem' },
  headerSub: { fontSize: '14px', color: 'var(--text-muted)' },
  content: { padding: '2.5rem 2.5rem', flex: 1 },
  article: { display: 'grid', gridTemplateColumns: '140px 1fr', gap: '2rem', padding: '2rem 0', borderBottom: '0.5px solid var(--border)', alignItems: 'start', cursor: 'pointer' },
  articleLeft: { paddingTop: '4px' },
  articleCat: { fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.5rem' },
  articleDate: { fontSize: '12px', color: 'var(--text-faint)' },
  articleTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 500, lineHeight: 1.3, marginBottom: '0.75rem' },
  articleExcerpt: { fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.8 },
  empty: { padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--serif)', fontSize: '20px', fontStyle: 'italic' },
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('articles').select('*').order('published_date', { ascending: false })
      .then(({ data }) => { setArticles(data || []); setLoading(false) })
  }, [])

  return (
    <div style={s.page}>
      <Nav />
      <div style={s.header}>
        <h1 style={s.headerTitle}>All Articles</h1>
        <p style={s.headerSub}>Every piece, in order of publication.</p>
      </div>
      <div style={s.content}>
        {loading && <div style={s.empty}>Loading…</div>}
        {!loading && articles.length === 0 && <div style={s.empty}>No articles yet.</div>}
        {articles.map(a => (
          <Link to={`/articles/${a.id}`} key={a.id}>
            <div style={s.article}>
              <div style={s.articleLeft}>
                <div style={s.articleCat}>{a.category}</div>
                <div style={s.articleDate}>{formatDate(a.published_date)}</div>
              </div>
              <div>
                <div style={s.articleTitle}>{a.title}</div>
                <div style={s.articleExcerpt}>{a.excerpt}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  )
}

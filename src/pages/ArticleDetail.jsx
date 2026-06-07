import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  container: { maxWidth: '680px', margin: '0 auto', padding: '3rem 2.5rem', flex: 1, width: '100%' },
  back: { fontSize: '12px', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '3rem', display: 'inline-block' },
  category: { fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '1rem' },
  title: { fontFamily: 'var(--serif)', fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 500, lineHeight: 1.2, marginBottom: '1rem' },
  date: { fontSize: '13px', color: 'var(--text-faint)', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '0.5px solid var(--border)' },
  excerpt: { fontFamily: 'var(--serif)', fontSize: '20px', fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '0.5px solid var(--border)' },
  content: { fontSize: '17px', lineHeight: 2, color: '#222' },
  paragraph: { marginBottom: '1.75rem' },
  notFound: { textAlign: 'center', padding: '6rem 2.5rem', fontFamily: 'var(--serif)', fontSize: '22px', color: 'var(--text-muted)', fontStyle: 'italic' },
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('articles').select('*').eq('id', id).single()
      .then(({ data }) => { setArticle(data); setLoading(false) })
  }, [id])

  if (loading) return <div style={s.page}><Nav /><div style={s.notFound}>Loading…</div></div>
  if (!article) return <div style={s.page}><Nav /><div style={s.notFound}>Article not found.</div><Footer /></div>

  const paragraphs = (article.content || '').split('\n').filter(p => p.trim())

  return (
    <div style={s.page}>
      <Nav />
      <div style={s.container}>
        <Link to="/articles" style={s.back}>← All articles</Link>
        <div style={s.category}>{article.category}</div>
        <h1 style={s.title}>{article.title}</h1>
        <div style={s.date}>{formatDate(article.published_date)}</div>
        {article.excerpt && <p style={s.excerpt}>{article.excerpt}</p>}
        <div style={s.content}>
          {paragraphs.map((p, i) => (
            <p key={i} style={s.paragraph}>{p}</p>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

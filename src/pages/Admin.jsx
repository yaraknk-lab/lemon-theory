import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--sans)' },
  loginWrap: { maxWidth: '420px', margin: '0 auto', padding: '6rem 2rem', textAlign: 'center' },
  loginTitle: { fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 500, marginBottom: '0.5rem' },
  loginSub: { fontSize: '14px', color: 'var(--text-muted)', marginBottom: '2rem' },
  input: { width: '100%', padding: '0.75rem 1rem', border: '0.5px solid var(--border)', background: 'transparent', fontSize: '15px', fontFamily: 'var(--sans)', outline: 'none', marginBottom: '1rem' },
  btn: { width: '100%', padding: '0.75rem', border: '0.5px solid var(--text)', background: 'var(--text)', color: 'var(--bg)', fontSize: '13px', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'var(--sans)' },
  btnOutline: { padding: '0.5rem 1rem', border: '0.5px solid var(--border)', background: 'transparent', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--sans)', color: 'var(--text-muted)' },
  btnDanger: { padding: '0.5rem 1rem', border: '0.5px solid #e55', background: 'transparent', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--sans)', color: '#c33' },
  btnPrimary: { padding: '0.65rem 1.4rem', border: '0.5px solid var(--text)', background: 'var(--text)', color: 'var(--bg)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--sans)', letterSpacing: '0.06em' },
  dash: { display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' },
  sidebar: { borderRight: '0.5px solid var(--border)', padding: '2rem 1.5rem' },
  sidebarLogo: { fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 600, marginBottom: '2.5rem' },
  sidebarItem: { display: 'block', padding: '0.6rem 0.75rem', fontSize: '13px', cursor: 'pointer', borderRadius: '2px', marginBottom: '0.25rem' },
  main: { padding: '2.5rem 2.5rem' },
  sectionTitle: { fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 500, marginBottom: '2rem' },
  field: { marginBottom: '1.25rem' },
  label: { display: 'block', fontSize: '12px', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' },
  fieldInput: { width: '100%', padding: '0.65rem 0.9rem', border: '0.5px solid var(--border)', background: 'transparent', fontSize: '14px', fontFamily: 'var(--sans)', outline: 'none' },
  textarea: { width: '100%', padding: '0.65rem 0.9rem', border: '0.5px solid var(--border)', background: 'transparent', fontSize: '14px', fontFamily: 'var(--sans)', outline: 'none', resize: 'vertical', minHeight: '120px' },
  contentArea: { width: '100%', padding: '0.65rem 0.9rem', border: '0.5px solid var(--border)', background: 'transparent', fontSize: '14px', fontFamily: 'var(--sans)', outline: 'none', resize: 'vertical', minHeight: '280px' },
  checkRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', marginBottom: '1.5rem' },
  articleRow: { display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '0.5px solid var(--border)' },
  articleRowTitle: { fontFamily: 'var(--serif)', fontSize: '18px' },
  articleRowMeta: { fontSize: '12px', color: 'var(--text-faint)' },
  msg: { padding: '0.75rem 1rem', background: 'var(--accent)', fontSize: '13px', marginBottom: '1.5rem' },
  error: { padding: '0.75rem 1rem', background: '#fee', fontSize: '13px', marginBottom: '1.5rem', color: '#c33' },
}

const TABS = ['Add Article', 'Manage Articles', 'Edit About']

export default function Admin() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState('Add Article')
  const [articles, setArticles] = useState([])
  const [brand, setBrand] = useState(null)
  const [msg, setMsg] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: '', published_date: '', featured: false })
  const [aboutForm, setAboutForm] = useState({ about: '', instagram: '', phone: '' })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    supabase.auth.onAuthStateChange((_e, s) => setSession(s))
  }, [])

  useEffect(() => {
    if (session) {
      fetchArticles()
      supabase.from('brand').select('*').limit(1).single().then(({ data }) => {
        if (data) { setBrand(data); setAboutForm({ about: data.about || '', instagram: data.instagram || '', phone: data.phone || '' }) }
      })
    }
  }, [session])

  const fetchArticles = () => {
    supabase.from('articles').select('*').order('published_date', { ascending: false }).then(({ data }) => setArticles(data || []))
  }

  const signIn = async () => {
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Incorrect email or password.')
  }

  const signOut = () => supabase.auth.signOut()
  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }
  const resetForm = () => { setForm({ title: '', excerpt: '', content: '', category: '', published_date: '', featured: false }); setEditingId(null) }

  const saveArticle = async () => {
    if (!form.title) return
    if (editingId) {
      await supabase.from('articles').update(form).eq('id', editingId)
      showMsg('Article updated.')
    } else {
      await supabase.from('articles').insert([form])
      showMsg('Article published.')
    }
    resetForm()
    fetchArticles()
    setTab('Manage Articles')
  }

  const editArticle = (a) => {
    setForm({ title: a.title, excerpt: a.excerpt || '', content: a.content || '', category: a.category || '', published_date: a.published_date || '', featured: a.featured || false })
    setEditingId(a.id)
    setTab('Add Article')
  }

  const deleteArticle = async (id) => {
    if (!confirm('Delete this article?')) return
    await supabase.from('articles').delete().eq('id', id)
    fetchArticles()
    showMsg('Article deleted.')
  }

  const saveAbout = async () => {
    if (brand?.id) {
      await supabase.from('brand').update(aboutForm).eq('id', brand.id)
      showMsg('About page updated.')
    }
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>

  if (!session) return (
    <div style={s.page}>
      <div style={s.loginWrap}>
        <div style={s.loginTitle}>Admin Login</div>
        <div style={s.loginSub}>Sign in to manage The Lemon Theory.</div>
        {error && <div style={s.error}>{error}</div>}
        <input style={s.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={s.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && signIn()} />
        <button style={s.btn} onClick={signIn}>Sign in</button>
      </div>
    </div>
  )

  return (
    <div style={s.page}>
      <div style={s.dash}>
        <div style={s.sidebar}>
          <div style={s.sidebarLogo}>The Lemon Theory</div>
          {TABS.map(t => (
            <div key={t} style={{ ...s.sidebarItem, background: tab === t ? 'var(--accent)' : 'transparent', fontWeight: tab === t ? 500 : 400 }} onClick={() => { setTab(t); resetForm() }}>
              {t}
            </div>
          ))}
          <div style={{ marginTop: '3rem' }}>
            <button style={s.btnOutline} onClick={signOut}>Sign out</button>
          </div>
        </div>
        <div style={s.main}>
          {msg && <div style={s.msg}>{msg}</div>}
          {tab === 'Add Article' && (
            <div>
              <div style={s.sectionTitle}>{editingId ? 'Edit Article' : 'New Article'}</div>
              {editingId && <button style={{ ...s.btnOutline, marginBottom: '1.5rem' }} onClick={resetForm}>← Cancel edit</button>}
              <div style={s.field}><label style={s.label}>Title</label><input style={s.fieldInput} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div style={s.field}><label style={s.label}>Category</label><input style={s.fieldInput} placeholder="e.g. Psychology, Identity, Society…" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
              <div style={s.field}><label style={s.label}>Excerpt</label><textarea style={s.textarea} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></div>
              <div style={s.field}><label style={s.label}>Content</label><textarea style={s.contentArea} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
              <div style={s.field}><label style={s.label}>Publication date</label><input type="date" style={s.fieldInput} value={form.published_date} onChange={e => setForm({ ...form, published_date: e.target.value })} /></div>
              <div style={s.checkRow}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                <label htmlFor="featured">Mark as featured article</label>
              </div>
              <button style={s.btnPrimary} onClick={saveArticle}>{editingId ? 'Save changes' : 'Publish article'}</button>
            </div>
          )}
          {tab === 'Manage Articles' && (
            <div>
              <div style={s.sectionTitle}>All Articles</div>
              {articles.length === 0 && <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No articles yet.</div>}
              {articles.map(a => (
                <div key={a.id} style={s.articleRow}>
                  <div>
                    <div style={s.articleRowTitle}>{a.title}</div>
                    <div style={s.articleRowMeta}>{a.category} · {a.published_date}{a.featured ? ' · Featured' : ''}</div>
                  </div>
                  <button style={s.btnOutline} onClick={() => editArticle(a)}>Edit</button>
                  <button style={s.btnDanger} onClick={() => deleteArticle(a.id)}>Delete</button>
                </div>
              ))}
            </div>
          )}
          {tab === 'Edit About' && (
            <div>
              <div style={s.sectionTitle}>About Page</div>
              <div style={s.field}><label style={s.label}>About text</label><textarea style={{ ...s.contentArea, minHeight: '180px' }} value={aboutForm.about} onChange={e => setAboutForm({ ...aboutForm, about: e.target.value })} /></div>
              <div style={s.field}><label style={s.label}>Instagram handle</label><input style={s.fieldInput} placeholder="@thelemontheory" value={aboutForm.instagram} onChange={e => setAboutForm({ ...aboutForm, instagram: e.target.value })} /></div>
              <div style={s.field}><label style={s.label}>Phone number</label><input style={s.fieldInput} value={aboutForm.phone} onChange={e => setAboutForm({ ...aboutForm, phone: e.target.value })} /></div>
              <button style={s.btnPrimary} onClick={saveAbout}>Save changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

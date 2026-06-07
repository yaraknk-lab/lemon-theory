import { Link, useLocation } from 'react-router-dom'

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2.5rem',
    borderBottom: '0.5px solid var(--border)',
    position: 'sticky',
    top: 0,
    background: 'var(--bg)',
    zIndex: 100,
  },
  logo: {
    fontFamily: 'var(--serif)',
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: 'var(--text)',
  },
  links: {
    display: 'flex',
    gap: '2rem',
    fontSize: '13px',
    letterSpacing: '0.04em',
    color: 'var(--text-muted)',
  },
}

export default function Nav() {
  const location = useLocation()
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>The Lemon Theory</Link>
      <div style={styles.links}>
        <Link to="/" style={{ color: location.pathname === '/' ? 'var(--text)' : 'var(--text-muted)' }}>Home</Link>
        <Link to="/articles" style={{ color: location.pathname === '/articles' ? 'var(--text)' : 'var(--text-muted)' }}>Articles</Link>
        <Link to="/about" style={{ color: location.pathname === '/about' ? 'var(--text)' : 'var(--text-muted)' }}>About</Link>
      </div>
    </nav>
  )
}

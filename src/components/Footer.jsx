const styles = {
  footer: {
    padding: '2rem 2.5rem',
    borderTop: '0.5px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4rem',
  },
  name: {
    fontFamily: 'var(--serif)',
    fontSize: '15px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  copy: {
    fontSize: '12px',
    color: 'var(--text-faint)',
  },
}

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.name}>Yara Al Khateeb — Founder &amp; Writer</div>
      <div style={styles.copy}>© {new Date().getFullYear()} The Lemon Theory</div>
    </footer>
  )
}

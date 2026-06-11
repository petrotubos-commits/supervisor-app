export function Header() {
  const version = '1.0.0'
  const fecha = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header style={{ backgroundColor: '#f3f4f6', padding: '30px 16px' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="text-white shadow-lg" style={{ backgroundColor: '#5C9E2E', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>VYSA ENTERPRISES LLC</h1>
          <div style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>
            <p style={{ margin: '2px 0' }}>v{version}</p>
            <p style={{ margin: '2px 0' }}>{fecha}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

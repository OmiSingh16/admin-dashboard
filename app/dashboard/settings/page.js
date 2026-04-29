'use client';

export default function SettingsPage() {
  return (
    <>
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        textAlign: 'center',
        border: '1px solid #eef3fc',
        marginTop: '24px'
      }}>
        <i className="fas fa-sliders-h" style={{ fontSize: '64px', color: '#cbd5e1', marginBottom: '20px' }}></i>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#64748b', marginBottom: '10px' }}>Settings</h3>
        <p style={{ color: '#94a3b8' }}>Coming soon...</p>
      </div>
    </>
  );
}
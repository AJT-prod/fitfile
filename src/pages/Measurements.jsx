import { useNavigate } from 'react-router-dom'

export default function Measurements() {
  const navigate = useNavigate()

  const measurements = [
    { label: 'Chest', in: '40"', cm: '101.6 cm' },
    { label: 'Waist', in: '31"', cm: '78.7 cm' },
    { label: 'Hips', in: '41"', cm: '104.1 cm' },
    { label: 'Inseam', in: '30"', cm: '76.2 cm' },
    { label: 'Shoulder', in: '18"', cm: '45.7 cm' },
    { label: 'Sleeve', in: '25"', cm: '63.5 cm' },
    { label: 'Neck', in: '15"', cm: '38.1 cm' },
    { label: 'Thigh', in: '24"', cm: '61 cm' },
    { label: 'Height', in: '5\'10"', cm: '177.8 cm' },
  ]

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', fontSize: 14, color: '#888780', marginBottom: '1.5rem', padding: 0 }}
      >
        ← Back
      </button>

      <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: '0.25rem' }}>Body measurements</h2>
      <p style={{ fontSize: 13, color: '#888780', marginBottom: '1.5rem' }}>Your measurements in both units.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {measurements.map((item) => (
          <div
            key={item.label}
            style={{
              background: '#ffffff',
              border: '0.5px solid #D3D1C7',
              borderRadius: 12,
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 500 }}>{item.in}</p>
              <p style={{ fontSize: 13, color: '#888780' }}>{item.cm}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        style={{
          marginTop: '1.5rem',
          width: '100%',
          padding: '0.85rem',
          background: '#378ADD',
          color: '#ffffff',
          border: 'none',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        Edit measurements
      </button>
    </div>
  )
}
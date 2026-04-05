import { useNavigate } from 'react-router-dom'

export default function CoreSizes() {
  const navigate = useNavigate()

  const sizes = [
    { label: 'Tops', value: 'M' },
    { label: 'Bottoms', value: 'M' },
    { label: 'Outerwear', value: 'L' },
    { label: 'Jeans / Pants', value: '31 x 30' },
    { label: 'Dresses', value: '10' },
    { label: 'Shoes / Sneakers', value: '10.5' },
    { label: 'Bra', value: '34B' },
  ]

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', fontSize: 14, color: '#888780', marginBottom: '1.5rem', padding: 0 }}
      >
        ← Back
      </button>

      <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: '0.25rem' }}>Core sizes</h2>
      <p style={{ fontSize: 13, color: '#888780', marginBottom: '1.5rem' }}>Your general defaults, not store-specific.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sizes.map((item) => (
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
            <p style={{ fontSize: 22, fontWeight: 500 }}>{item.value}</p>
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
        Edit core sizes
      </button>
    </div>
  )
}
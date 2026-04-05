import { useNavigate } from 'react-router-dom'

export default function StoreList() {
  const navigate = useNavigate()

  const stores = [
    { id: '1', name: 'Uniqlo', preview: 'Tops · L  |  Bottoms · M' },
    { id: '2', name: "Levi's", preview: 'Jeans · 31x30' },
    { id: '3', name: 'ASOS', preview: 'Tops · M  |  Shoes · 10.5' },
  ]

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', fontSize: 14, color: '#888780', marginBottom: '1.5rem', padding: 0 }}
      >
        ← Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: '0.25rem' }}>My stores</h2>
          <p style={{ fontSize: 13, color: '#888780' }}>Your sizes, by store.</p>
        </div>
        <button
          onClick={() => navigate('/stores/new')}
          style={{
            background: '#378ADD',
            color: '#ffffff',
            border: 'none',
            borderRadius: 10,
            padding: '0.5rem 1rem',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          + Add store
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => navigate(`/stores/${store.id}`)}
            style={{
              background: '#ffffff',
              border: '0.5px solid #D3D1C7',
              borderRadius: 12,
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{store.name}</p>
              <p style={{ fontSize: 13, color: '#888780' }}>{store.preview}</p>
            </div>
            <span style={{ fontSize: 20, color: '#D3D1C7' }}>›</span>
          </div>
        ))}
      </div>
    </div>
  )
}
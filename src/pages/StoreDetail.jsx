import { useNavigate } from 'react-router-dom'

export default function StoreDetail() {
  const navigate = useNavigate()

  const store = {
    name: 'Uniqlo',
    notes: 'Sizes run small — go up one from usual.',
    sizes: [
      { category: 'Tops', value: 'L' },
      { category: 'Bottoms', value: 'M' },
      { category: 'Outerwear', value: 'L' },
    ],
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate('/stores')}
        style={{ background: 'none', border: 'none', fontSize: 14, color: '#888780', marginBottom: '1.5rem', padding: 0 }}
      >
        ← Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <h2 style={{ fontSize: 24, fontWeight: 500 }}>{store.name}</h2>
        <button
          onClick={() => navigate('/stores/1/edit')}
          style={{ background: 'none', border: '0.5px solid #D3D1C7', borderRadius: 8, padding: '0.4rem 0.85rem', fontSize: 13, color: '#5F5E5A' }}
        >
          Edit
        </button>
      </div>

      {store.notes && (
        <div style={{ background: '#FAEEDA', border: '0.5px solid #FAC775', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', marginTop: '0.75rem' }}>
          <p style={{ fontSize: 13, color: '#854F0B' }}>{store.notes}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {store.sizes.map((item) => (
          <div
            key={item.category}
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
            <p style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.category}</p>
            <p style={{ fontSize: 22, fontWeight: 500 }}>{item.value}</p>
          </div>
        ))}
      </div>

      <button
        style={{
          marginTop: '1.5rem',
          width: '100%',
          padding: '0.85rem',
          background: '#EAF3DE',
          color: '#3B6D11',
          border: '0.5px solid #C0DD97',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        + Add size category
      </button>
    </div>
  )
}
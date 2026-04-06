import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStoreById, deleteStore } from '../storage'

export default function StoreDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [store, setStore] = useState(null)

 useEffect(() => {
  const found = getStoreById(id)
  if (!found) navigate('/stores')
  else {
    setStore(found)
    document.title = `FitFile · ${found.name}`
  }
}, [id])

  function handleDelete() {
    if (confirm(`Remove ${store.name} from your stores?`)) {
      deleteStore(id)
      navigate('/stores')
    }
  }

  if (!store) return null

  const standardSizes = Object.entries(store.sizes || {}).filter(([k]) => k !== 'custom')
  const customSizes = store.sizes?.custom || []

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
          onClick={() => navigate(`/stores/${id}/edit`)}
          style={{ background: 'none', border: '0.5px solid #D3D1C7', borderRadius: 8, padding: '0.4rem 0.85rem', fontSize: 13, color: '#5F5E5A' }}
        >
          Edit
        </button>
      </div>

      {store.notes ? (
        <div style={{ background: '#FAEEDA', border: '0.5px solid #FAC775', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', marginTop: '0.75rem' }}>
          <p style={{ fontSize: 13, color: '#854F0B' }}>{store.notes}</p>
        </div>
      ) : (
        <div style={{ marginBottom: '1.5rem' }} />
      )}

      {standardSizes.length === 0 && customSizes.length === 0 ? (
        <div style={{
          background: '#ffffff',
          border: '0.5px solid #D3D1C7',
          borderRadius: 12,
          padding: '2rem 1.25rem',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          <p style={{ fontSize: 14, color: '#888780' }}>No sizes added yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
          {standardSizes.map(([category, value]) => (
            <div
              key={category}
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
              <p style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{category}</p>
              <p style={{ fontSize: 22, fontWeight: 500 }}>{value}</p>
            </div>
          ))}
          {customSizes.map((item, i) => (
            <div
              key={i}
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
      )}

      <button
        onClick={() => navigate(`/stores/${id}/edit`)}
        style={{
          marginTop: '1rem',
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

      <button
        onClick={handleDelete}
        style={{
          marginTop: '0.75rem',
          width: '100%',
          padding: '0.85rem',
          background: 'transparent',
          color: '#888780',
          border: '0.5px solid #D3D1C7',
          borderRadius: 12,
          fontSize: 14,
        }}
      >
        Remove store
      </button>
    </div>
  )
}
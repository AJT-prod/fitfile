import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStores } from '../storage'

export default function StoreList() {
  const navigate = useNavigate()
  const [stores, setStores] = useState([])

useEffect(() => {
  setStores(getStores())
  document.title = 'FitFile · My Stores'
}, [])
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

      {stores.length === 0 ? (
        <div style={{
          background: '#ffffff',
          border: '0.5px solid #D3D1C7',
          borderRadius: 12,
          padding: '2rem 1.25rem',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 16, color: '#888780', marginBottom: 4 }}>No stores yet.</p>
          <p style={{ fontSize: 13, color: '#B4B2A9' }}>Add a store to start tracking your sizes.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stores.map((store) => {
            const sizeEntries = Object.entries(store.sizes || {})
              .filter(([k]) => k !== 'custom')
              .slice(0, 3)
              .map(([k, v]) => `${k} · ${v}`)
              .join('  |  ')

            return (
              <div
                key={store.id}
                className="summary-card"
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
                  boxShadow: '0 1px 2px rgba(44, 44, 42, 0.04), 0 4px 14px rgba(44, 44, 42, 0.04)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <div>
                  <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{store.name}</p>
                  <p style={{ fontSize: 13, color: '#888780' }}>{sizeEntries || 'No sizes added yet'}</p>
                </div>
                <span style={{ fontSize: 22, color: '#378ADD', fontWeight: 500 }}>›</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
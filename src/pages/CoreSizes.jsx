import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCoreSizes, saveCoreSizes } from '../storage'

const FIELDS = [
  { key: 'tops', label: 'Tops' },
  { key: 'bottoms', label: 'Bottoms' },
  { key: 'outerwear', label: 'Outerwear' },
  { key: 'jeans', label: 'Jeans / Pants' },
  { key: 'dresses', label: 'Dresses' },
  { key: 'shoes', label: 'Shoes / Sneakers' },
  { key: 'bra', label: 'Bra' },
  { key: 'underwear', label: 'Underwear / Briefs' },
  { key: 'socks', label: 'Socks' },
]

export default function CoreSizes() {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [sizes, setSizes] = useState(getCoreSizes())

  function handleChange(key, value) {
    setSizes(prev => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    saveCoreSizes(sizes)
    setEditing(false)
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', fontSize: 14, color: '#888780', marginBottom: '1.5rem', padding: 0 }}
      >
        ← Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <h2 style={{ fontSize: 24, fontWeight: 500 }}>Core sizes</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{ background: 'none', border: '0.5px solid #D3D1C7', borderRadius: 8, padding: '0.4rem 0.85rem', fontSize: 13, color: '#5F5E5A' }}
          >
            Edit
          </button>
        )}
      </div>
      <p style={{ fontSize: 13, color: '#888780', marginBottom: '1.5rem' }}>Your general defaults, not store-specific.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FIELDS.map(({ key, label }) => (
          <div
            key={key}
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
            <p style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
            {editing ? (
              <input
                value={sizes[key] || ''}
                onChange={e => handleChange(key, e.target.value)}
                placeholder="—"
                style={{
                  width: 100,
                  textAlign: 'right',
                  border: 'none',
                  borderBottom: '1px solid #D3D1C7',
                  fontSize: 18,
                  fontWeight: 500,
                  background: 'transparent',
                  outline: 'none',
                  color: '#2C2C2A',
                }}
              />
            ) : (
              <p style={{ fontSize: 22, fontWeight: 500, color: sizes[key] ? '#2C2C2A' : '#D3D1C7' }}>
                {sizes[key] || '—'}
              </p>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ display: 'flex', gap: 8, marginTop: '1.5rem' }}>
          <button
            onClick={() => { setSizes(getCoreSizes()); setEditing(false) }}
            style={{
              flex: 1,
              padding: '0.85rem',
              background: 'transparent',
              color: '#5F5E5A',
              border: '0.5px solid #D3D1C7',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 2,
              padding: '0.85rem',
              background: '#378ADD',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  )
}
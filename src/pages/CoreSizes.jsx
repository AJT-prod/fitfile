import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCoreSizes, saveCoreSizes, saveLastUpdated } from '../storage'

const FIELDS = [
  { key: 'tops', label: 'Tops', placeholder: 'e.g. M' },
  { key: 'bottoms', label: 'Bottoms', placeholder: 'e.g. M' },
  { key: 'outerwear', label: 'Outerwear', placeholder: 'e.g. L' },
  { key: 'jeans', label: 'Jeans / Pants', placeholder: 'e.g. 31x30' },
  { key: 'dresses', label: 'Dresses', placeholder: 'e.g. 10' },
  { key: 'shoes', label: 'Shoes / Sneakers', placeholder: 'e.g. 10.5' },
  { key: 'bra', label: 'Bra', placeholder: 'e.g. 34B' },
  { key: 'underwear', label: 'Underwear / Briefs', placeholder: 'e.g. M' },
  { key: 'socks', label: 'Socks', placeholder: 'e.g. 10-13' },
]

export default function CoreSizes() {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [sizes, setSizes] = useState(getCoreSizes())
useEffect(() => {
  document.title = 'FitFile · Core Sizes'
}, [])
  function handleChange(key, value) {
    setSizes(prev => ({ ...prev, [key]: value }))
  }

  function handleSave() {
  const previous = getCoreSizes()
  saveCoreSizes(sizes)
  const lastChanged = FIELDS.filter(f => sizes[f.key] !== previous[f.key] && sizes[f.key]).pop()
  const fallback = FIELDS.filter(f => sizes[f.key]).pop()
  const target = lastChanged || fallback
  if (target) saveLastUpdated('coreSizes', target.label, sizes[target.key])
  setEditing(false)
}


  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
  onClick={() => {
    if (editing) {
      if (confirm('You have unsaved changes. Leave without saving?')) {
        navigate('/')
      }
    } else {
      navigate('/')
    }
  }}
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
        {FIELDS.map(({ key, label, placeholder }) => (
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
              boxShadow: '0 1px 2px rgba(44, 44, 42, 0.04), 0 4px 14px rgba(44, 44, 42, 0.04)',
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
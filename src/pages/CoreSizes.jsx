import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCoreSizes, saveCoreSizes, saveLastUpdated } from '../storage'
import { SHOE_SYSTEMS, findShoeRow, findBraBand, findBraCup } from '../utils/conversions'

const FIELDS = [
  { key: 'tops', label: 'Tops', placeholder: 'e.g. M' },
  { key: 'bottoms', label: 'Bottoms', placeholder: 'e.g. M' },
  { key: 'outerwear', label: 'Outerwear', placeholder: 'e.g. L' },
  { key: 'jeans', label: 'Jeans / Pants', type: 'jeans' },
  { key: 'dresses', label: 'Dresses', placeholder: 'e.g. 10' },
  { key: 'shoes', label: 'Shoes / Sneakers', type: 'shoes' },
  { key: 'bra', label: 'Bra', type: 'bra' },
  { key: 'underwear', label: 'Underwear / Briefs', placeholder: 'e.g. M' },
  { key: 'socks', label: 'Socks', placeholder: 'e.g. 10-13' },
]

function isFilled(field, value) {
  if (field.type === 'jeans') return !!(value?.waist || value?.inseam)
  if (field.type === 'shoes') return !!value?.size
  if (field.type === 'bra') return !!(value?.band || value?.cup)
  return !!value
}

function formatValue(field, value) {
  if (field.type === 'jeans') return `${value?.waist || '—'} × ${value?.inseam || '—'}`
  if (field.type === 'shoes') return value?.size || ''
  if (field.type === 'bra') return `${value?.band || ''}${value?.cup || ''}`
  return value
}

function valuesEqual(field, a, b) {
  if (field.type === 'jeans') return (a?.waist || '') === (b?.waist || '') && (a?.inseam || '') === (b?.inseam || '')
  if (field.type === 'shoes') return (a?.size || '') === (b?.size || '') && (a?.system || '') === (b?.system || '')
  if (field.type === 'bra') return (a?.band || '') === (b?.band || '') && (a?.cup || '') === (b?.cup || '')
  return a === b
}

function shoeConversions(shoes) {
  const row = findShoeRow(shoes?.system, shoes?.size)
  if (!row) return null
  return SHOE_SYSTEMS.filter(s => s.key !== shoes.system).map(s => `${s.label} ${row[s.key]}`).join(' · ')
}

function braConversions(bra) {
  const bandRow = findBraBand(bra?.band)
  const cupRow = findBraCup(bra?.cup)
  if (!bandRow && !cupRow) return null
  const ukBand = bandRow?.usUk ?? bra.band ?? ''
  const ukCup = cupRow?.uk ?? bra.cup ?? ''
  const euBand = bandRow?.eu ?? ''
  const euCup = cupRow?.eu ?? ''
  const parts = []
  if (ukBand || ukCup) parts.push(`UK ${ukBand}${ukCup}`)
  if (euBand || euCup) parts.push(`EU ${euBand}${euCup}`)
  return parts.length ? parts.join(' · ') : null
}

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

  function handleSubfieldChange(key, subfield, value) {
    setSizes(prev => ({ ...prev, [key]: { ...prev[key], [subfield]: value } }))
  }

  function handleSave() {
  const previous = getCoreSizes()
  saveCoreSizes(sizes)
  const lastChanged = FIELDS.filter(f => !valuesEqual(f, sizes[f.key], previous[f.key]) && isFilled(f, sizes[f.key])).pop()
  const fallback = FIELDS.filter(f => isFilled(f, sizes[f.key])).pop()
  const target = lastChanged || fallback
  if (target) saveLastUpdated('coreSizes', target.label, formatValue(target, sizes[target.key]))
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
        {FIELDS.map((field) => {
          const { key, label, placeholder, type } = field

          if (type === 'jeans') {
            const jeans = sizes.jeans || { waist: '', inseam: '' }
            return (
              <div
                key={key}
                style={{
                  background: '#ffffff',
                  border: '0.5px solid #D3D1C7',
                  borderRadius: 12,
                  padding: '1rem 1.25rem',
                  boxShadow: '0 1px 2px rgba(44, 44, 42, 0.04), 0 4px 14px rgba(44, 44, 42, 0.04)',
                }}
              >
                <p style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: editing ? 8 : 0 }}>{label}</p>
                {editing ? (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        value={jeans.waist || ''}
                        onChange={e => handleSubfieldChange('jeans', 'waist', e.target.value)}
                        placeholder="e.g. 31"
                        style={{
                          width: '100%',
                          border: 'none',
                          borderBottom: '1px solid #D3D1C7',
                          fontSize: 16,
                          fontWeight: 500,
                          background: 'transparent',
                          outline: 'none',
                          color: '#2C2C2A',
                          paddingBottom: 2,
                        }}
                      />
                      <p style={{ fontSize: 11, color: '#888780', marginTop: 3 }}>waist</p>
                    </div>
                    <div style={{ color: '#D3D1C7', fontSize: 16 }}>×</div>
                    <div style={{ flex: 1 }}>
                      <input
                        value={jeans.inseam || ''}
                        onChange={e => handleSubfieldChange('jeans', 'inseam', e.target.value)}
                        placeholder="e.g. 30"
                        style={{
                          width: '100%',
                          border: 'none',
                          borderBottom: '1px solid #D3D1C7',
                          fontSize: 16,
                          fontWeight: 500,
                          background: 'transparent',
                          outline: 'none',
                          color: '#2C2C2A',
                          paddingBottom: 2,
                        }}
                      />
                      <p style={{ fontSize: 11, color: '#888780', marginTop: 3 }}>inseam</p>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: 22, fontWeight: 500, color: isFilled(field, jeans) ? '#2C2C2A' : '#D3D1C7' }}>
                    {isFilled(field, jeans) ? formatValue(field, jeans) : '—'}
                  </p>
                )}
              </div>
            )
          }

          if (type === 'shoes') {
            const shoes = sizes.shoes || { size: '', system: '' }
            const conversions = shoeConversions(shoes)
            return (
              <div
                key={key}
                style={{
                  background: '#ffffff',
                  border: '0.5px solid #D3D1C7',
                  borderRadius: 12,
                  padding: '1rem 1.25rem',
                  boxShadow: '0 1px 2px rgba(44, 44, 42, 0.04), 0 4px 14px rgba(44, 44, 42, 0.04)',
                }}
              >
                <p style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: editing ? 8 : 0 }}>{label}</p>
                {editing ? (
                  <>
                    <input
                      value={shoes.size || ''}
                      onChange={e => handleSubfieldChange('shoes', 'size', e.target.value)}
                      placeholder="e.g. 9.5"
                      style={{
                        width: '100%',
                        border: 'none',
                        borderBottom: '1px solid #D3D1C7',
                        fontSize: 16,
                        fontWeight: 500,
                        background: 'transparent',
                        outline: 'none',
                        color: '#2C2C2A',
                        paddingBottom: 2,
                        marginBottom: 10,
                      }}
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                      {SHOE_SYSTEMS.map(s => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => handleSubfieldChange('shoes', 'system', s.key === shoes.system ? '' : s.key)}
                          style={{
                            padding: '0.3rem 0.65rem',
                            fontSize: 12,
                            borderRadius: 8,
                            border: s.key === shoes.system ? '0.5px solid #378ADD' : '0.5px solid #D3D1C7',
                            background: s.key === shoes.system ? '#E6F1FB' : 'transparent',
                            color: s.key === shoes.system ? '#185FA5' : '#5F5E5A',
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    {shoes.size && !shoes.system && (
                      <p style={{ fontSize: 11, color: '#888780', marginTop: 6 }}>Pick a system to see conversions.</p>
                    )}
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 22, fontWeight: 500, color: isFilled(field, shoes) ? '#2C2C2A' : '#D3D1C7' }}>
                      {isFilled(field, shoes) ? formatValue(field, shoes) : '—'}
                      {shoes.system && (
                        <span style={{ fontSize: 13, fontWeight: 400, color: '#888780', marginLeft: 6 }}>
                          {SHOE_SYSTEMS.find(s => s.key === shoes.system)?.label}
                        </span>
                      )}
                    </p>
                    {conversions && <p style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>{conversions}</p>}
                  </>
                )}
              </div>
            )
          }

          if (type === 'bra') {
            const bra = sizes.bra || { band: '', cup: '' }
            const conversions = braConversions(bra)
            return (
              <div
                key={key}
                style={{
                  background: '#ffffff',
                  border: '0.5px solid #D3D1C7',
                  borderRadius: 12,
                  padding: '1rem 1.25rem',
                  boxShadow: '0 1px 2px rgba(44, 44, 42, 0.04), 0 4px 14px rgba(44, 44, 42, 0.04)',
                }}
              >
                <p style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: editing ? 8 : 0 }}>{label}</p>
                {editing ? (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        value={bra.band || ''}
                        onChange={e => handleSubfieldChange('bra', 'band', e.target.value)}
                        placeholder="e.g. 34"
                        style={{
                          width: '100%',
                          border: 'none',
                          borderBottom: '1px solid #D3D1C7',
                          fontSize: 16,
                          fontWeight: 500,
                          background: 'transparent',
                          outline: 'none',
                          color: '#2C2C2A',
                          paddingBottom: 2,
                        }}
                      />
                      <p style={{ fontSize: 11, color: '#888780', marginTop: 3 }}>band</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        value={bra.cup || ''}
                        onChange={e => handleSubfieldChange('bra', 'cup', e.target.value)}
                        placeholder="e.g. B"
                        style={{
                          width: '100%',
                          border: 'none',
                          borderBottom: '1px solid #D3D1C7',
                          fontSize: 16,
                          fontWeight: 500,
                          background: 'transparent',
                          outline: 'none',
                          color: '#2C2C2A',
                          paddingBottom: 2,
                        }}
                      />
                      <p style={{ fontSize: 11, color: '#888780', marginTop: 3 }}>cup</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 22, fontWeight: 500, color: isFilled(field, bra) ? '#2C2C2A' : '#D3D1C7' }}>
                      {isFilled(field, bra) ? formatValue(field, bra) : '—'}
                    </p>
                    {conversions && <p style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>{conversions}</p>}
                  </>
                )}
              </div>
            )
          }

          return (
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
          )
        })}
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

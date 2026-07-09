import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMeasurements, saveMeasurements, saveLastUpdated } from '../storage'

const FIELDS = [
  { key: 'height', label: 'Height' },
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'inseam', label: 'Inseam' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'sleeve', label: 'Sleeve' },
  { key: 'neck', label: 'Neck' },
  { key: 'thigh', label: 'Thigh' },
]

const IN_TO_CM = 2.54

function toCm(inches) {
  const n = parseFloat(inches)
  return isNaN(n) ? '' : (n * IN_TO_CM).toFixed(1)
}

function toIn(cm) {
  const n = parseFloat(cm)
  return isNaN(n) ? '' : (n / IN_TO_CM).toFixed(1)
}

export default function Measurements() {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [data, setData] = useState(getMeasurements())

  function handleChange(key, unit, value) {
    setData(prev => {
      const other = unit === 'in'
        ? { cm: toCm(value) }
        : { in: toIn(value) }
      return { ...prev, [key]: { ...prev[key], [unit]: value, ...other } }
    })
  }

function handleSave() {
  saveMeasurements(data)
  const lastField = FIELDS.filter(f => data[f.key]?.in).pop()
  if (lastField) saveLastUpdated('measurements', lastField.label, `${data[lastField.key].in}"`)
  setEditing(false)
}

useEffect(() => { document.title = 'FitFile · Measurements' }, [])
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
        <h2 style={{ fontSize: 24, fontWeight: 500 }}>Body measurements</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{ background: 'none', border: '0.5px solid #D3D1C7', borderRadius: 8, padding: '0.4rem 0.85rem', fontSize: 13, color: '#5F5E5A' }}
          >
            Edit
          </button>
        )}
      </div>
      <p style={{ fontSize: 13, color: '#888780', marginBottom: '1.5rem' }}>Your measurements in both units.</p>

      {editing && (
        <div style={{ background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: 13, color: '#185FA5' }}>Enter either unit — the other will calculate automatically. You can adjust either value.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FIELDS.map(({ key, label }) => (
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
            <p style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {editing ? (
                <>
                  <div style={{ flex: 1 }}>
                    <input
                      value={data[key]?.in || ''}
                      onChange={e => handleChange(key, 'in', e.target.value)}
                      placeholder="inches"
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
                    <p style={{ fontSize: 11, color: '#888780', marginTop: 3 }}>in</p>
                  </div>
                  <div style={{ color: '#D3D1C7', fontSize: 16 }}>/</div>
                  <div style={{ flex: 1 }}>
                    <input
                      value={data[key]?.cm || ''}
                      onChange={e => handleChange(key, 'cm', e.target.value)}
                      placeholder="cm"
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
                    <p style={{ fontSize: 11, color: '#888780', marginTop: 3 }}>cm</p>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 20, fontWeight: 500, color: data[key]?.in ? '#2C2C2A' : '#D3D1C7' }}>
                    {data[key]?.in ? `${data[key].in}"` : '—'}
                  </p>
                  <p style={{ fontSize: 13, color: '#888780' }}>
                    {data[key]?.cm ? `${data[key].cm} cm` : ''}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ display: 'flex', gap: 8, marginTop: '1.5rem' }}>
          <button
            onClick={() => { setData(getMeasurements()); setEditing(false) }}
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
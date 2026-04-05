import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStoreById, saveStore, generateId } from '../storage'

const CATEGORIES = [
  { group: 'Tops', options: ['Tops (S/M/L)', 'T-Shirts', 'Shirts / Button-downs', 'Sweaters / Knitwear'] },
  { group: 'Bottoms', options: ['Bottoms (S/M/L)', 'Jeans / Pants', 'Shorts / Swim Trunks', 'Skirts'] },
  { group: 'Full Body', options: ['Dresses', 'Jumpsuits / Rompers', 'Swimwear'] },
  { group: 'Outerwear', options: ['Jackets / Coats'] },
  { group: 'Footwear', options: ['Shoes / Sneakers', 'Boots'] },
  { group: 'Underpinnings', options: ['Underwear / Briefs', 'Bra (band + cup)', 'Socks'] },
]

export default function AddEditStore() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = id && id !== 'new'

  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [sizes, setSizes] = useState({})
  const [customSizes, setCustomSizes] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [customLabel, setCustomLabel] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  useEffect(() => {
    if (isEditing) {
      const store = getStoreById(id)
      if (!store) { navigate('/stores'); return }
      setName(store.name)
      setNotes(store.notes || '')
      const { custom, ...rest } = store.sizes || {}
      setSizes(rest)
      setCustomSizes(custom || [])
    }
  }, [id])

  function handleAddCategory() {
    if (!selectedCategory) return
    if (selectedCategory === 'other') {
      setShowCustomInput(true)
      setSelectedCategory('')
      return
    }
    if (sizes[selectedCategory] !== undefined) return
    setSizes(prev => ({ ...prev, [selectedCategory]: '' }))
    setSelectedCategory('')
  }

  function handleAddCustom() {
    if (!customLabel.trim()) return
    setCustomSizes(prev => [...prev, { label: customLabel.trim(), value: '' }])
    setCustomLabel('')
    setShowCustomInput(false)
  }

  function handleSizeChange(category, value) {
    setSizes(prev => ({ ...prev, [category]: value }))
  }

  function handleCustomValueChange(index, value) {
    setCustomSizes(prev => prev.map((item, i) => i === index ? { ...item, value } : item))
  }

  function handleRemoveCategory(category) {
    setSizes(prev => { const next = { ...prev }; delete next[category]; return next })
  }

  function handleRemoveCustom(index) {
    setCustomSizes(prev => prev.filter((_, i) => i !== index))
  }

  function handleSave() {
    if (!name.trim()) return
    const store = {
      id: isEditing ? id : generateId(),
      name: name.trim(),
      notes: notes.trim(),
      sizes: { ...sizes, custom: customSizes },
    }
    saveStore(store)
    navigate(`/stores/${store.id}`)
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '0.5px solid #D3D1C7',
    borderRadius: 10,
    fontSize: 15,
    background: '#ffffff',
    outline: 'none',
    color: '#2C2C2A',
  }

  const labelStyle = {
    fontSize: 11,
    color: '#888780',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    display: 'block',
    marginBottom: 6,
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate(isEditing ? `/stores/${id}` : '/stores')}
        style={{ background: 'none', border: 'none', fontSize: 14, color: '#888780', marginBottom: '1.5rem', padding: 0 }}
      >
        ← Back
      </button>

      <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: '0.25rem' }}>
        {isEditing ? 'Edit store' : 'Add a store'}
      </h2>
      <p style={{ fontSize: 13, color: '#888780', marginBottom: '1.5rem' }}>
        Record your sizes for a specific store.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Store name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Uniqlo"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Sizes run small — go up one"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {(Object.keys(sizes).length > 0 || customSizes.length > 0) && (
          <div>
            <label style={labelStyle}>Sizes</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(sizes).map(([category, value]) => (
                <div key={category} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{
                    flex: 1,
                    background: '#ffffff',
                    border: '0.5px solid #D3D1C7',
                    borderRadius: 10,
                    padding: '0.6rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <p style={{ fontSize: 12, color: '#888780' }}>{category}</p>
                    <input
                      value={value}
                      onChange={e => handleSizeChange(category, e.target.value)}
                      placeholder="—"
                      style={{
                        width: 80,
                        textAlign: 'right',
                        border: 'none',
                        borderBottom: '1px solid #D3D1C7',
                        fontSize: 16,
                        fontWeight: 500,
                        background: 'transparent',
                        outline: 'none',
                        color: '#2C2C2A',
                      }}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    style={{ background: 'none', border: 'none', fontSize: 18, color: '#B4B2A9', padding: '0 4px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {customSizes.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{
                    flex: 1,
                    background: '#ffffff',
                    border: '0.5px solid #D3D1C7',
                    borderRadius: 10,
                    padding: '0.6rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <p style={{ fontSize: 12, color: '#888780' }}>{item.label}</p>
                    <input
                      value={item.value}
                      onChange={e => handleCustomValueChange(i, e.target.value)}
                      placeholder="—"
                      style={{
                        width: 80,
                        textAlign: 'right',
                        border: 'none',
                        borderBottom: '1px solid #D3D1C7',
                        fontSize: 16,
                        fontWeight: 500,
                        background: 'transparent',
                        outline: 'none',
                        color: '#2C2C2A',
                      }}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveCustom(i)}
                    style={{ background: 'none', border: 'none', fontSize: 18, color: '#B4B2A9', padding: '0 4px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label style={labelStyle}>Add a size category</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            >
              <option value="">Select a category...</option>
              {CATEGORIES.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </optgroup>
              ))}
              <option value="other">+ Other (custom)</option>
            </select>
            <button
              onClick={handleAddCategory}
              style={{
                padding: '0.75rem 1rem',
                background: '#EAF3DE',
                color: '#3B6D11',
                border: '0.5px solid #C0DD97',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              + Add
            </button>
          </div>
        </div>

        {showCustomInput && (
          <div>
            <label style={labelStyle}>Custom category name</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={customLabel}
                onChange={e => setCustomLabel(e.target.value)}
                placeholder="e.g. Heattech"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={handleAddCustom}
                style={{
                  padding: '0.75rem 1rem',
                  background: '#EAF3DE',
                  color: '#3B6D11',
                  border: '0.5px solid #C0DD97',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={!name.trim()}
        style={{
          marginTop: '2rem',
          width: '100%',
          padding: '0.85rem',
          background: name.trim() ? '#378ADD' : '#D3D1C7',
          color: '#ffffff',
          border: 'none',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 500,
          cursor: name.trim() ? 'pointer' : 'not-allowed',
        }}
      >
        {isEditing ? 'Save changes' : 'Save store'}
      </button>
    </div>
  )
}
import { useNavigate } from 'react-router-dom'

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

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate('/stores')}
        style={{ background: 'none', border: 'none', fontSize: 14, color: '#888780', marginBottom: '1.5rem', padding: 0 }}
      >
        ← Back
      </button>

      <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: '0.25rem' }}>Add a store</h2>
      <p style={{ fontSize: 13, color: '#888780', marginBottom: '1.5rem' }}>Record your sizes for a specific store.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
            Store name
          </label>
          <input
            type="text"
            placeholder="e.g. Uniqlo"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '0.5px solid #D3D1C7',
              borderRadius: 10,
              fontSize: 15,
              background: '#ffffff',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
            Notes (optional)
          </label>
          <textarea
            placeholder="e.g. Sizes run small — go up one"
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '0.5px solid #D3D1C7',
              borderRadius: 10,
              fontSize: 15,
              background: '#ffffff',
              resize: 'vertical',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
            Add a size category
          </label>
          <select
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '0.5px solid #D3D1C7',
              borderRadius: 10,
              fontSize: 15,
              background: '#ffffff',
              color: '#2C2C2A',
            }}
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
        </div>
      </div>

      <button
        style={{
          marginTop: '2rem',
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
        Save store
      </button>
    </div>
  )
}
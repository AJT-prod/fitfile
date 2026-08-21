import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SHOE_SIZES, APPAREL_SIZES, BRA_BANDS, BRA_CUPS } from '../utils/conversions'

const card = {
  background: '#ffffff',
  border: '0.5px solid #D3D1C7',
  borderRadius: 12,
  padding: '1.25rem',
  boxShadow: '0 1px 2px rgba(44, 44, 42, 0.04), 0 4px 14px rgba(44, 44, 42, 0.04)',
}

function Table({ columns, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col}
                style={{
                  textAlign: 'left',
                  padding: '6px 8px',
                  fontSize: 11,
                  color: '#5F5E5A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  borderBottom: '1px solid #EFEDE6',
                  whiteSpace: 'nowrap',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: '6px 8px',
                    color: '#2C2C2A',
                    fontWeight: 500,
                    borderBottom: i === rows.length - 1 ? 'none' : '1px solid #F5F3EC',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SizeGuide() {
  const navigate = useNavigate()
  useEffect(() => { document.title = 'FitFile · Size Guide' }, [])

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', fontSize: 14, color: '#5F5E5A', marginBottom: '1.5rem', padding: 0 }}
      >
        ← Back
      </button>

      <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: '0.25rem' }}>Size guide</h2>
      <p style={{ fontSize: 13, color: '#5F5E5A', marginBottom: '1.5rem' }}>General reference charts for converting between regions.</p>

      <div style={{ background: '#FAEEDA', border: '0.5px solid #FAC775', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: 13, color: '#854F0B' }}>These are standard industry charts, not any specific brand's sizing. Fit varies by brand, so treat them as a starting point.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={card}>
          <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 10 }}>Shoe sizes</p>
          <Table
            columns={['US Men', 'US Women', 'UK', 'EU']}
            rows={SHOE_SIZES.map(r => [r.usMen, r.usWomen, r.uk, r.eu])}
          />
        </div>

        <div style={card}>
          <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Apparel sizes</p>
          <p style={{ fontSize: 12, color: '#5F5E5A', marginBottom: 10 }}>Numeric sizing for tops, bottoms, and dresses. Letter sizes like S/M/L stay consistent across regions.</p>
          <Table
            columns={['US', 'UK', 'EU']}
            rows={APPAREL_SIZES.map(r => [r.us, r.uk, r.eu])}
          />
        </div>

        <div style={card}>
          <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 10 }}>Bra band size</p>
          <Table
            columns={['US / UK', 'EU']}
            rows={BRA_BANDS.map(r => [r.usUk, r.eu])}
          />
        </div>

        <div style={card}>
          <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 10 }}>Bra cup size</p>
          <Table
            columns={['US', 'UK', 'EU']}
            rows={BRA_CUPS.map(r => [r.us, r.uk, r.eu])}
          />
        </div>
      </div>
    </div>
  )
}

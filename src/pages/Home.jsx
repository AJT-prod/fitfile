import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em' }}>FitFile</h1>
        <p style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>Your sizes stored. Store to store.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SummaryCard
          label="Core sizes"
          preview="Tops · Bottoms · Shoes"
          onClick={() => navigate('/core-sizes')}
        />
        <SummaryCard
          label="Body measurements"
          preview="Chest · Waist · Inseam"
          onClick={() => navigate('/measurements')}
        />
        <SummaryCard
          label="My stores"
          preview="Uniqlo · Levi's · ASOS"
          onClick={() => navigate('/stores')}
        />
      </div>
    </div>
  )
}

function SummaryCard({ label, preview, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#ffffff',
        border: '0.5px solid #D3D1C7',
        borderRadius: 12,
        padding: '1rem 1.25rem',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <p style={{ fontSize: 11, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 500 }}>{preview}</p>
      </div>
      <span style={{ fontSize: 20, color: '#D3D1C7' }}>›</span>
    </div>
  )
}
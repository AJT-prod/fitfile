import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCoreSizes, getMeasurements, getStores, getLastUpdated } from '../storage'

export default function Home() {
  const navigate = useNavigate()
  const [coreSizes, setCoreSizes] = useState({})
  const [measurements, setMeasurements] = useState({})
  const [stores, setStores] = useState([])
  const [lastCoreSizes, setLastCoreSizes] = useState(null)
  const [lastMeasurements, setLastMeasurements] = useState(null)

  useEffect(() => {
    setCoreSizes(getCoreSizes())
    setMeasurements(getMeasurements())
    setStores(getStores())
    setLastCoreSizes(getLastUpdated('coreSizes'))
    setLastMeasurements(getLastUpdated('measurements'))
  }, [])

  function coreSizesPreview() {
    if (lastCoreSizes) return `${lastCoreSizes.label} · ${lastCoreSizes.value}`
    const filled = Object.values(coreSizes).some(v => v)
    return filled ? 'Tap to view' : 'No sizes added yet'
  }

  function measurementsPreview() {
    if (lastMeasurements) return `${lastMeasurements.label} · ${lastMeasurements.value}`
    const filled = Object.values(measurements).some(v => v?.in)
    return filled ? 'Tap to view' : 'No measurements added yet'
  }

  function storesPreview() {
    if (stores.length === 0) return 'No stores added yet'
    return stores.slice(0, 3).map(s => s.name).join(' · ')
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em' }}>FitFile</h1>
        <p style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>Your sizes stored. Store to store.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SummaryCard
          label="Core sizes"
          preview={coreSizesPreview()}
          empty={!lastCoreSizes && Object.values(coreSizes).every(v => !v)}
          onClick={() => navigate('/core-sizes')}
        />
        <SummaryCard
          label="Body measurements"
          preview={measurementsPreview()}
          empty={!lastMeasurements && Object.values(measurements).every(v => !v?.in)}
          onClick={() => navigate('/measurements')}
        />
        <SummaryCard
          label="My stores"
          preview={storesPreview()}
          empty={stores.length === 0}
          onClick={() => navigate('/stores')}
        />
      </div>
    </div>
  )
}

function SummaryCard({ label, preview, empty, onClick }) {
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
        <p style={{ fontSize: 18, fontWeight: 500, color: empty ? '#B4B2A9' : '#2C2C2A' }}>{preview}</p>
      </div>
      <span style={{ fontSize: 20, color: '#D3D1C7' }}>›</span>
    </div>
  )
}
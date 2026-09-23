// Pure view-model helpers for the popup: field definitions, the store-over-core
// merge, and display formatting. No DOM or chrome.* calls, so the store search
// screen and the later per-site permission layer can reuse this unchanged.
import { SHOE_SYSTEMS, findShoeRow, findBraBand, findBraCup } from './conversions.js'

// Same order and labels as the app's Core Sizes screen.
export const CORE_FIELDS = [
  { key: 'tops', label: 'Tops' },
  { key: 'bottoms', label: 'Bottoms' },
  { key: 'outerwear', label: 'Outerwear' },
  { key: 'jeans', label: 'Jeans / Pants', type: 'jeans' },
  { key: 'dresses', label: 'Dresses' },
  { key: 'shoes', label: 'Shoes / Sneakers', type: 'shoes' },
  { key: 'bra', label: 'Bra', type: 'bra' },
  { key: 'underwear', label: 'Underwear / Briefs' },
  { key: 'socks', label: 'Socks' },
]

export const MEASUREMENT_FIELDS = [
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

// Store sizes are saved under the app's dropdown labels, not core keys.
// These are the store categories that stand in for a Core Sizes field, so a
// store value here overrides the user's usual size (amber).
export const STORE_CATEGORY_TO_CORE = {
  'Tops (S/M/L)': 'tops',
  'Bottoms (S/M/L)': 'bottoms',
  'Jackets / Coats': 'outerwear',
  'Jeans / Pants': 'jeans',
  'Dresses': 'dresses',
  'Shoes / Sneakers': 'shoes',
  'Bra (band + cup)': 'bra',
  'Underwear / Briefs': 'underwear',
  'Socks': 'socks',
}

// Subcategories group under a Core Sizes parent as their own nested row.
// They never overwrite the parent (a store can have both Tops: S and
// T-Shirts: M), and they hide along with the parent. Swimwear and
// Jumpsuits / Rompers have no clean parent, so they stay standalone.
export const STORE_SUBCATEGORY_PARENT = {
  'T-Shirts': 'tops',
  'Shirts / Button-downs': 'tops',
  'Sweaters / Knitwear': 'tops',
  'Shorts / Swim Trunks': 'bottoms',
  'Skirts': 'bottoms',
  'Boots': 'shoes',
}

// PLACEHOLDER membership until checked against the mockup.
export const PRESETS = {
  everyday: {
    label: 'Everyday essentials',
    coreSizes: ['tops', 'bottoms', 'jeans', 'shoes'],
    measurements: ['waist', 'inseam'],
  },
  full: {
    label: 'Full wardrobe',
    coreSizes: CORE_FIELDS.map(f => f.key),
    measurements: MEASUREMENT_FIELDS.map(f => f.key),
  },
}

export const DEFAULT_DISPLAY = { preset: 'everyday', ...PRESETS.everyday }

function formatCore(field, value) {
  if (field.type === 'jeans') {
    if (!value?.waist && !value?.inseam) return ''
    return `${value.waist || '—'} × ${value.inseam || '—'}`
  }
  if (field.type === 'shoes') {
    if (!value?.size) return ''
    const sys = SHOE_SYSTEMS.find(s => s.key === value.system)
    return sys ? `${sys.label} ${value.size}` : value.size
  }
  if (field.type === 'bra') return `${value?.band || ''}${value?.cup || ''}`
  return typeof value === 'string' ? value.trim() : ''
}

// Mirrors shoeConversions / braConversions in CoreSizes.jsx. Returns null
// whenever the chart has no exact row: no guessing at a match.
function coreDetail(field, value) {
  if (field.type === 'shoes') {
    const row = findShoeRow(value?.system, value?.size)
    if (!row) return null
    return SHOE_SYSTEMS.filter(s => s.key !== value.system).map(s => `${s.label} ${row[s.key]}`).join(' · ')
  }
  if (field.type === 'bra') {
    const band = findBraBand(value?.band)
    const cup = findBraCup(value?.cup)
    if (!band && !cup) return null
    const parts = []
    parts.push(`UK ${band?.usUk ?? value.band ?? ''}${cup?.uk ?? value.cup ?? ''}`)
    if (band || cup) parts.push(`EU ${band?.eu ?? ''}${cup?.eu ?? ''}`)
    return parts.join(' · ')
  }
  return null
}

const normalize = s => String(s || '').toLowerCase().replace(/\s+/g, '').replace(/×/g, 'x')

// Builds everything the sizes view needs. `store` is null for the plain
// Core Sizes view (including the pinned "Core Sizes" search option).
export function buildSizesView({ coreSizes, measurements, store, display }) {
  const core = coreSizes || {}
  const storeSizes = { ...(store?.sizes || {}) }
  const custom = storeSizes.custom || []
  delete storeSizes.custom

  // Store entries that sit on top of a core field, keyed by core key.
  const overridesByCore = {}
  const childrenByCore = {}
  const storeOnly = []
  for (const [category, raw] of Object.entries(storeSizes)) {
    const value = String(raw || '').trim()
    if (!value) continue
    const coreKey = STORE_CATEGORY_TO_CORE[category]
    const parentKey = STORE_SUBCATEGORY_PARENT[category]
    if (coreKey) overridesByCore[coreKey] = value
    else if (parentKey) (childrenByCore[parentKey] ||= []).push({ label: category, value })
    else storeOnly.push({ label: category, value })
  }

  const visible = new Set(display.coreSizes)
  const rows = []
  let hiddenOverrides = 0

  for (const field of CORE_FIELDS) {
    const usual = formatCore(field, core[field.key])
    const override = overridesByCore[field.key]
    // A store entry identical to the usual size isn't really an outlier.
    const isOverride = !!override && normalize(override) !== normalize(usual)
    const children = childrenByCore[field.key] || []

    if (!visible.has(field.key)) {
      hiddenOverrides += (isOverride ? 1 : 0) + children.length
      continue
    }
    if (isOverride) {
      rows.push({ label: field.label, value: override, usual: usual || null, override: true, children })
    } else if (usual) {
      rows.push({ label: field.label, value: usual, detail: coreDetail(field, core[field.key]), children })
    } else if (children.length) {
      // No usual size saved, but the store has subcategories to group here.
      rows.push({ label: field.label, value: '—', empty: true, children })
    }
  }

  const extras = [
    ...storeOnly,
    ...custom.filter(c => String(c?.value || '').trim()).map(c => ({ label: c.label || 'Other', value: c.value.trim() })),
  ]

  const measurementRows = MEASUREMENT_FIELDS
    .filter(f => display.measurements.includes(f.key))
    .map(f => ({ label: f.label, in: measurements?.[f.key]?.in || '', cm: measurements?.[f.key]?.cm || '' }))
    .filter(m => m.in || m.cm)

  const hasStoreData = !!store && (Object.keys(overridesByCore).length > 0 || Object.keys(childrenByCore).length > 0 || extras.length > 0)

  return {
    rows,
    extras,
    measurementRows,
    notes: store?.notes?.trim() || '',
    hiddenOverrides,
    hasStoreData,
    nothingSaved: !CORE_FIELDS.some(f => formatCore(f, core[f.key])) &&
      !MEASUREMENT_FIELDS.some(f => measurements?.[f.key]?.in || measurements?.[f.key]?.cm),
  }
}

const KEYS = {
  coreSizes: 'fitfile_core_sizes',
  measurements: 'fitfile_measurements',
  stores: 'fitfile_stores',
}

const defaults = {
  coreSizes: {
    tops: '', bottoms: '', outerwear: '', jeans: '',
    dresses: '', shoes: '', bra: '', socks: '', underwear: '',
  },
  measurements: {
    chest: { in: '', cm: '' },
    waist: { in: '', cm: '' },
    hips: { in: '', cm: '' },
    inseam: { in: '', cm: '' },
    shoulder: { in: '', cm: '' },
    sleeve: { in: '', cm: '' },
    neck: { in: '', cm: '' },
    thigh: { in: '', cm: '' },
    height: { in: '', cm: '' },
  },
  stores: [],
}

export function getCoreSizes() {
  try {
    const raw = localStorage.getItem(KEYS.coreSizes)
    return raw ? JSON.parse(raw) : defaults.coreSizes
  } catch { return defaults.coreSizes }
}

export function saveCoreSizes(data) {
  localStorage.setItem(KEYS.coreSizes, JSON.stringify(data))
}

export function getMeasurements() {
  try {
    const raw = localStorage.getItem(KEYS.measurements)
    return raw ? JSON.parse(raw) : defaults.measurements
  } catch { return defaults.measurements }
}

export function saveMeasurements(data) {
  localStorage.setItem(KEYS.measurements, JSON.stringify(data))
}

export function getStores() {
  try {
    const raw = localStorage.getItem(KEYS.stores)
    return raw ? JSON.parse(raw) : defaults.stores
  } catch { return defaults.stores }
}

export function saveStores(data) {
  localStorage.setItem(KEYS.stores, JSON.stringify(data))
}

export function getStoreById(id) {
  return getStores().find(s => s.id === id) || null
}

export function saveStore(store) {
  const stores = getStores()
  const index = stores.findIndex(s => s.id === store.id)
  if (index >= 0) {
    stores[index] = store
  } else {
    stores.push(store)
  }
  saveStores(stores)
}

export function deleteStore(id) {
  saveStores(getStores().filter(s => s.id !== id))
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function getLastUpdated(section) {
  try {
    const raw = localStorage.getItem(`fitfile_last_updated_${section}`)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveLastUpdated(section, label, value) {
  localStorage.setItem(`fitfile_last_updated_${section}`, JSON.stringify({ label, value }))
}
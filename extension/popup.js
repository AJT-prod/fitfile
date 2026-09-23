import { buildSizesView, DEFAULT_DISPLAY } from './lib/sizes.js'

const FITFILE_URL = 'https://myfitfile.netlify.app'

// Popup-only state. Store selection is deliberately not persisted (v1):
// every open starts at the plain Core Sizes view.
const state = {
  mirror: null,       // fitfile_mirror: { data: { coreSizes, measurements, stores }, syncStatus }
  display: DEFAULT_DISPLAY,
  selectedStoreId: null,
}

const app = document.getElementById('app')

function h(tag, props = {}, ...children) {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') el.className = v
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v)
    else if (v != null) el.setAttribute(k, v)
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c)
  return el
}

const gearIcon = () => {
  const el = h('span')
  el.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>'
  return el
}

function openFitFile() {
  chrome.tabs.create({ url: FITFILE_URL })
}

function timeAgo(ts) {
  if (!ts) return ''
  const mins = Math.round((Date.now() - ts) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.round(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

// ---- screens ------------------------------------------------------------

function header() {
  return h('div', { class: 'header' },
    h('span', { class: 'wordmark' }, 'FitFile'),
    h('button', { class: 'icon-btn', title: "Change what's shown", 'aria-label': "Change what's shown", onClick: openCustomize }, gearIcon()),
  )
}

function storePicker(store) {
  return h('button', { class: 'store-picker', onClick: openStoreSearch },
    h('span', {},
      h('span', { class: 'eyebrow' }, 'Showing'),
      h('span', { class: 'name' }, store ? store.name : 'Core Sizes'),
    ),
    h('span', { class: 'action' }, store ? 'Change' : 'Match a store'),
  )
}

function emptyState({ headline, sub, button }) {
  return h('div', { class: 'empty' },
    h('span', { class: 'headline' }, headline),
    h('span', { class: 'sub' }, sub),
    button && h('button', { class: 'primary-btn', onClick: openFitFile }, button),
  )
}

function sizeRow(r) {
  const cls = ['row', r.override && 'override', r.child && 'child', r.empty && 'empty-value'].filter(Boolean).join(' ')
  return h('div', { class: cls },
    h('span', { class: 'label' }, r.label),
    h('span', { class: 'value-wrap' },
      h('div', { class: 'value' }, r.value),
      r.override && r.usual && h('div', { class: 'detail' }, `Usually ${r.usual}`),
      !r.override && r.detail && h('div', { class: 'detail' }, r.detail),
    ),
  )
}

function footer(syncStatus) {
  const s = syncStatus?.state
  const text = s === 'synced' ? `Synced ${timeAgo(syncStatus.lastSyncedAt)}`
    : s === 'syncing' ? 'Syncing…'
    : s === 'error' ? "Couldn't sync"
    : 'Not synced yet'
  return h('div', { class: 'footer' },
    h('span', { class: 'sync' }, h('span', { class: `dot ${s || ''}` }), text),
    h('button', { class: 'link-btn', onClick: openFitFile }, 'Open FitFile'),
  )
}

function renderSizes() {
  const { mirror, display, selectedStoreId } = state
  const syncStatus = mirror?.syncStatus
  const data = mirror?.data

  // No mirrored data at all: first run, stalled sync, or failed sync.
  if (!data) {
    const syncing = syncStatus?.state === 'syncing'
    return [
      header(),
      syncing
        ? emptyState({ headline: 'Syncing in progress…', sub: 'Your sizes will show up here in a moment.' })
        : emptyState({ headline: "Couldn't sync", sub: 'Open FitFile to try again.', button: 'Open FitFile' }),
    ]
  }

  const store = (data.stores || []).find(s => s.id === selectedStoreId) || null
  const view = buildSizesView({ coreSizes: data.coreSizes, measurements: data.measurements, store, display })

  if (view.nothingSaved && !view.hasStoreData) {
    return [
      header(),
      emptyState({ headline: 'Nothing saved yet', sub: 'Add your core sizes to get started.', button: 'Open FitFile' }),
      footer(syncStatus),
    ]
  }

  const notices = []
  if (store && !view.hasStoreData) {
    notices.push(`No store-specific data for ${store.name}, so these are your usual sizes.`)
  }
  if (view.hiddenOverrides > 0) {
    const n = view.hiddenOverrides
    notices.push(`${store.name} has ${n} size${n === 1 ? '' : 's'} not shown.`)
  }

  return [
    header(),
    storePicker(store),
    ...notices.map(t => h('p', { class: 'notice' }, t)),
    view.rows.length > 0 && h('section', {},
      h('div', { class: 'card-title' }, 'Sizes'),
      h('div', { class: 'card' }, view.rows.flatMap(r => [
        sizeRow(r),
        ...(r.children || []).map(c => sizeRow({ ...c, child: true })),
      ])),
    ),
    (view.extras.length > 0 || view.notes) && h('section', {},
      h('div', { class: 'card-title' }, `Also saved for ${store.name}`),
      h('div', { class: 'card' },
        view.extras.map(sizeRow),
        view.notes && h('div', { class: 'notes' }, h('span', { class: 'label' }, 'Notes'), view.notes),
      ),
    ),
    view.measurementRows.length > 0 && h('section', {},
      h('div', { class: 'card-title' }, 'Measurements'),
      h('div', { class: 'card' }, view.measurementRows.map(m => sizeRow({
        label: m.label,
        value: m.in ? `${m.in} in` : `${m.cm} cm`,
        detail: m.in && m.cm ? `${m.cm} cm` : null,
      }))),
    ),
    footer(syncStatus),
  ]
}

function render() {
  app.replaceChildren(...renderSizes().filter(Boolean))
}

// ---- navigation stubs (next screens) -------------------------------------

function openStoreSearch() {
  // TODO: store search/select screen (pinned Core Sizes option + likely-match edge bar).
  // It will call selectStore(id | null).
}

function openCustomize() {
  // TODO: customize-display screen (preset chips + category checklist).
}

export function selectStore(id) {
  state.selectedStoreId = id
  render()
}

// ---- data ----------------------------------------------------------------

async function init() {
  const { fitfile_mirror, fitfile_extension } = await chrome.storage.local.get(['fitfile_mirror', 'fitfile_extension'])
  state.mirror = fitfile_mirror || null
  state.display = fitfile_extension?.display || DEFAULT_DISPLAY
  render()
}

// Re-render if a sync lands while the popup is open (e.g. "Syncing…" -> synced).
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes.fitfile_mirror) return
  state.mirror = changes.fitfile_mirror.newValue || null
  render()
})

init()

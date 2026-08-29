function readFitFileKey(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

chrome.runtime.sendMessage({
  type: 'FITFILE_SYNC',
  payload: {
    coreSizes: readFitFileKey('fitfile_core_sizes'),
    measurements: readFitFileKey('fitfile_measurements'),
    stores: readFitFileKey('fitfile_stores'),
  },
});

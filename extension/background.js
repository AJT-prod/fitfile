function setSyncStatus(state, extra = {}) {
  chrome.storage.local.get('fitfile_mirror', (result) => {
    const current = result.fitfile_mirror || {};
    chrome.storage.local.set({
      fitfile_mirror: {
        ...current,
        syncStatus: { state, ...extra },
      },
    });
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== 'FITFILE_SYNC') return;

  chrome.storage.local.set(
    {
      fitfile_mirror: {
        data: message.payload,
        syncStatus: { state: 'syncing', lastSyncedAt: null, error: null },
      },
    },
    () => {
      if (chrome.runtime.lastError) {
        setSyncStatus('error', { lastSyncedAt: null, error: chrome.runtime.lastError.message });
        return;
      }
      setSyncStatus('synced', { lastSyncedAt: Date.now(), error: null });
    }
  );
});

/**
 * popup.js
 * ShortScroll browser extension
 *
 * Loads settings from storage when the popup opens and saves them on change.
 */

// Cross-browser API shim
const storageAPI = (typeof browser !== 'undefined' && browser.storage)
  ? browser.storage
  : chrome.storage;

const DEFAULT_SETTINGS = {
  enabled: true,
  delayMs: 0
};

const toggleEnabled = document.getElementById('toggle-enabled');
const inputDelay    = document.getElementById('input-delay');
const statusMsg     = document.getElementById('status-msg');

/**
 * Briefly shows a confirmation message to the user.
 */
function showSaved() {
  statusMsg.textContent = 'Settings saved.';
  setTimeout(() => { statusMsg.textContent = ''; }, 1500);
}

/**
 * Reads the current values from the form and persists them to storage.
 */
function saveSettings() {
  const delaySeconds = parseFloat(inputDelay.value) || 0;
  const settings = {
    enabled: toggleEnabled.checked,
    delayMs: Math.round(delaySeconds * 1000)
  };

  storageAPI.local.set(settings, () => {
    showSaved();
  });
}

/**
 * Populates the form with values loaded from storage.
 */
function loadSettings() {
  storageAPI.local.get(DEFAULT_SETTINGS, (result) => {
    toggleEnabled.checked = result.enabled;
    inputDelay.value = (result.delayMs / 1000).toFixed(1);
  });
}

// Auto-save whenever either control changes
toggleEnabled.addEventListener('change', saveSettings);
inputDelay.addEventListener('change', saveSettings);

// Load settings immediately when the popup opens
loadSettings();

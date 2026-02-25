/**
 * content.js
 * ShortScroll browser extension
 *
 * Detects when a YouTube Short finishes and automatically scrolls to the next one.
 * Handles YouTube's single-page app navigation via MutationObserver.
 */

// Cross-browser API shim: Firefox exposes `browser`, Chromium exposes `chrome`.
const storageAPI = (typeof browser !== 'undefined' && browser.storage)
  ? browser.storage
  : chrome.storage;

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  delayMs: 0
};

// Currently observed video element
let currentVideo = null;

// Whether we have already scheduled a scroll for the current video
let scrollScheduled = false;

/**
 * Fetches settings from storage and returns a Promise that resolves to the
 * settings object, falling back to defaults for any missing keys.
 */
function getSettings() {
  return new Promise((resolve) => {
    storageAPI.local.get(DEFAULT_SETTINGS, (result) => {
      resolve(result);
    });
  });
}

/**
 * Triggered when the video's `ended` event fires.
 * Reads settings and, if enabled, scrolls down after the configured delay.
 */
async function onVideoEnded() {
  // Guard against duplicate firings for the same video
  if (scrollScheduled) return;
  scrollScheduled = true;

  const settings = await getSettings();

  if (!settings.enabled) {
    scrollScheduled = false;
    return;
  }

  const delay = typeof settings.delayMs === 'number' ? settings.delayMs : 0;

  setTimeout(() => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    scrollScheduled = false;
  }, delay);
}

/**
 * Attaches the `ended` listener to the given video element.
 * Cleans up the listener on the previous video first.
 */
function attachToVideo(video) {
  if (currentVideo === video) return;

  if (currentVideo) {
    currentVideo.removeEventListener('ended', onVideoEnded);
  }

  currentVideo = video;
  scrollScheduled = false;
  currentVideo.addEventListener('ended', onVideoEnded);
}

/**
 * Searches the document for a video element inside a YouTube Shorts player
 * and attaches to it if found.
 */
function findAndAttachVideo() {
  // Try common selectors used by YouTube Shorts
  const selectors = [
    'ytd-shorts video',
    'ytd-reel-video-renderer video',
    'ytd-shorts-video-renderer video',
    '#shorts-player video'
  ];

  for (const selector of selectors) {
    const video = document.querySelector(selector);
    if (video) {
      attachToVideo(video);
      return;
    }
  }
}

/**
 * MutationObserver callback.
 * Re-runs video detection whenever the DOM changes, handling YouTube's SPA
 * navigation which replaces player elements without a full page reload.
 */
function onDomMutation() {
  findAndAttachVideo();
}

// Observe the entire document body for subtree changes caused by SPA navigation
const observer = new MutationObserver(onDomMutation);
observer.observe(document.body, { childList: true, subtree: true });

// Perform an initial search in case the video element is already in the DOM
findAndAttachVideo();

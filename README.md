# ShortScroll

A Python script that automatically scrolls to the next YouTube Short when the current video finishes playing.

Instead of using timers (which fail for different video lengths), it detects the red progress indicator on the screen and scrolls only when the video is visually complete.

---

## How It Works

Your screen is made of pixels. Each pixel has a color represented as `(Red, Green, Blue)`.

The YouTube Shorts progress bar turns red as the video plays. This script:

1. Watches a small area near the bottom of the Shorts player
2. Continuously checks pixel colors in that area
3. When red is detected, scrolls to the next Short

This approach is called **pixel-based state detection**. It reacts in real time and works across different Short durations without needing to know the video length.

---

## Why a Small Area Is Used (RADIUS)

UI elements can slightly shift depending on:

- Video size
- Browser zoom level
- Layout changes

Instead of checking a single exact pixel, the script checks a small square of pixels around a center point. This makes detection more reliable.

---

## Requirements

- Python 3.x
- [PyAutoGUI](https://pyautogui.readthedocs.io/)
- [Pillow](https://pillow.readthedocs.io/) (for screen reading)
- Linux (X11) or Windows

Install dependencies:

```bash
pip install pyautogui pillow
```

On Ubuntu, also install:

```bash
sudo apt install gnome-screenshot
```

---

## Usage

1. Open YouTube Shorts in your browser.
2. Move your mouse cursor near the bottom of the Shorts video where the red progress bar appears.
3. Run this in a Python shell to find the correct screen coordinates:

```python
import pyautogui
print(pyautogui.position())
```

4. Open `scroller.py` and replace the coordinate values:

```python
CENTER_X = your_x_value
CENTER_Y = your_y_value
```

5. Run the script:

```bash
python scroller.py
```

The script waits 3 seconds before it begins monitoring, giving you time to switch to your browser.

---

## Configuration

| Variable   | Default | Description                                      |
|------------|---------|--------------------------------------------------|
| `CENTER_X` | `1260`  | X coordinate of the progress bar area to monitor |
| `CENTER_Y` | `1043`  | Y coordinate of the progress bar area to monitor |
| `RADIUS`   | `3`     | Size of the pixel search area around the center  |

---

## Troubleshooting

| Problem                        | Solution                                                  |
|--------------------------------|-----------------------------------------------------------|
| Script does not scroll         | Re-measure `CENTER_X` and `CENTER_Y` with `pyautogui.position()` |
| Scrolls at the wrong time      | Adjust `RADIUS` or check browser zoom is set to 100%     |
| Detection seems unreliable     | Increase `RADIUS` to 4 or 5 for more tolerance           |
| Page loads slowly after scroll | Increase the `time.sleep(1.5)` delay in the script       |

---

## Limitations

- **Desktop only.** Does not work on mobile phones, mobile emulators, or touch-only environments. PyAutoGUI reads desktop screen pixels.
- **YouTube UI dependent.** Changes to the YouTube Shorts interface (colors, layout) may break detection.
- **Single monitor.** Coordinates are based on a single display setup. Multi-monitor setups may require coordinate adjustments.

---

## Future Improvements

- [ ] Add start/stop hotkey
- [ ] Auto-detect progress bar position
- [ ] Support multiple monitors
- [ ] Add logging for debugging
- [ ] Handle layout shifts dynamically

---

## Disclaimer

This is a learning automation project. UI changes by YouTube may break detection at any time.

---

## Browser Extension

The `extension/` directory contains a browser extension that provides the same auto-scroll behaviour as the Python script, but runs directly inside the browser — no Python environment required.

The extension injects a content script into YouTube Shorts pages, listens for the native `ended` event on the video element, and performs a smooth scroll to advance to the next Short.  A popup lets you enable or disable auto-scrolling and configure a delay between video end and scroll.

---

## Extension Installation

### Chrome / Brave / Edge

1. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
   - Edge: `edge://extensions`
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the `extension/` folder from this repository.
5. The ShortScroll extension will appear in your extensions list.

### Firefox

1. Open Firefox and navigate to `about:debugging`.
2. Click **This Firefox** in the left sidebar.
3. Click **Load Temporary Add-on...**.
4. Navigate to the `extension/` folder and select the `manifest.json` file.
5. The extension will remain loaded until Firefox is closed.

For a persistent installation on Firefox, the extension would need to be packaged and signed through [addons.mozilla.org](https://addons.mozilla.org).

---

## Extension Configuration

Click the ShortScroll icon in the browser toolbar to open the popup.

| Control             | Description                                                       |
|---------------------|-------------------------------------------------------------------|
| Auto-scroll toggle  | Enable or disable automatic scrolling when a Short ends           |
| Scroll delay (s)    | Seconds to wait after the video ends before scrolling (0 to 5)   |

Settings are saved automatically when you change either control.

---

## Supported Browsers

| Browser | Engine   | Manifest V3 | Notes                                      |
|---------|----------|-------------|--------------------------------------------|
| Chrome  | Chromium | Yes         | Full support                               |
| Brave   | Chromium | Yes         | Full support                               |
| Edge    | Chromium | Yes         | Full support                               |
| Opera   | Chromium | Yes         | Load via developer mode in Opera settings  |
| Firefox | Gecko    | Yes (109+)  | Load as temporary add-on via about:debugging |

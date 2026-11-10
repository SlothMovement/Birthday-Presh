# A little something for you

A frontend-only vintage birthday scrapbook made with HTML, CSS, and vanilla JavaScript.

## Run locally

Open `index.html` in a browser. For webcam access, serve this folder from localhost (for example, `python -m http.server 8000`) because browsers require a secure context for camera access. Then visit `http://localhost:8000`.

## Personalize

Edit the `CONFIG` object at the top of `script.js` to change the letter, birthday message, and playlist. For playlist audio, put files in `assets/music/` and set each song's `src`, such as `assets/music/song-one.mp3`. For background music, add `assets/music/background.mp3`; the floating play/pause button uses that path from `CONFIG.backgroundMusic`. Browsers require the visitor to tap Play before sound begins.

The scrapbook reveals four memories at a time while scrolling. Its media list is near the middle of `script.js` in the `memories` array. Replace the sample file paths there with your own:

- Photos: `assets/images/photo1.jpg` through `photo6.jpg`, plus `photo8.jpg`, `photo10.jpg`, and `photo11.jpg`
- GIFs: `assets/images/photo7.gif` and `assets/images/photo9.gif`
- Videos: `assets/videos/Video1.mp4`, `assets/videos/Video2.mp4`, and `assets/videos/memory3.mp4`

Keep the captions in that array or change them to your own. Missing files show a small filename reminder. Video cards are muted and loop so they can play inline. Visitors cannot upload or change scrapbook memories; photobooth uploads are temporary visitor photos.

The photobooth uses `assets/images/photobooth-frame.png` as its custom three-slot frame. Replace that file to change the design. The flower animation is in `flower.html` and `flower.css`; change `CUSTOM_FLOWER_NOTE` in `script.js` to edit its fixed note.

The website uses Google Fonts when online and falls back to system fonts when offline. Camera access is optional; photo uploads work without it.
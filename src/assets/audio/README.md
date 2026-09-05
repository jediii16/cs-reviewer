# Audio library

Add study audio to one of these folders:

- `lofi`
- `english-songs`
- `english-songs-instrumental`
- `kpop-songs`
- `kpop-instrumental`
- `noise`

Supported formats are MP3, WAV, M4A, and OGG. Restart the development server or rebuild the app after adding files so Vite can discover them.

Noise filenames should include `rain`, `brown`, or `pink` so the app can classify them. Music labels are generated from filenames; provider suffixes such as `chosic.com` are removed. Files that produce the same display label appear only once in the player.

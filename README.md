# Clipcatch: Instagram + Facebook video downloader (Node.js)

## Run it
1. Install Node.js 18+ (https://nodejs.org) and ffmpeg (https://ffmpeg.org/download.html)
2. In this folder:
   npm install     (downloads the yt-dlp binary, no Python needed)
   npm start       (checks for a newer yt-dlp each time it starts)
3. Open http://127.0.0.1:3000, paste a link, click Find video, then Download.
   The browser saves the file to your Downloads folder.

## If Instagram says "log in"
Instagram only serves most videos to logged-in visitors.
Open "Login settings" on the page and pick the browser you're logged in to Instagram with.
- Firefox is the most reliable.
- Chrome/Edge on Windows often block cookie access: close the browser first, or use Firefox.
- Alternative: export cookies to cookies.txt (Netscape format, e.g. with the "Get cookies.txt LOCALLY"
  extension) and put it in this folder.

## Other notes
- Facebook public videos usually work without a login.
- Only download content you own or have permission to save.

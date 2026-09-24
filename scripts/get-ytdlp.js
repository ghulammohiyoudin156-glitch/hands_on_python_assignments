// Downloads the standalone yt-dlp binary (no Python needed) into ./bin
const fs = require("fs");
const path = require("path");

const assets = { win32: "yt-dlp.exe", darwin: "yt-dlp_macos", linux: "yt-dlp_linux" };
const asset = assets[process.platform];
if (!asset) { console.log("Unsupported OS. Install yt-dlp yourself and make sure it is on your PATH."); process.exit(0); }

const dir = path.join(__dirname, "..", "bin");
const out = path.join(dir, process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");

(async () => {
  try {
    fs.mkdirSync(dir, { recursive: true });
    console.log("Downloading yt-dlp…");
    const res = await fetch(`https://github.com/yt-dlp/yt-dlp/releases/latest/download/${asset}`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    fs.chmodSync(out, 0o755);
    console.log("yt-dlp ready:", out);
  } catch (e) {
    console.log("Could not download yt-dlp (" + e.message + "). Install it manually and put it on your PATH.");
  }
})();

const express = require("express");
const { execFile } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const ALLOWED = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(",")
  : ["instagram.com", "facebook.com", "fb.watch", "fb.com"];
const BROWSERS = ["chrome", "firefox", "edge", "brave", "chromium", "opera", "safari"];
const isWin = process.platform === "win32";
const localBin = path.join(__dirname, "bin", isWin ? "yt-dlp.exe" : "yt-dlp");
const YTDLP = fs.existsSync(localBin) ? localBin : "yt-dlp";
const cookiesFile = path.join(__dirname, "cookies.txt");
const state = { ytdlp: null, ffmpeg: false };
const ready = new Map(); // token -> { dir, file }

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const valid = url => {
  try {
    const u = new URL(url);
    return ["http:", "https:"].includes(u.protocol) &&
      ALLOWED.some(d => u.hostname === d || u.hostname.endsWith("." + d));
  } catch { return false; }
};

const authArgs = browser => {
  if (BROWSERS.includes(browser)) return ["--cookies-from-browser", browser];
  if (fs.existsSync(cookiesFile)) return ["--cookies", cookiesFile];
  return [];
};

const run = args => new Promise((resolve, reject) => {
  execFile(YTDLP, args, { maxBuffer: 64 * 1024 * 1024, timeout: 10 * 60 * 1000 }, (err, stdout, stderr) => {
    if (err) { err.stderr = stderr; return reject(err); }
    resolve(stdout);
  });
});

function explain(e) {
  const raw = String(e.stderr || e.message || e);
  const lines = raw.split("\n").filter(Boolean);
  const line = lines.filter(l => /ERROR/.test(l)).pop() || lines.pop() || "";
  console.error("[yt-dlp]", line);
  const l = line.toLowerCase();
  if (e.code === "ENOENT") return "yt-dlp is missing. Run npm install again, or install yt-dlp and add it to your PATH.";
  if (/could not find .*cookies|cookies? database|decrypt|dpapi/.test(l))
    return "Couldn't read that browser's login. Close the browser and retry, or use Firefox. Chrome and Edge on Windows often block this.";
  if (/login|log in|sign in|cookies|rate-limit|empty media|restricted|private|checkpoint|not available/.test(l))
    return "Instagram/Facebook wants you logged in for this one. Open “Login settings” below, pick the browser you're logged in with (Firefox works best), then try again.";
  if (/no video|no media|no formats/.test(l)) return "This post doesn't seem to contain a video.";
  if (/unsupported url/.test(l)) return "That link type isn't supported. Open the video and copy its full link.";
  if (/ffmpeg/.test(l)) return "This needs ffmpeg. Install it from ffmpeg.org and restart the server.";
  return "Couldn't get this video: " + line.replace(/^ERROR:\s*/, "").replace(/\[[^\]]+\]\s*/, "").slice(0, 200);
}

const pickFormat = q => {
  if (q === "audio") return "bestaudio/best";
  const h = { "720": 720, "480": 480 }[q];
  const cap = h ? `[height<=${h}]` : "";
  return state.ffmpeg ? `bv*${cap}+ba/b${cap}/b` : `b${cap}/b`;
};

app.get("/api/status", (_, res) => res.json({ ytdlp: state.ytdlp, ffmpeg: state.ffmpeg }));

app.post("/api/info", async (req, res) => {
  const url = String(req.body?.url || "").trim();
  if (!valid(url)) return res.status(400).json({ error: "Paste a link from Instagram or Facebook." });
  try {
    const out = await run(["--dump-single-json", "--no-playlist", "--no-warnings",
      ...authArgs(req.body.browser), "--", url]);
    const d = JSON.parse(out);
    res.json({
      title: d.title || "Untitled video",
      thumbnail: d.thumbnail || null,
      duration: d.duration || null,
      uploader: d.uploader || d.channel || null,
    });
  } catch (e) { res.status(400).json({ error: explain(e) }); }
});

// Step 1: download to a temp folder on the server, return a one-time token
app.post("/api/prepare", async (req, res) => {
  const url = String(req.body?.url || "");
  const q = String(req.body?.quality || "best");
  if (!valid(url)) return res.status(400).json({ error: "Invalid link." });
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "clip-"));
  const cleanup = () => fs.rm(dir, { recursive: true, force: true }, () => {});
  try {
    const args = ["-f", pickFormat(q), "--no-playlist", "--no-warnings", "--max-filesize", "500M",
      "--merge-output-format", "mp4", "-o", path.join(dir, "%(title).80B [%(id)s].%(ext)s"),
      ...authArgs(req.body.browser)];
    if (q === "audio" && state.ffmpeg) args.push("-x", "--audio-format", "mp3");
    await run([...args, "--", url]);
    const file = fs.readdirSync(dir).find(f => !/\.(part|ytdl)$/.test(f));
    if (!file) throw new Error("ERROR: no video was downloaded (file may exceed 500 MB)");
    const token = crypto.randomUUID();
    ready.set(token, { dir, file });
    setTimeout(() => { if (ready.delete(token)) cleanup(); }, 10 * 60 * 1000);
    res.json({ token, name: file, size: fs.statSync(path.join(dir, file)).size });
  } catch (e) { cleanup(); res.status(400).json({ error: explain(e) }); }
});

// Step 2: the browser downloads the file natively (goes to your Downloads folder)
app.get("/api/file/:token", (req, res) => {
  const item = ready.get(req.params.token);
  if (!item) return res.status(404).send("This download expired. Go back and try again.");
  ready.delete(req.params.token);
  res.download(path.join(item.dir, item.file), item.file, () => fs.rm(item.dir, { recursive: true, force: true }, () => {}));
});

const probe = (cmd, args) => new Promise(r => execFile(cmd, args, (e, out) => r(e ? null : String(out).trim())));

(async () => {
  if (fs.existsSync(localBin)) {
    console.log("Checking for a newer yt-dlp…");
    await new Promise(r => execFile(YTDLP, ["-U"], () => r()));
  }
  state.ytdlp = await probe(YTDLP, ["--version"]);
  state.ffmpeg = !!(await probe("ffmpeg", ["-version"]));
  console.log("yt-dlp:", state.ytdlp || "NOT FOUND (run npm install)");
  console.log("ffmpeg:", state.ffmpeg ? "found" : "not found (HD merging + MP3 limited)");
  app.listen(PORT, "127.0.0.1", () => console.log(`Open http://127.0.0.1:${PORT}`));
})();

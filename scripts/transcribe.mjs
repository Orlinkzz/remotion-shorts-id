// Pemakaian:
//   npm run transcribe <videoId>          -> public/videos/<videoId>/captions.json
//   npm run transcribe <videoId> --force  -> timpa captions.json yang sudah ada
//   npm run transcribe                    -> semua folder di public/videos
//
// Dasar: sub.mjs dari remotion-dev/template-tiktok, disesuaikan untuk input audio
// dan struktur public/videos/<id>/.
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import {
  downloadWhisperModel,
  installWhisperCpp,
  toCaptions,
  transcribe,
} from "@remotion/install-whisper-cpp";
import {
  WHISPER_LANG,
  WHISPER_MODEL,
  WHISPER_PATH,
  WHISPER_VERSION,
} from "../whisper-config.mjs";

const videosDir = path.join(process.cwd(), "public", "videos");
const args = process.argv.slice(2);
const force = args.includes("--force");
const requested = args.filter((a) => !a.startsWith("--"));

const ids = requested.length
  ? requested
  : readdirSync(videosDir).filter((d) =>
      statSync(path.join(videosDir, d)).isDirectory(),
    );

const toWav = (input, output) => {
  // Whisper.cpp butuh WAV 16 kHz mono.
  execFileSync(
    "npx",
    ["remotion", "ffmpeg", "-i", input, "-ar", "16000", "-ac", "1", output, "-y"],
    { stdio: ["ignore", "inherit", "inherit"], shell: process.platform === "win32" },
  );
};

const todo = [];
for (const id of ids) {
  const dir = path.join(videosDir, id);
  const specPath = path.join(dir, "video.json");
  if (!existsSync(specPath)) {
    console.warn(`Lewati "${id}": video.json tidak ada`);
    continue;
  }
  const out = path.join(dir, "captions.json");
  if (existsSync(out) && !force) {
    console.log(`Lewati "${id}": captions.json sudah ada (pakai --force untuk menimpa)`);
    continue;
  }
  const voice = JSON.parse(readFileSync(specPath, "utf8")).voice ?? "voice.mp3";
  const voicePath = path.join(dir, voice);
  if (!existsSync(voicePath)) {
    console.warn(`Lewati "${id}": ${voice} tidak ada`);
    continue;
  }
  todo.push({ id, voicePath, out });
}

if (todo.length === 0) {
  console.log("Tidak ada yang perlu ditranskripsi.");
  process.exit(0);
}

await installWhisperCpp({ to: WHISPER_PATH, version: WHISPER_VERSION });
await downloadWhisperModel({ folder: WHISPER_PATH, model: WHISPER_MODEL });

const tempDir = path.join(process.cwd(), "temp");
mkdirSync(tempDir, { recursive: true });

for (const { id, voicePath, out } of todo) {
  console.log(`Transkripsi "${id}" (model ${WHISPER_MODEL}, bahasa ${WHISPER_LANG})...`);
  const wav = path.join(tempDir, `${id}.wav`);
  toWav(voicePath, wav);

  const whisperCppOutput = await transcribe({
    inputPath: wav,
    model: WHISPER_MODEL,
    tokenLevelTimestamps: true,
    whisperPath: WHISPER_PATH,
    whisperCppVersion: WHISPER_VERSION,
    printOutput: false,
    translateToEnglish: false,
    language: WHISPER_LANG,
    splitOnWord: true,
  });

  const { captions } = toCaptions({ whisperCppOutput });
  writeFileSync(out, JSON.stringify(captions, null, 2));
  console.log(`  -> ${path.relative(process.cwd(), out)} (${captions.length} token)`);
}

rmSync(tempDir, { recursive: true, force: true });

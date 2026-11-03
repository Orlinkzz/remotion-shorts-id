// Pemakaian:
//   npm run tts <videoId>                          -> voice.mp3 dari naskah, lalu captions.json (Whisper)
//   npm run tts <videoId> -- --provider=google     -> paksa satu provider (edge|azure|google|gtranslate)
//   npm run tts <videoId> -- --force               -> boleh menimpa voice.mp3 yang bukan hasil TTS (rekaman)
//   npm run tts <videoId> -- --no-transcribe       -> hanya membuat audio
//
// Teks yang diucapkan = `speech` scene (kalau ada), selain itu `narration`.
// Audio per scene di-cache di .cache/tts/<videoId>/, jadi hanya scene yang
// teksnya berubah yang dibuat ulang.
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  TTS_PROVIDERS,
  TTS_RATE,
  TTS_SCENE_GAP_MS,
  TTS_VOICES,
} from "../tts-config.mjs";
import { providers } from "./tts-providers.mjs";

const args = process.argv.slice(2);
const videoId = args.find((a) => !a.startsWith("--"));
const force = args.includes("--force");
const transcribeAfter = !args.includes("--no-transcribe");
const forced = args.find((a) => a.startsWith("--provider="))?.split("=")[1];

if (!videoId) {
  console.error("Pemakaian: npm run tts <videoId> [-- --provider=<nama>] [-- --force]");
  process.exit(1);
}
if (existsSync(".env")) process.loadEnvFile(".env");

const sha1 = (data) => createHash("sha1").update(data).digest("hex");

const dir = path.join("public", "videos", videoId);
const specPath = path.join(dir, "video.json");
if (!existsSync(specPath)) {
  console.error(`${specPath} tidak ditemukan`);
  process.exit(1);
}
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const voicePath = path.join(dir, spec.voice ?? "voice.mp3");
const texts = (spec.scenes ?? []).map((s) => String(s.speech ?? s.narration ?? "").trim());
if (texts.length === 0 || texts.some((t) => !t)) {
  console.error("Setiap scene wajib punya narration (atau speech). Jalankan: npm run validate " + videoId);
  process.exit(1);
}

const cacheDir = path.join(".cache", "tts", videoId);
mkdirSync(cacheDir, { recursive: true });
const markerPath = path.join(cacheDir, "output.sha1");

// Jangan menimpa rekaman sendiri: voice.mp3 hanya ditimpa kalau hasil TTS sebelumnya.
if (existsSync(voicePath) && !force) {
  const ours =
    existsSync(markerPath) &&
    readFileSync(markerPath, "utf8").trim() === sha1(readFileSync(voicePath));
  if (!ours) {
    console.error(
      `${voicePath} sudah ada dan bukan hasil TTS (mungkin rekaman). ` +
        `Tambahkan "-- --force" untuk menimpanya.`,
    );
    process.exit(1);
  }
}

const order = forced ? [forced] : TTS_PROVIDERS;
for (const name of order) {
  if (!providers[name]) {
    console.error(`Provider "${name}" tidak dikenal. Pilihan: ${Object.keys(providers).join(", ")}`);
    process.exit(1);
  }
}

let chosen = null;
let files = [];
for (const name of order) {
  const provider = providers[name];
  if (!provider.available()) {
    console.log(`Lewati ${name}: ${provider.missing}`);
    continue;
  }
  const opts = { ...TTS_VOICES[name], rate: TTS_RATE };
  console.log(`TTS "${videoId}" dengan ${name}${opts.voice ? ` (${opts.voice})` : ""}...`);
  try {
    files = [];
    for (const [i, text] of texts.entries()) {
      const file = path.join(cacheDir, `${name}-${sha1(JSON.stringify([opts, text])).slice(0, 16)}.mp3`);
      if (existsSync(file)) {
        console.log(`  scene ${i + 1}: dari cache`);
      } else {
        writeFileSync(file, await provider.synth(text, opts));
        console.log(`  scene ${i + 1}: dibuat`);
      }
      files.push(file);
    }
    chosen = name;
    break;
  } catch (e) {
    console.warn(`  ${name} gagal: ${e.message}`);
  } finally {
    provider.close?.();
  }
}

if (!chosen) {
  console.error("Semua provider TTS gagal. Cek koneksi internet atau isi API key di .env.");
  process.exit(1);
}

// Gabungkan potongan scene (diberi jeda) jadi satu file, sample rate disamakan.
const gap = (TTS_SCENE_GAP_MS / 1000).toFixed(3);
const chains = files.map(
  (_, i) =>
    `[${i}:a]aresample=24000,aformat=channel_layouts=mono${i < files.length - 1 ? `,apad=pad_dur=${gap}` : ""}[a${i}]`,
);
const filter = `${chains.join(";")};${files.map((_, i) => `[a${i}]`).join("")}concat=n=${files.length}:v=0:a=1[out]`;
execFileSync(
  "npx",
  [
    "remotion",
    "ffmpeg",
    "-hide_banner",
    "-loglevel",
    "error",
    ...files.flatMap((f) => ["-i", f]),
    "-filter_complex",
    filter,
    "-map",
    "[out]",
    "-c:a",
    "libmp3lame",
    "-b:a",
    "96k",
    voicePath,
    "-y",
  ],
  { stdio: ["ignore", "inherit", "inherit"], shell: process.platform === "win32" },
);
writeFileSync(markerPath, sha1(readFileSync(voicePath)));
console.log(`  -> ${voicePath} (${chosen})`);

if (transcribeAfter) {
  // Whisper memberi timestamp per kata, sama seperti untuk rekaman.
  const result = spawnSync(process.execPath, ["scripts/transcribe.mjs", videoId, "--force"], {
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}

// Pemeriksaan cepat sebelum render. Pemakaian:
//   npm run validate            -> semua folder di public/videos
//   npm run validate <videoId>  -> satu video
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { videoSchema } from "../src/lib/schema.ts";

const videosDir = path.join(process.cwd(), "public", "videos");
const requested = process.argv.slice(2);
const ids = requested.length
  ? requested
  : readdirSync(videosDir).filter((d) =>
      statSync(path.join(videosDir, d)).isDirectory(),
    );

const WORDS_PER_SECOND = 2.5; // perkiraan kasar kecepatan bicara
const MAX_CODE_COLUMNS = 38;
let failed = false;

for (const id of ids) {
  const dir = path.join(videosDir, id);
  const specPath = path.join(dir, "video.json");
  console.log(`\n== ${id}`);
  if (!existsSync(specPath)) {
    console.log("  X video.json tidak ada");
    failed = true;
    continue;
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(specPath, "utf8"));
  } catch (e) {
    console.log(`  X JSON tidak valid: ${(e as Error).message}`);
    failed = true;
    continue;
  }

  const parsed = videoSchema.safeParse(raw);
  if (!parsed.success) {
    failed = true;
    for (const issue of parsed.error.issues) {
      console.log(`  X ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
    continue;
  }

  const video = parsed.data;
  const words = video.scenes.reduce(
    (n, s) => n + s.narration.split(/\s+/).filter(Boolean).length,
    0,
  );
  console.log(
    `  OK ${video.scenes.length} scene, ${words} kata (~${Math.round(words / WORDS_PER_SECOND)} dtk)`,
  );

  video.scenes.forEach((scene, i) => {
    if (scene.type === "template") {
      for (const img of scene.props?.images ?? []) {
        if (/^(https?:|data:)/.test(img)) {
          console.log(
            `  ! scene ${i + 1}: gambar online ${img} (render butuh internet)`,
          );
          continue;
        }
        const file = img.startsWith("/")
          ? path.join(process.cwd(), "public", img.slice(1))
          : path.join(dir, img);
        if (!existsSync(file)) {
          console.log(`  X scene ${i + 1}: gambar tidak ada: ${img}`);
          failed = true;
        }
      }
      return;
    }
    if (scene.type !== "code") return;
    const lines = scene.code.replace(/\s+$/, "").split("\n");
    const longest = Math.max(...lines.map((l) => l.length));
    if (longest > MAX_CODE_COLUMNS) {
      console.log(
        `  ! scene ${i + 1}: baris kode terpanjang ${longest} karakter (> ${MAX_CODE_COLUMNS}), font akan mengecil`,
      );
    }
    for (const [from, to] of scene.highlightLines ?? []) {
      if (from > to || to > lines.length) {
        console.log(
          `  X scene ${i + 1}: highlightLines [${from},${to}] di luar ${lines.length} baris`,
        );
        failed = true;
      }
    }
  });

  console.log(
    existsSync(path.join(dir, video.voice))
      ? `  OK suara: ${video.voice}`
      : `  X file suara tidak ada: ${video.voice}`,
  );
  if (!existsSync(path.join(dir, video.voice))) failed = true;
  console.log(
    existsSync(path.join(dir, "captions.json"))
      ? "  OK captions.json ada"
      : `  ! captions.json belum ada -> npm run transcribe ${id}`,
  );
}

process.exit(failed ? 1 : 0);

// Uji logika sinkronisasi: node --experimental-strip-types scripts/test-timing.ts
import assert from "node:assert/strict";
import {
  alignScriptToCaptions,
  computeSceneTimings,
  estimateTimedWords,
  splitNarration,
  toCaptionTokens,
} from "../src/lib/align.ts";

const scenes = [
  { narration: "Hati-hati, N+1 query bikin API Laravel kamu lambat." },
  { narration: "Lihat kode ini. Setiap iterasi menjalankan satu query baru." },
  { narration: "Solusinya pakai eager loading dengan method with." },
];
const script = splitNarration(scenes);

// Simulasi keluaran Whisper: ada salah dengar ("larvel"), kata hilang ("kamu"),
// kata tambahan ("eh"), dan token noise.
const w = (text: string, startMs: number, endMs: number) => ({
  text: ` ${text}`,
  startMs,
  endMs,
  timestampMs: null,
  confidence: null,
});
const captions = [
  w("[BLANK_AUDIO]", 0, 300),
  w("Hati-hati", 400, 900),
  w("N+1", 950, 1400),
  w("query", 1450, 1800),
  w("bikin", 1850, 2100),
  w("API", 2150, 2500),
  w("Larvel", 2550, 3000),
  w("lambat", 3200, 3700),
  w("Lihat", 4200, 4500),
  w("kode", 4550, 4800),
  w("ini", 4850, 5000),
  w("eh", 5050, 5200),
  w("Setiap", 5300, 5700),
  w("iterasi", 5750, 6200),
  w("menjalankan", 6250, 6900),
  w("satu", 6950, 7200),
  w("query", 7250, 7600),
  w("baru", 7650, 8000),
  w("Solusinya", 8800, 9400),
  w("pakai", 9450, 9700),
  w("eager", 9750, 10100),
  w("loading", 10150, 10600),
  w("dengan", 10650, 10900),
  w("method", 10950, 11300),
  w("with", 11350, 11800),
];
const totalMs = 12600;

const words = alignScriptToCaptions(script, captions, totalMs);
assert.equal(words.length, script.length);

// 1) Teks caption = teks naskah (bukan ejaan Whisper).
assert.ok(words.some((x) => x.text === "Laravel"));
assert.ok(!words.some((x) => x.text.toLowerCase() === "larvel"));

// 2) Kata yang cocok memakai timestamp Whisper persis.
const byText = (t: string) => words.find((x) => x.text === t)!;
assert.equal(byText("Hati-hati,").startMs, 400);
assert.equal(byText("lambat.").startMs, 3200);
assert.equal(byText("Solusinya").startMs, 8800);

// 3) Kata yang hilang di Whisper ("kamu") diinterpolasi di antara tetangganya.
const kamu = byText("kamu");
assert.ok(kamu.startMs >= byText("Laravel").startMs);
assert.ok(kamu.endMs <= byText("lambat.").startMs + 1);

// 4) Urut dan tidak tumpang-tindih.
for (let i = 1; i < words.length; i++) {
  assert.ok(words[i].startMs >= words[i - 1].startMs, `urut @${i}`);
  assert.ok(words[i - 1].endMs <= words[i].startMs + 1, `overlap @${i}`);
  assert.ok(words[i].endMs > words[i].startMs, `durasi @${i}`);
}

// 5) Batas scene mengikuti kata pertama tiap scene (dikurangi lead).
const timings = computeSceneTimings(words, scenes.length, totalMs, 30, 120);
assert.equal(timings[0].fromFrame, 0);
assert.equal(timings[1].fromMs, 4200 - 120);
assert.equal(timings[2].fromMs, 8800 - 120);
assert.equal(timings[2].toMs, totalMs);
const sum = timings.reduce((a, t) => a + t.durationInFrames, 0);
assert.equal(sum, Math.ceil((totalMs / 1000) * 30));
timings.forEach((t, i) => i > 0 && assert.equal(t.fromFrame, timings[i - 1].fromFrame + timings[i - 1].durationInFrames));

// 6) Cadangan tanpa captions.json: tetap urut dan menutup seluruh durasi.
const est = estimateTimedWords(script, totalMs);
assert.equal(est[0].startMs, 0);
assert.ok(Math.abs(est[est.length - 1].endMs - totalMs) < 1e-6);
const estTimings = computeSceneTimings(est, scenes.length, totalMs, 30, 120);
assert.equal(estTimings.length, 3);

// 7) Token caption: spasi di depan kecuali token pertama.
const tokens = toCaptionTokens(words);
assert.equal(tokens[0].text, "Hati-hati,");
assert.equal(tokens[1].text, " N+1");

// 8) Tanpa Whisper sama sekali (captions kosong) tidak crash.
const none = alignScriptToCaptions(script, [], totalMs);
assert.equal(none.length, script.length);
none.forEach((x) => assert.ok(Number.isFinite(x.startMs) && Number.isFinite(x.endMs)));

console.log(`OK — ${words.length} kata, ${timings.length} scene, semua pengujian lolos`);

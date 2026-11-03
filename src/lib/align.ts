// Logika murni (tanpa Remotion/DOM) supaya bisa diuji lewat `npm run test:timing`.
//
// Ide: teks caption diambil dari NASKAH (ejaan istilah teknis selalu benar),
// sedangkan Whisper hanya dipakai untuk timestamp. Kata naskah dan kata Whisper
// disejajarkan dengan alignment urutan (Needleman-Wunsch) + pencocokan fuzzy.
import type { Caption } from "@remotion/captions";

export type ScriptWord = { text: string; sceneIndex: number };
export type TimedWord = ScriptWord & { startMs: number; endMs: number };
export type SceneTiming = {
  fromMs: number;
  toMs: number;
  fromFrame: number;
  durationInFrames: number;
};

const MS_PER_CHAR = 65;
const MIN_WORD_MS = 60;

const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");

const levenshtein = (a: string, b: string): number => {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = cur;
  }
  return prev[b.length];
};

const similar = (a: string, b: string): boolean => {
  if (!a || !b) return false;
  if (a === b) return true;
  const max = Math.max(a.length, b.length);
  if (max <= 3) return false;
  return 1 - levenshtein(a, b) / max >= 0.6;
};

export const splitNarration = (scenes: { narration: string }[]): ScriptWord[] =>
  scenes.flatMap((scene, sceneIndex) =>
    scene.narration
      .split(/\s+/)
      .filter(Boolean)
      .map((text) => ({ text, sceneIndex })),
  );

type Spoken = { norm: string; startMs: number; endMs: number };

const toSpoken = (captions: Caption[]): Spoken[] =>
  captions
    .filter((c) => !/^\s*[[(].*[\])]\s*$/.test(c.text)) // [BLANK_AUDIO], (musik)
    .map((c) => ({ norm: normalize(c.text), startMs: c.startMs, endMs: c.endMs }))
    .filter((c) => c.norm.length > 0);

const alignSequences = (a: string[], b: string[]): Array<[number, number]> => {
  const MATCH = 3;
  const SUB = -1;
  const GAP = -2;
  const n = a.length;
  const m = b.length;
  const score = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0),
  );
  for (let i = 1; i <= n; i++) score[i][0] = i * GAP;
  for (let j = 1; j <= m; j++) score[0][j] = j * GAP;
  const pair = (i: number, j: number) => (similar(a[i], b[j]) ? MATCH : SUB);
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      score[i][j] = Math.max(
        score[i - 1][j - 1] + pair(i - 1, j - 1),
        score[i - 1][j] + GAP,
        score[i][j - 1] + GAP,
      );
    }
  }
  const pairs: Array<[number, number]> = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && score[i][j] === score[i - 1][j - 1] + pair(i - 1, j - 1)) {
      pairs.push([i - 1, j - 1]);
      i--;
      j--;
    } else if (i > 0 && score[i][j] === score[i - 1][j] + GAP) {
      i--;
    } else {
      j--;
    }
  }
  return pairs.reverse();
};

/** Beri timestamp ke tiap kata naskah memakai hasil Whisper. */
export const alignScriptToCaptions = (
  script: ScriptWord[],
  captions: Caption[],
  totalMs: number,
): TimedWord[] => {
  const spoken = toSpoken(captions);
  const norms = script.map((w) => normalize(w.text));
  const anchors = new Map<number, Spoken>();
  for (const [i, j] of alignSequences(norms, spoken.map((s) => s.norm))) {
    if (similar(norms[i], spoken[j].norm)) anchors.set(i, spoken[j]);
  }

  const out: TimedWord[] = script.map((w) => ({ ...w, startMs: NaN, endMs: NaN }));
  anchors.forEach((s, i) => {
    out[i].startMs = s.startMs;
    out[i].endMs = s.endMs;
  });

  // Kata tanpa pasangan: interpolasi di antara dua jangkar terdekat.
  let i = 0;
  while (i < out.length) {
    if (!Number.isNaN(out[i].startMs)) {
      i++;
      continue;
    }
    let end = i;
    while (end < out.length && Number.isNaN(out[end].startMs)) end++;
    const run = out.slice(i, end);
    const weights = run.map((w) => Math.max(1, normalize(w.text).length));
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const left = i > 0 ? out[i - 1].endMs : 0;
    const right = end < out.length ? out[end].startMs : null;
    let from: number;
    let to: number;
    if (right !== null && i > 0) {
      from = left;
      to = right;
    } else if (right !== null) {
      to = right;
      from = Math.max(0, right - weightSum * MS_PER_CHAR);
    } else {
      from = left;
      to = Math.min(Math.max(totalMs, left), left + weightSum * MS_PER_CHAR);
    }
    const span = Math.max(to - from, run.length * MIN_WORD_MS);
    let acc = 0;
    run.forEach((w, k) => {
      w.startMs = from + (acc / weightSum) * span;
      acc += weights[k];
      w.endMs = from + (acc / weightSum) * span;
    });
    i = end;
  }

  // Pastikan urut dan tidak saling tumpang-tindih.
  for (let k = 1; k < out.length; k++) {
    out[k].startMs = Math.max(out[k].startMs, out[k - 1].startMs);
  }
  for (let k = 0; k < out.length; k++) {
    const next = out[k + 1];
    if (next && next.startMs > out[k].startMs) {
      out[k].endMs = Math.min(out[k].endMs, next.startMs);
    }
    out[k].endMs = Math.max(out[k].endMs, out[k].startMs + MIN_WORD_MS);
  }
  return out;
};

/** Cadangan saat captions.json belum ada: bagi durasi menurut panjang kata. */
export const estimateTimedWords = (
  script: ScriptWord[],
  totalMs: number,
): TimedWord[] => {
  const weights = script.map(
    (w) =>
      Math.max(1, normalize(w.text).length) + (/[.!?,:;]$/.test(w.text) ? 2 : 0),
  );
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  return script.map((w, i) => {
    const startMs = (acc / sum) * totalMs;
    acc += weights[i];
    return { ...w, startMs, endMs: (acc / sum) * totalMs };
  });
};

export const computeSceneTimings = (
  words: TimedWord[],
  sceneCount: number,
  totalMs: number,
  fps: number,
  leadMs: number,
): SceneTiming[] => {
  const starts: number[] = [];
  for (let s = 0; s < sceneCount; s++) {
    if (s === 0) {
      starts.push(0);
      continue;
    }
    const first = words.find((w) => w.sceneIndex === s);
    const wanted = first ? first.startMs - leadMs : starts[s - 1];
    starts.push(Math.max(wanted, starts[s - 1]));
  }
  return starts.map((fromMs, s) => {
    const last = s === sceneCount - 1;
    const toMs = last ? totalMs : starts[s + 1];
    const fromFrame = Math.round((fromMs / 1000) * fps);
    const toSec = toMs / 1000;
    const endFrame = last ? Math.ceil(toSec * fps) : Math.round(toSec * fps);
    return {
      fromMs,
      toMs,
      fromFrame,
      durationInFrames: Math.max(1, endFrame - fromFrame),
    };
  });
};

/** Ubah kata naskah ber-timestamp jadi token caption (teks dari naskah). */
export const toCaptionTokens = (words: TimedWord[]): Caption[] =>
  words.map((w, i) => ({
    text: i === 0 ? w.text : ` ${w.text}`,
    startMs: w.startMs,
    endMs: w.endMs,
    timestampMs: (w.startMs + w.endMs) / 2,
    confidence: null,
  }));

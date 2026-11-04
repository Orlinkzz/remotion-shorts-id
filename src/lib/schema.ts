import { z } from "zod";
import { templateNames } from "../templates/names.ts";

// narration = teks yang diucapkan di scene ini. Dipakai untuk (1) teks caption
// dan (2) menentukan kapan scene mulai/selesai dari timestamp Whisper.
const narration = z.string().min(1);

// speech = (opsional) teks untuk TTS kalau pelafalannya perlu beda dari caption,
// mis. narration "N+1 query" -> speech "N plus one query". Caption tetap dari narration.
const speech = z.string().min(1).optional();

export const hookSceneSchema = z.object({
  type: z.literal("hook"),
  narration,
  speech,
  text: z.string().min(1), // *kata* diberi warna aksen
  subtext: z.string().optional(),
});

export const codeSceneSchema = z.object({
  type: z.literal("code"),
  narration,
  speech,
  language: z.string().default("tsx"),
  filename: z.string().optional(),
  code: z.string().min(1),
  // Rentang baris (1-based, inklusif) yang disorot bergantian selama scene.
  highlightLines: z
    .array(z.tuple([z.number().int().min(1), z.number().int().min(1)]))
    .optional(),
});

export const pointsSceneSchema = z.object({
  type: z.literal("points"),
  narration,
  speech,
  title: z.string().optional(),
  items: z.array(z.string().min(1)).min(1).max(6),
});

export const outroSceneSchema = z.object({
  type: z.literal("outro"),
  narration,
  speech,
  cta: z.string().min(1),
  handle: z.string().optional(),
});

// Isi template. Semua opsional: tiap template hanya memakai sebagian field
// (lihat docs/templates.md) dan punya contoh bawaan untuk field yang kosong.
export const templatePropsSchema = z
  .object({
    title: z.string().min(1).optional(), // *kata* diberi warna aksen
    subtitle: z.string().min(1).optional(),
    text: z.string().min(1).optional(), // kutipan, isi notifikasi, kalimat panjang
    items: z.array(z.string().min(1)).min(1).max(8).optional(), // daftar/label
    values: z.array(z.number()).min(1).max(8).optional(), // data chart, urut sesuai items
    value: z.number().optional(), // angka tunggal: counter, persen, hitung mundur
    unit: z.string().optional(), // akhiran angka, mis. "%", "ms", "x"
    // Relatif terhadap folder video (mis. "img/before.png") atau URL http(s).
    images: z.array(z.string().min(1)).min(1).max(8).optional(),
    accent: z.string().optional(), // warna aksen CSS, default theme.colors.accent
  })
  .strict();

// Salah satu dari 81 template (src/templates), diisi lewat props.
export const templateSceneSchema = z.object({
  type: z.literal("template"),
  narration,
  speech,
  template: z.enum(templateNames),
  props: templatePropsSchema.optional(),
});

export const sceneSchema = z.discriminatedUnion("type", [
  hookSceneSchema,
  codeSceneSchema,
  pointsSceneSchema,
  outroSceneSchema,
  templateSceneSchema,
]);

export const videoSchema = z.object({
  $schema: z.string().optional(), // untuk autocomplete di VS Code
  title: z.string().min(1),
  voice: z.string().default("voice.mp3"), // relatif terhadap folder video
  scenes: z.array(sceneSchema).min(1),
});

export type Scene = z.infer<typeof sceneSchema>;
export type HookScene = z.infer<typeof hookSceneSchema>;
export type CodeScene = z.infer<typeof codeSceneSchema>;
export type PointsScene = z.infer<typeof pointsSceneSchema>;
export type TemplateScene = z.infer<typeof templateSceneSchema>;
export type TemplateSceneProps = z.infer<typeof templatePropsSchema>;
export type OutroScene = z.infer<typeof outroSceneSchema>;
export type VideoSpec = z.infer<typeof videoSchema>;

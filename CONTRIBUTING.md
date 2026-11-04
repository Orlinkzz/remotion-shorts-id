# Berkontribusi ke remotion-shorts-id

Terima kasih sudah mau ikut membangun proyek ini. Kontribusi apa pun diterima: video contoh baru, template, scene, provider TTS, perbaikan bug, atau dokumentasi.

## Sebelum mulai

- Cek [Issues](https://github.com/Orlinkzz/remotion-shorts-id/issues) dulu supaya tidak dobel. Untuk perubahan besar (tipe scene baru, mengubah skema `video.json`), buka issue untuk diskusi sebelum menulis kode.
- Proyek ini memakai [Remotion](https://www.remotion.dev). Remotion **bukan** MIT: gratis untuk individu, tim maksimal 3 orang, dan organisasi nirlaba; perusahaan yang lebih besar perlu [lisensi perusahaan](https://www.remotion.dev/license). Kode di repo ini sendiri MIT (lihat `LICENSE` dan `NOTICE.md`).
- Dengan mengirim pull request, kamu setuju kontribusimu dirilis di bawah lisensi MIT.

## Setup

Butuh Node.js `^20.19`, `^22.13`, atau `>=24`, dan Git.

```bash
git clone https://github.com/Orlinkzz/remotion-shorts-id.git
cd remotion-shorts-id
npm install
npm run dev          # Remotion Studio
```

Whisper.cpp (untuk `npm run transcribe`) terunduh otomatis saat pertama dipakai. TTS default (`edge`) tidak butuh API key. Kalau mencoba provider lain, salin `.env.example` ke `.env`; file `.env` tidak boleh ikut di-commit.

## Perintah yang sering dipakai

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Studio: composition `Short` dan galeri folder `Templates` |
| `npm run tts <id>` | Buat `voice.mp3` dari narasi, lalu transcribe |
| `npm run transcribe <id>` | Buat `captions.json` dari `voice.mp3` |
| `npm run validate [id]` | Cek `video.json`, file suara, dan gambar |
| `npm run test:timing` | Tes alignment caption dan timing scene |
| `npm run lint` | ESLint + TypeScript |
| `npm run schema` | Buat ulang `video.schema.json` setelah mengubah `src/lib/schema.ts` |
| `npm run gen:templates` | Buat ulang `names.ts`, `registry.ts`, dan galeri Studio (`src/compositions/TemplateGallery.tsx`) setelah menambah/menghapus template |
| `npm run render <id>` | Render ke `out/<id>.mp4` |

## Alur kontribusi

1. Fork repo, lalu buat branch dari `main`: `feat/template-terminal`, `fix/caption-offset`, `docs/readme-tts`.
2. Kerjakan perubahan kecil dan fokus. Satu PR untuk satu hal.
3. Jalankan checklist di bawah.
4. Commit dengan pesan yang jelas, gaya [Conventional Commits](https://www.conventionalcommits.org):
   `feat: template terminal-typing`, `fix(tts): retry saat edge timeout`, `docs: contoh props chart`.
5. Buka pull request ke `main` dan jelaskan **apa** yang berubah, **kenapa**, dan **cara mengeceknya**. Untuk perubahan visual, sertakan screenshot atau GIF dari Studio.

### Checklist sebelum PR

- [ ] `npm run lint` lolos tanpa error
- [ ] `npm run validate` lolos
- [ ] `npm run test:timing` lolos (wajib kalau menyentuh `src/lib/align.ts` atau timing)
- [ ] Perubahan visual sudah dicek di Studio pada 1080×1920
- [ ] Kalau skema berubah: `npm run schema` dijalankan dan dokumentasi (`README.md`, `AGENTS.md`, `remotion-shorts-skill/SKILL.md`, `docs/templates.md`) ikut diperbarui
- [ ] Tidak ada API key, `.env`, atau file besar hasil render (`out/`, `.cache/`) yang ikut di-commit

## Gaya kode

- TypeScript + React, format Prettier: indentasi 2 spasi, kutip ganda, titik koma, trailing comma.
- Komentar dan teks UI dalam Bahasa Indonesia. Nama variabel/fungsi dalam bahasa Inggris.
- Semua keputusan visual (warna, ukuran, area aman) diambil dari `src/theme.ts`, jangan ditulis langsung.
- Render harus **deterministik**: animasi hanya dari `useCurrentFrame()` (`interpolate`, `spring`). Dilarang animasi/transition CSS, `Math.random()` (pakai `random(seed)` dari Remotion), `Date`, atau state/efek React untuk animasi.
- Gambar pakai `<Img>` dari Remotion, aset lokal lewat `staticFile()`.

## Menambah template

Template ada di `src/templates/<nama-kebab>.tsx`, satu file per template. Semua template menerima props yang sama (`TemplateProps`, didefinisikan di `src/lib/schema.ts`) dan memakai alat bersama di `src/lib/template-kit.tsx`.

```tsx
// Diadaptasi dari "..." (sumber, lisensi) — atau: Template baru.
// Fungsi singkat template dalam satu baris.
// Props: title (judul), items (daftar), accent.
import { contentArea, TemplateTitle, useTemplate, type TemplateProps } from "../lib/template-kit";

const defaults = { title: "Contoh *judul*" };

export default function NamaTemplate(props: TemplateProps) {
  const { title, accent, frame, fps, durationInFrames } = useTemplate(props, defaults);
  return (
    <div style={{ ...contentArea }}>
      <TemplateTitle text={title} accent={accent} />
    </div>
  );
}
```

Aturan:

- Pakai field yang sudah ada (`title`, `subtitle`, `text`, `items`, `values`, `value`, `unit`, `images`, `accent`). Kalau butuh field baru, diskusikan dulu di issue karena itu mengubah skema untuk semua template.
- Sediakan `defaults` berbahasa Indonesia supaya template tetap tampil di galeri tanpa props.
- Teks dan konten utama berada di dalam `contentArea`. Bagian bawah (560 px) dipakai caption dan UI TikTok/Reels/Shorts.
- Jangan menutup seluruh frame dengan latar solid (latar NotebookPaper harus tetap terlihat), kecuali template foto layar penuh atau layar A pada template transisi.
- Harus tetap terlihat benar untuk durasi scene 2–20 detik. Pakai `durationInFrames` dari `useTemplate` untuk efek yang mengikuti panjang scene.
- Gambar lewat `TemplateImage` (menampilkan placeholder kalau `images` kosong). Jangan memakai URL gambar eksternal sebagai default.
- Daftar dengan `items`/`values` harus aman untuk panjang 1 sampai 8.

Setelah itu:

1. `npm run gen:templates`
2. Cek di Studio: folder **Templates** → `tpl-<nama>`, coba ubah props di panel kanan.
3. Tambahkan baris di `docs/templates.md` dan daftar template di `remotion-shorts-skill/SKILL.md`.
4. `npm run schema` dan `npm run lint`.

## Menambah tipe scene

1. Tambah skema di `src/lib/schema.ts` dan masukkan ke `sceneSchema`.
2. Buat komponen di `src/scenes/` dan sambungkan di `src/scenes/SceneView.tsx`.
3. `npm run schema`, lalu perbarui `README.md`, `AGENTS.md`, `remotion-shorts-skill/SKILL.md`, dan `site/index.html`.
4. Tambahkan contoh pemakaian di salah satu `public/videos/*/video.json` atau video contoh baru.

## Menambah provider TTS

1. Tambahkan objek provider di `scripts/tts-providers.mjs` dengan bentuk yang sama seperti provider lain: `name`, `available()` (false kalau key belum diisi), `missing` (pesan untuk pengguna), dan `async synth(text, { voice, locale, rate })` yang mengembalikan buffer MP3. Daftarkan di objek `providers`.
2. Daftarkan namanya di `TTS_PROVIDERS` dan suaranya di `tts-config.mjs`.
3. Kalau butuh API key, tambahkan variabelnya ke `.env.example` (kosong) dan jelaskan di README.
4. Provider gratis tanpa key lebih diutamakan. Provider berbayar harus opsional dan tidak menjadi default.

## Menambah video contoh

1. Buat folder `public/videos/<id>/` berisi `video.json` (ikuti `video.schema.json`).
2. `npm run tts <id>` → `npm run validate <id>` → cek di Studio (ubah `videoId` di panel Props).
3. Commit `video.json`, `voice.mp3`, dan `captions.json`. Hasil render (`out/`) tidak perlu di-commit.

## Melaporkan bug

Sertakan: OS, versi Node (`node -v`), perintah yang dijalankan, pesan error lengkap, dan `video.json` minimal yang memicu bug (kalau ada).

## Kode etik

Bersikap sopan dan saling menghargai. Kritik ditujukan ke kode, bukan ke orang. Maintainer berhak menutup issue/PR atau memblokir akun yang melanggar.

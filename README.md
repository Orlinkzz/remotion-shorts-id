# senimankode-shorts

Generator video pendek edukasi (Reels / TikTok / YouTube Shorts, 1080×1920) di atas Remotion.
Gabungan dua template:

- **remotion-dev/template-tiktok** → basis proyek, caption per kata, pipeline Whisper.cpp.
- **reactvideoeditor/remotion-templates** (MIT) → ke-81 template disalin ke `src/templates/`. Tiga di antaranya (`bounce-text`, `animated-list`, `end-card`) juga diadaptasi jadi scene berparameter `hook`, `points`, `outro` di `src/scenes/`.

Scene `code` (syntax highlight) dibuat baru karena tidak ada di kedua template.

## Alur kerja satu video

```bash
npm install
npm run dev                         # Remotion Studio, buka composition "Short"
```

1. Buat folder `public/videos/<id>/` berisi `video.json` (naskah + scene).
2. Suara, pilih salah satu:
   - **TTS (tanpa rekaman):** `npm run tts <id>` → membuat `voice.mp3` dari naskah, lalu otomatis `captions.json`.
   - **Rekaman sendiri:** taruh `voice.mp3` (juga bisa `.wav` / `.m4a`, nama file diatur di field `voice`), lalu `npm run transcribe <id>`.

   Transkripsi pertama kali mengunduh Whisper.cpp + model `small` ±466 MB.
3. Cek di Studio. Setelah `video.json` / `captions.json` berubah, Studio memuat ulang datanya; kalau durasi tidak ikut berubah, pilih *Reload composition*.
4. `npm run render <id>` → `out/<id>.mp4`.

Contoh siap pakai: `public/videos/n-plus-one/`. File `voice.mp3` di sana hanya audio **hening 40 detik** sebagai placeholder supaya Studio bisa langsung dibuka (timing diperkirakan dari panjang kata). Ganti dengan rekamanmu lalu jalankan transcribe, atau buat suaranya dengan `npm run tts n-plus-one -- --force`.

## TTS (`npm run tts`)

- Provider dicoba berurutan sesuai `TTS_PROVIDERS` di `tts-config.mjs`: `edge` → `azure` → `google` → `gtranslate`. Kalau satu gagal (limit, jaringan, key kosong), **seluruh** video dibuat ulang dengan provider berikutnya supaya suaranya tetap satu orang.
  - `edge`: gratis tanpa key (suara neural Microsoft lewat layanan Read Aloud Edge, tidak resmi, bisa berubah sewaktu-waktu).
  - `azure` / `google`: resmi, ada kuota gratis bulanan, butuh key di `.env` (lihat `.env.example`). Tanpa key otomatis dilewati.
  - `gtranslate`: cadangan terakhir, gratis tanpa key, suara robotik.
- Paksa satu provider: `npm run tts <id> -- --provider=google`. Hanya audio (tanpa Whisper): `-- --no-transcribe`.
- Suara, kecepatan (`TTS_RATE`), dan jeda antar scene diatur di `tts-config.mjs`. Istilah Inggris lebih fasih dengan suara multibahasa (contoh ada di komentar config).
- Pelafalan: isi `speech` di scene kalau yang diucapkan harus beda dari caption, mis. `"narration": "N+1 query"`, `"speech": "N plus one query"`.
- Audio per scene di-cache di `.cache/tts/<id>/`; hanya scene yang teksnya berubah yang dibuat ulang.
- `voice.mp3` hasil rekaman tidak akan ditimpa kecuali ditambah `-- --force`.
- Cek lisensi/ketentuan provider sebelum dipakai komersial, terutama `edge` dan `gtranslate`.

## 81 template RVE

- **Galeri:** `npm run dev`, lalu buka folder **Templates** di sidebar Studio (`tpl-<nama>`), 6 detik per template di 1080×1920.
- **Dipakai di video:** scene `{ "type": "template", "narration": "...", "template": "stat-counter" }` merender template apa adanya, memenuhi seluruh frame.
- **Batasan:** teks, warna, dan angka di tiap template tertulis langsung di kodenya (aslinya contoh tanpa props), dan banyak yang dirancang untuk landscape sehingga tata letaknya di 9:16 perlu dicek satu per satu. Untuk yang sering dipakai, jadikan scene berparameter seperti `Hook`/`Points`/`Outro`.
- **Diadaptasi:** `ken-burns`, `parallax-pan`, `zoom-pulse` memakai animasi CSS dan `next/image`, yang tidak cocok untuk render video. Ketiganya sudah diubah ke interpolasi berbasis frame dan `<Img>` Remotion. Gambar bawaannya berasal dari Unsplash/Pexels, jadi butuh internet saat render.
- Setelah menambah/menghapus file di `src/templates/`: `npm run gen:templates`.

## Bekerja dengan AI di VS Code

Tidak ada server MCP: seluruh alur berbasis berkas dan perintah npm, jadi agent yang sudah ada di VS Code cukup menulis `video.json` lalu menjalankan skrip. `AGENTS.md` (dan `CLAUDE.md` yang mengimpornya) berisi petunjuk untuk agent. `video.schema.json` memberi autocomplete dan validasi saat mengedit `video.json` di VS Code, dan `npm run validate` memeriksa naskah sebelum render.

## Cara sinkronisasi bekerja

Teks caption diambil dari `narration` di naskah, bukan dari hasil Whisper, sehingga ejaan istilah teknis (Laravel, PostgreSQL, Next.js) selalu benar. Whisper hanya memberi timestamp: kata naskah disejajarkan dengan kata Whisper (pencocokan fuzzy), kata yang tidak terdeteksi diinterpolasi. Scene mulai sedikit sebelum kata pertamanya diucapkan, dan durasi video = panjang audio + jeda akhir.
Kalau kamu ad-lib jauh dari naskah, perbaiki `narration` atau edit `captions.json`.

Logika ini diuji: `npm run test:timing`.

## Tipe scene (`video.json`)

| type | field |
|---|---|
| `hook` | `text` (`*kata*` diberi warna), `subtext?` |
| `code` | `language`, `filename?`, `code`, `highlightLines?` (mis. `[[1,1],[3,4]]`, disorot bergantian) |
| `points` | `title?`, `items` (1–6) |
| `outro` | `cta`, `handle?` (default: nama brand di `theme.ts`) |
| `template` | `template` = nama salah satu dari 81 template RVE (lihat `src/templates/names.ts`) |

Semua scene juga boleh punya `speech` (teks untuk TTS bila pelafalan beda dari caption).

Setiap scene wajib punya `narration`. Bahasa `code` yang tersedia: bawaan prism-react-renderer (tsx, typescript, go, kotlin, python, sql, json, yaml, …) ditambah php, bash, dart, docker. Usahakan baris kode ≤ ±38 karakter; ukuran font mengecil otomatis untuk baris yang lebih panjang.

## Pengaturan

- `src/theme.ts`: warna, area aman, brand, gaya caption (`uppercase` default mati).
- Background: `NotebookPaper` (`src/compositions/notebook-paper.element.tsx`), diatur lewat prop `bg` di panel Props Studio; default-nya `notebookPaperDefaults`. `palette` selain `custom` memakai preset warna dan mengabaikan `baseColor`/`blob*`/`gridColor`.
- `whisper-config.mjs`: model `small` (multibahasa) dan bahasa `id`. Naikkan ke `medium` kalau timestamp sering meleset. Jangan pakai model berakhiran `.en` untuk konten Indonesia. Ganti bahasa ke `"auto"` kalau rasio Indonesia/Inggris berimbang.

## Struktur

```
src/
  compositions/Short.tsx      komposisi + calculateMetadata (durasi dari audio)
  compositions/notebook-paper.element.tsx  background (grid, cahaya, grain)
  scenes/                     Hook, Code, Points, Outro
  components/                 Captions, Emphasis
  lib/align.ts                sinkronisasi naskah <-> Whisper (logika murni, teruji)
  lib/load-video.ts           memuat video.json + audio + captions.json
  templates/                  81 template RVE + names.ts/registry.ts (otomatis)
  lib/voice/                  VoiceProvider (fase 1: RecordedVoice; fase 3: TtsVoice)
scripts/                      tts, tts-providers, transcribe, render, validate, gen-schema, gen-template-registry, test-timing
public/videos/<id>/           video.json, voice.mp3, captions.json
```

## Lisensi

Kode asli proyek ini berlisensi **MIT** (`LICENSE`). Komponen pihak ketiga tetap memakai lisensinya sendiri, rinciannya di `NOTICE.md`:

- **Remotion** memakai **Remotion License**, bukan MIT: gratis (termasuk untuk video komersial) bagi individu, perusahaan dengan maksimal 3 karyawan, dan nirlaba; perusahaan yang lebih besar wajib membeli Company License. Cek kelayakanmu di https://www.remotion.dev/license.
- Template RVE: gratis dipakai, atribusi dihargai (header asli dipertahankan).
- Audio TTS mengikuti ketentuan provider yang dipakai; untuk konten komersial pakai `azure`/`google` atau rekaman sendiri.

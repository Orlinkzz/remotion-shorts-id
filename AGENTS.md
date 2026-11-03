# Petunjuk untuk AI agent (VS Code, Claude Code, Copilot, dll.)

Proyek ini membuat video pendek vertikal (1080x1920) dengan Remotion. Semua input berupa **berkas**
dan semua aksi berupa **perintah npm**, jadi agent cukup menulis berkas dan menjalankan perintah;
tidak perlu server MCP khusus.

## Perintah
- `npm run validate [id]`   periksa `public/videos/<id>/video.json` (jalankan setiap selesai mengedit)
- `npm run schema`          buat ulang `video.schema.json` setelah mengubah `src/lib/schema.ts`
- `npm run tts <id>`        buat `voice.mp3` dari naskah (TTS, provider di `tts-config.mjs`), lalu `captions.json`
- `npm run transcribe <id>` buat `captions.json` dari rekaman suara (Whisper.cpp)
- `npm run test:timing`     uji logika sinkronisasi naskah <-> Whisper
- `npm run dev`             Remotion Studio (composition `Short` dan folder `Templates`)
- `npm run render <id>`     hasil di `out/<id>.mp4`
- `npm run gen:templates`   buat ulang `src/templates/names.ts` dan `registry.ts`
- `npm run lint`            ESLint + TypeScript

## Membuat video baru
1. Buat `public/videos/<id>/video.json` (awali dengan `"$schema": "../../../video.schema.json"`).
2. Tiap scene wajib punya `narration`: kalimat yang BENAR-BENAR diucapkan di scene itu.
   Teks caption diambil dari sini, dan batas scene ditentukan dari timestamp kata-katanya.
   `speech` (opsional) = teks untuk TTS kalau pelafalan harus beda dari caption
   (mis. narration "N+1" -> speech "N plus one").
3. `npm run validate <id>`.
4. Suara, pilih salah satu:
   - TTS: `npm run tts <id>` (membuat `voice.mp3` + `captions.json`).
   - Rekaman: pengguna menyediakan `voice.mp3`, lalu `npm run transcribe <id>`.
   Jangan membuat file audio dengan cara lain. `npm run tts` menolak menimpa rekaman
   (voice.mp3 yang bukan hasil TTS) kecuali pengguna meminta `-- --force`.

## Tipe scene
`hook` (text, subtext?), `code` (language, filename?, code, highlightLines?),
`points` (title?, items 1-6), `outro` (cta, handle?), `template` (template = salah satu nama di
`src/templates/names.ts`, tampil apa adanya dengan teks bawaan RVE).
`*kata*` di `text`/`title`/`items` memberi warna aksen. Baris kode <= 38 karakter.
Naskah campuran Indonesia + Inggris; tulis istilah teknis dengan ejaan aslinya (Laravel, PostgreSQL).

## Aturan
- Jangan mengedit `src/templates/*` kecuali diminta (salinan template RVE, tiga di antaranya sudah
  diadaptasi: ken-burns, parallax-pan, zoom-pulse). `names.ts` dan `registry.ts` dibuat otomatis.
- Gaya visual diatur di `src/theme.ts`; background di `src/compositions/notebook-paper.element.tsx`
  (prop `bg`). Jangan menyebar warna/ukuran ke tiap scene.
- Scene baru: tambahkan skema di `src/lib/schema.ts`, komponen di `src/scenes/`, case di
  `SceneView.tsx`, lalu `npm run schema` dan `npm run lint`.
- TTS dibuat di Node (`scripts/tts.mjs`, provider di `scripts/tts-providers.mjs`) dan menghasilkan
  `voice.mp3` biasa, jadi komposisi tetap memakai `RecordedVoice`. Provider baru = tambah objek
  `{ name, available, synth }` di `tts-providers.mjs` dan namanya di `TTS_PROVIDERS`.
  API key hanya di `.env` (lihat `.env.example`), jangan ditulis di kode.
